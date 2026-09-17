import type { ColumnMapping, DataIssue, Dataset, GapFill, LongRow, Period, RawTable } from './types'
import { parsePeriods, withSubSteps } from './dates'
import { parseNumber } from './numbers'

/**
 * Baut aus Rohtabelle + Spaltenzuordnung den internen Long-Datensatz.
 * Prüft auf fehlende Werte, unlesbare Zahlen und Zeitlücken und meldet
 * sie als Issues (Fehler blockieren nicht, sondern werden übersprungen).
 */
export function buildDataset(table: RawTable, mapping: ColumnMapping): Dataset {
  const issues: DataIssue[] = []
  const names: string[] = []
  const nameSet = new Set<string>()
  const addName = (n: string) => { if (!nameSet.has(n)) { nameSet.add(n); names.push(n) } }
  const triples: { periodLabel: string | number; name: string; value: number | null; row: number }[] = []

  if (mapping.shape === 'long') {
    const { timeColumn, categoryColumn, valueColumn } = mapping
    if (categoryColumn == null || valueColumn == null) {
      issues.push({ level: 'error', message: 'Für das Long-Format müssen Zeit-, Kategorie- und Wertspalte zugeordnet sein.' })
      return { periods: [], names: [], rows: [], issues }
    }
    table.rows.forEach((r, i) => {
      const t = r[timeColumn]
      const n = r[categoryColumn]
      if (t == null || n == null || String(n).trim() === '') {
        issues.push({ level: 'warning', message: `Zeile ${i + 2}: Zeit oder Kategorie fehlt – Zeile übersprungen.`, row: i })
        return
      }
      const v = parseNumber(r[valueColumn])
      if (r[valueColumn] != null && v === null) issues.push({ level: 'warning', message: `Zeile ${i + 2}: „${r[valueColumn]}“ ist keine Zahl.`, row: i })
      addName(String(n).trim())
      triples.push({ periodLabel: t, name: String(n).trim(), value: v, row: i })
    })
  } else if (mapping.transposed) {
    // Zeilen = Kategorien, Header = Perioden
    const catCols = mapping.categoryColumns ?? []
    table.rows.forEach((r, i) => {
      const n = r[mapping.timeColumn]
      if (n == null || String(n).trim() === '') { issues.push({ level: 'warning', message: `Zeile ${i + 2}: Kategoriename fehlt – übersprungen.`, row: i }); return }
      addName(String(n).trim())
      for (const c of catCols) {
        const v = parseNumber(r[c])
        if (r[c] != null && v === null) issues.push({ level: 'warning', message: `Zeile ${i + 2}, Spalte „${table.headers[c]}“: „${r[c]}“ ist keine Zahl.`, row: i })
        triples.push({ periodLabel: table.headers[c], name: String(n).trim(), value: v, row: i })
      }
    })
  } else {
    const catCols = mapping.categoryColumns ?? []
    for (const c of catCols) addName(table.headers[c])
    table.rows.forEach((r, i) => {
      const t = r[mapping.timeColumn]
      if (t == null || String(t).trim() === '') { issues.push({ level: 'warning', message: `Zeile ${i + 2}: Periode fehlt – übersprungen.`, row: i }); return }
      for (const c of catCols) {
        const v = parseNumber(r[c])
        if (r[c] != null && v === null) issues.push({ level: 'warning', message: `Zeile ${i + 2}, Spalte „${table.headers[c]}“: „${r[c]}“ ist keine Zahl.`, row: i })
        triples.push({ periodLabel: t, name: table.headers[c], value: v, row: i })
      }
    })
  }

  const { periods, ordinal } = parsePeriods(triples.map((t) => t.periodLabel))
  if (ordinal && periods.length > 0) {
    issues.push({ level: 'warning', message: 'Die Perioden wurden nicht als Datum erkannt und werden in der vorliegenden Reihenfolge verwendet.' })
  }
  const isoByLabel = new Map<string, string>()
  for (const p of periods) isoByLabel.set(p.label, p.iso)
  // Für Datumsformate: Label -> iso über erneutes Parsen (Label ist das Original)
  const labelToIso = (l: string | number) => {
    const s = String(l).trim()
    if (isoByLabel.has(s)) return isoByLabel.get(s)!
    // Bei Datumserkennung: gleiches iso unterschiedliches Label (z.B. "2020" und "2020-01-01")
    const found = periods.find((p) => p.label === s)
    return found?.iso
  }

  const rows: LongRow[] = []
  const seen = new Set<string>()
  let missing = 0
  for (const t of triples) {
    const iso = labelToIso(t.periodLabel)
    if (!iso) continue
    const key = `${iso}|${t.name}`
    if (seen.has(key)) { issues.push({ level: 'warning', message: `Doppelter Eintrag für „${t.name}“ in Periode „${t.periodLabel}“ – letzter Wert gewinnt.`, row: t.row }) }
    seen.add(key)
    if (t.value === null) { missing++; continue }
    const idx = rows.findIndex((r) => r.date === iso && r.name === t.name)
    if (idx >= 0) rows[idx] = { date: iso, name: t.name, value: t.value }
    else rows.push({ date: iso, name: t.name, value: t.value })
  }
  if (missing > 0) issues.push({ level: 'warning', message: `${missing} fehlende Werte. Aktiviere „Datenlücken auffüllen“, damit Balken nicht verschwinden.` })
  const gaps = missingYears(periods)
  if (gaps.length > 0) issues.push({ level: 'warning', message: `Zeitlücke: ${gaps.length === 1 ? `Jahr ${gaps[0]}` : `Jahre ${gaps[0]}–${gaps[gaps.length - 1]}`} ohne Daten – wird bei „Datenlücken auffüllen“ ergänzt (interpoliert).` })
  // Lücken innerhalb einzelner Reihen: werden interpoliert und sind im Diagramm nicht zu erkennen
  for (const g of seriesGaps(periods, names, rows)) {
    issues.push({ level: 'warning', message: `„${g.name}“: ${g.years === 1 ? 'ein Jahr' : `${g.years} Jahre`} ohne Werte zwischen ${g.from} und ${g.to} – die Linie dort ist interpoliert.` })
  }
  if (periods.length < 2) issues.push({ level: 'error', message: 'Mindestens zwei Perioden werden benötigt.' })
  if (names.length === 0) issues.push({ level: 'error', message: 'Keine Kategorien gefunden.' })

  return { periods, names, rows, issues }
}

