import type { Period } from './types'

const MONTHS_DE = ['januar', 'februar', 'märz', 'maerz', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'dezember']
const MONTHS_EN = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const MONTHS_SHORT_DE = ['jan', 'feb', 'mär', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dez']

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

export function isoOf(y: number, m = 1, d = 1): string {
  return `${pad(y, 4)}-${pad(m)}-${pad(d)}`
}

function monthIndex(word: string): number {
  const w = word.toLowerCase().replace('.', '')
  for (const list of [MONTHS_DE, MONTHS_EN]) {
    const i = list.indexOf(w)
    if (i >= 0) return list === MONTHS_DE && i > 2 ? i - 1 : i // "maerz" doppelt
  }
  for (const list of [MONTHS_SHORT, MONTHS_SHORT_DE]) {
    const i = list.indexOf(w.slice(0, 3))
    if (i >= 0) return i
  }
  return -1
}

/**
 * Erkennt eine Periode aus einem Zell-Inhalt. Gibt null zurück, wenn nicht
 * interpretierbar (dann greift die Ordinal-Logik in `parsePeriods`).
 */
export function parsePeriod(input: string | number | Date | null | undefined): Omit<Period, 'real' | 'fraction'> | null {
  if (input == null) return null
  if (input instanceof Date) {
    return { iso: isoOf(input.getFullYear(), input.getMonth() + 1, input.getDate()), label: String(input.getFullYear()), kind: 'day' }
  }
  const raw = String(input).trim()
  if (!raw) return null

  // Jahr: 1900..2199
  if (/^\d{4}$/.test(raw)) {
    const y = Number(raw)
    if (y >= 1000 && y <= 2999) return { iso: isoOf(y), label: raw, kind: 'year' }
  }
  // Excel-Seriendatum (Zahl > 20000) als Datum interpretieren
  if (typeof input === 'number' && input > 20000 && input < 80000 && Number.isInteger(input)) {
    const d = new Date(Date.UTC(1899, 11, 30) + input * 86400000)
    return { iso: isoOf(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()), label: raw, kind: 'day' }
  }
  // ISO: 2020-03 oder 2020-03-15
  let m = raw.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/)
  if (m) {
    const y = +m[1], mo = +m[2], d = m[3] ? +m[3] : undefined
    if (mo >= 1 && mo <= 12) return d ? { iso: isoOf(y, mo, d), label: raw, kind: 'day' } : { iso: isoOf(y, mo), label: raw, kind: 'month' }
  }
  // Deutsch: 15.03.2020 oder 03.2020
  m = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (m) return { iso: isoOf(+m[3], +m[2], +m[1]), label: raw, kind: 'day' }
  m = raw.match(/^(\d{1,2})\.(\d{4})$/)
  if (m) return { iso: isoOf(+m[2], +m[1]), label: raw, kind: 'month' }
  // Monat/Jahr: 03/2020
  m = raw.match(/^(\d{1,2})\/(\d{4})$/)
  if (m) return { iso: isoOf(+m[2], +m[1]), label: raw, kind: 'month' }
  // US: 3/15/2020
  m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return { iso: isoOf(+m[3], +m[1], +m[2]), label: raw, kind: 'day' }
  // Quartal: Q1 2020, 2020 Q1, 2020-Q1, 1. Quartal 2020
  m = raw.match(/^(?:Q([1-4])\s*[-/ ]?\s*(\d{4})|(\d{4})\s*[-/ ]?\s*Q([1-4])|([1-4])\.\s*Quartal\s*(\d{4}))$/i)
  if (m) {
    const q = +(m[1] ?? m[4] ?? m[5]), y = +(m[2] ?? m[3] ?? m[6])
    return { iso: isoOf(y, (q - 1) * 3 + 1), label: raw, kind: 'quarter' }
  }
  // Monatsname Jahr: "März 2020", "Mar 2020", "2020 März"
  m = raw.match(/^([A-Za-zÄÖÜäöü]+)\.?\s+(\d{4})$/) ?? raw.match(/^(\d{4})\s+([A-Za-zÄÖÜäöü]+)\.?$/)
  if (m) {
    const word = /^\d/.test(m[1]) ? m[2] : m[1]
    const y = +(/^\d/.test(m[1]) ? m[1] : m[2])
    const mi = monthIndex(word)
    if (mi >= 0) return { iso: isoOf(y, mi + 1), label: raw, kind: 'month' }
  }
  // Volles ISO-Datum mit Zeit
  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const d = new Date(raw)
    if (!isNaN(+d)) return { iso: isoOf(d.getFullYear(), d.getMonth() + 1, d.getDate()), label: raw.slice(0, 10), kind: 'day' }
  }
  return null
}

/**
 * Wandelt eine Liste von Perioden-Labels in Perioden um. Wenn nicht alle
 * Labels als Datum erkennbar sind, werden sie als geordnete Ordinal-Perioden
 * behandelt (synthetische Jahre ab 2000), das Label bleibt erhalten.
 */