/**
 * Füllt Lücken (fehlende Werte je Kategorie/Periode) und fügt optional
 * Zwischenschritte ein. Ergebnis: vollständiges Raster aller Perioden × Kategorien.
 */
export function fillAndInterpolate(ds: Dataset, gapFill: GapFill, subSteps: number, extendTail = true): { periods: Period[]; rows: LongRow[] } {
  // Fehlende Jahre (z.B. 1996–2001 ohne Daten) als echte Perioden ergänzen, damit die Zeitachse linear bleibt.
  const realPeriods = gapFill === 'none' ? ds.periods : completeYearGaps(ds.periods)
  const byName = new Map<string, Map<string, number>>()
  for (const r of ds.rows) {
    if (!byName.has(r.name)) byName.set(r.name, new Map())
    byName.get(r.name)!.set(r.date, r.value)
  }
  // Lücken in echten Perioden füllen
  const filled = new Map<string, (number | null)[]>()
  for (const name of ds.names) {
    const m = byName.get(name) ?? new Map<string, number>()
    const vals: (number | null)[] = realPeriods.map((p) => (m.has(p.iso) ? m.get(p.iso)! : null))
    if (gapFill !== 'none') {
      // Vorwärts: letzter Wert / Interpolation
      let lastIdx = -1
      for (let i = 0; i < vals.length; i++) {
        if (vals[i] !== null) {
          if (lastIdx >= 0 && i - lastIdx > 1) {
            for (let k = lastIdx + 1; k < i; k++) {
              if (gapFill === 'interpolate') {
                const f = (k - lastIdx) / (i - lastIdx)
                vals[k] = vals[lastIdx]! + (vals[i]! - vals[lastIdx]!) * f
              } else vals[k] = vals[lastIdx]
            }
          }
          lastIdx = i
        }
      }
      // Nachlauf: letzter bekannter Wert fortschreiben (Bar Race: Balken sollen nicht verschwinden;
      // Line Race: Reihe endet ehrlich am letzten Datenpunkt)
      if (extendTail && lastIdx >= 0) for (let k = lastIdx + 1; k < vals.length; k++) vals[k] = vals[lastIdx]
      // Vorlauf bleibt leer (Kategorie existiert noch nicht) – bewusst
    }
    filled.set(name, vals)
  }

  const periods = withSubSteps(realPeriods, subSteps)
  const rows: LongRow[] = []
  const realIndex = new Map(realPeriods.map((p, i) => [p.iso, i]))
  for (const name of ds.names) {
    const vals = filled.get(name)!
    let ri = -1
    for (const p of periods) {
      if (p.real) ri = realIndex.get(p.iso)!
      if (p.real) {
        const v = vals[ri]
        if (v !== null) rows.push({ date: p.iso, name, value: v })
      } else {
        const a = vals[ri], b = vals[ri + 1]
        if (a !== null && b !== null) rows.push({ date: p.iso, name, value: a + (b - a) * p.fraction })
        else if (a !== null) rows.push({ date: p.iso, name, value: a })
      }
    }
  }
  return { periods, rows }
}

/** Bei Jahresdaten fehlende Jahre zwischen erstem und letztem Jahr einfügen (Label = Jahr). */
/**
 * Zahl der Perioden, die tatsächlich abgespielt werden.
 *
 * Wichtig: Bei Jahreslücken (z. B. 1996–2000 im Schwerpunkte-Datensatz) ergänzt die Aufbereitung
 * die fehlenden Jahre als echte Perioden. Wer die Dauer aus der Zahl der TABELLENZEILEN ableitet,
 * rechnet dann zu kurz – die Oberfläche versprach 46 s, die Datei war 53,8 s lang.
 */
export function effectivePeriodCount(periods: Period[], gapFill: GapFill): number {
  return gapFill === 'none' ? periods.length : completeYearGaps(periods).length
}

export function completeYearGaps(periods: Period[]): Period[] {
  if (periods.length < 2 || periods.some((p) => p.kind !== 'year')) return periods
  const years = periods.map((p) => Number(p.iso.slice(0, 4)))
  const out: Period[] = []
  for (let y = years[0]; y <= years[years.length - 1]; y++) {
    const existing = periods.find((p) => Number(p.iso.slice(0, 4)) === y)
    out.push(existing ?? { iso: `${String(y).padStart(4, '0')}-01-01`, label: String(y), kind: 'year', real: true, fraction: 0 })
  }
  return out
}

/**
 * Lücken innerhalb einer einzelnen Reihe: Jahre ohne Wert zwischen dem ersten und letzten
 * Wert dieser Reihe. Solche Stellen werden interpoliert und sind im Diagramm sonst unsichtbar.
 */
export function seriesGaps(periods: Period[], names: string[], rows: LongRow[]): { name: string; years: number; from: number; to: number }[] {
  if (periods.length < 2 || periods.some((p) => p.kind !== 'year')) return []
  const yearOf = new Map(periods.map((p) => [p.iso, Number(p.iso.slice(0, 4))]))
  const out: { name: string; years: number; from: number; to: number }[] = []
  for (const name of names) {
    const ys = rows.filter((r) => r.name === name).map((r) => yearOf.get(r.date)!).filter((y) => y !== undefined).sort((a, b) => a - b)
    if (ys.length < 2) continue
    const have = new Set(ys)
    let missing = 0
    for (let y = ys[0]; y <= ys[ys.length - 1]; y++) if (!have.has(y)) missing++
    if (missing > 0) out.push({ name, years: missing, from: ys[0], to: ys[ys.length - 1] })
  }
  return out.sort((a, b) => b.years - a.years).slice(0, 5)
}

/** Jahre ohne Daten zwischen erstem und letztem Jahr (für Hinweise in der Datenprüfung). */
export function missingYears(periods: Period[]): number[] {
  if (periods.length < 2 || periods.some((p) => p.kind !== 'year')) return []
  const have = new Set(periods.map((p) => Number(p.iso.slice(0, 4))))
  const out: number[] = []
  for (let y = Math.min(...have); y <= Math.max(...have); y++) if (!have.has(y)) out.push(y)
  return out
}

export function longestName(names: string[]): string {
  return names.reduce((a, b) => (b.length > a.length ? b : a), '')
}