export function parsePeriods(labels: (string | number | null)[]): { periods: Period[]; ordinal: boolean } {
  const parsed = labels.map(parsePeriod)
  const allOk = parsed.every((p) => p !== null)
  if (allOk) {
    const uniq = new Map<string, Period>()
    for (const p of parsed as NonNullable<(typeof parsed)[number]>[]) {
      if (!uniq.has(p.iso)) uniq.set(p.iso, { ...p, real: true, fraction: 0 })
    }
    return { periods: [...uniq.values()].sort((a, b) => a.iso.localeCompare(b.iso)), ordinal: false }
  }
  const seen = new Map<string, Period>()
  let i = 0
  for (const l of labels) {
    const label = String(l ?? '').trim()
    if (!label || seen.has(label)) continue
    seen.set(label, { iso: isoOf(2000 + i), label, kind: 'ordinal', real: true, fraction: 0 })
    i++
  }
  return { periods: [...seen.values()], ordinal: true }
}

/**
 * Fügt zwischen aufeinanderfolgenden echten Perioden `steps-1` Zwischenschritte
 * ein. Die ISO-Daten liegen zeitlich streng zwischen den Nachbarn.
 */
export function withSubSteps(periods: Period[], steps: number): Period[] {
  if (steps <= 1 || periods.length < 2) return periods
  const out: Period[] = []
  for (let i = 0; i < periods.length; i++) {
    const a = periods[i]
    out.push(a)
    const b = periods[i + 1]
    if (!b) break
    const ta = Date.parse(a.iso + 'T00:00:00Z')
    const tb = Date.parse(b.iso + 'T00:00:00Z')
    for (let s = 1; s < steps; s++) {
      const f = s / steps
      const t = ta + (tb - ta) * f
      const d = new Date(t)
      // Sub-Tag-Auflösung vermeiden: bei sehr nahen Perioden Zeitanteil in Stunden kodieren
      const iso = `${pad(d.getUTCFullYear(), 4)}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
      if (iso === a.iso || iso === b.iso || out[out.length - 1].iso === iso) continue
      out.push({ iso, label: a.label, kind: a.kind, real: false, fraction: f })
    }
  }
  return out
}

/**
 * Formatiert eine Periode anhand einer Vorlage.
 * Platzhalter: YYYY, YY, MM, M, MMM, MMMM, DD, D, Q, LABEL
 */
/**
 * Liefert die Periode, die für das große Datum angezeigt werden soll.
 *
 * Zwischen zwei echten Perioden liegen Zwischenschritte, deren Werte interpoliert sind.
 * Würde dort stur die vorherige Periode beschriftet, stünde bei 99 Prozent des Weges nach 2024
 * immer noch „2023“ über Werten, die praktisch die von 2024 sind. Deshalb wird auf die nähere
 * echte Periode gerundet: Der Abstand zwischen Beschriftung und gezeigtem Wert bleibt so
 * höchstens ein halber Zeitschritt.
 */
export function periodForLabel(periods: Period[], index: number): Period {
  const i = Math.min(periods.length - 1, Math.max(0, index))
  const p = periods[i]
  if (!p) return periods[0]
  if (p.real !== false) return p
  if ((p.fraction ?? 0) < 0.5) {
    for (let k = i; k >= 0; k--) if (periods[k].real !== false) return periods[k]
  } else {
    for (let k = i; k < periods.length; k++) if (periods[k].real !== false) return periods[k]
  }
  return p
}

export function formatPeriod(p: Period, template: string, locale = 'de-DE'): string {
  if (p.kind === 'ordinal' || template === 'LABEL' || !template) return p.label
  const [y, m, d] = p.iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  const monthLong = date.toLocaleDateString(locale, { month: 'long', timeZone: 'UTC' })
  const monthShort = date.toLocaleDateString(locale, { month: 'short', timeZone: 'UTC' }).replace('.', '')
  const q = Math.floor((m - 1) / 3) + 1
  return template
    .replace(/LABEL/g, p.label)
    .replace(/YYYY/g, pad(y, 4))
    .replace(/YY/g, pad(y % 100))
    .replace(/MMMM/g, monthLong)
    .replace(/MMM/g, monthShort)
    .replace(/MM/g, pad(m))
    .replace(/\bM\b/g, String(m))
    .replace(/DD/g, pad(d))
    .replace(/\bD\b/g, String(d))
    .replace(/\bQ\b/g, `Q${q}`)
}

export const DATE_TEMPLATES: { id: string; label: string; forKinds: Period['kind'][] }[] = [
  { id: 'YYYY', label: '2024', forKinds: ['year', 'quarter', 'month', 'day'] },
  { id: 'LABEL', label: 'Original-Label', forKinds: ['year', 'quarter', 'month', 'day', 'ordinal'] },
  { id: 'Q YYYY', label: 'Q3 2024', forKinds: ['quarter', 'month', 'day'] },
  { id: 'MMMM YYYY', label: 'März 2024', forKinds: ['month', 'day'] },
  { id: 'MMM YYYY', label: 'Mär 2024', forKinds: ['month', 'day'] },
  { id: 'MM/YYYY', label: '03/2024', forKinds: ['month', 'day'] },
  { id: 'DD.MM.YYYY', label: '15.03.2024', forKinds: ['day'] },
  { id: 'D. MMMM YYYY', label: '15. März 2024', forKinds: ['day'] },
]

export function defaultTemplateFor(kind: Period['kind']): string {
  switch (kind) {
    case 'year': return 'YYYY'
    case 'quarter': return 'Q YYYY'
    case 'month': return 'MMMM YYYY'
    case 'day': return 'DD.MM.YYYY'
    default: return 'LABEL'
  }
}
