import type { ColumnMapping, RawTable } from './types'
import { parsePeriod } from './dates'
import { parseNumber } from './numbers'

const TIME_HINTS = /^(jahr|year|datum|date|zeit|time|periode|period|monat|month|quartal|quarter|tag|day|stichtag)$/i
const NAME_HINTS = /^(name|kategorie|category|land|country|bundesland|region|art|tierart|rasse|praxis|item|label|serie|series)$/i
const VALUE_HINTS = /^(wert|value|anzahl|count|zahl|number|menge|amount|umsatz|betrag|summe|total)$/i

function columnStats(table: RawTable, col: number) {
  let n = 0, numeric = 0, period = 0
  const distinct = new Set<string>()
  for (const r of table.rows) {
    const v = r[col]
    if (v == null || String(v).trim() === '') continue
    n++
    if (parseNumber(v) !== null) numeric++
    if (parsePeriod(v) !== null) period++
    distinct.add(String(v))
  }
  return { n, numeric, period, distinct: distinct.size }
}

/**
 * Heuristik zur Erkennung von wide vs. long Format.
 *
 * long: genau eine Zeit-, eine Kategorie- und eine Wertspalte (>= 3 Spalten);
 *       die Zeitspalte hat Wiederholungen, die Kategoriespalte auch.
 * wide: erste Spalte = Perioden (eindeutig), alle anderen Spalten numerisch.
 * wide transponiert: erste Spalte = Kategorien, Header (ab Spalte 2) = Perioden.
 */
export function detectMapping(table: RawTable): ColumnMapping {
  const cols = table.headers.length
  if (cols === 0) return { shape: 'wide', timeColumn: 0, categoryColumns: [] }
  const stats = table.headers.map((_, i) => columnStats(table, i))
  const rowsN = Math.max(1, table.rows.length)

  // Transponiertes Wide: Header ab Spalte 1 sind Perioden
  const headerPeriods = table.headers.slice(1).filter((h) => parsePeriod(h) !== null).length
  if (cols >= 3 && headerPeriods >= Math.max(2, (cols - 1) * 0.8)) {
    return { shape: 'wide', timeColumn: 0, categoryColumns: table.headers.slice(1).map((_, i) => i + 1), transposed: true }
  }

  // Long-Kandidaten
  if (cols >= 3) {
    const timeIdx = stats
      .map((s, i) => ({ i, score: s.period / rowsN + (TIME_HINTS.test(table.headers[i]) ? 0.5 : 0) - (s.distinct === s.n ? 0.3 : 0) }))
      .sort((a, b) => b.score - a.score)[0]
    const nameIdx = stats
      .map((s, i) => ({ i, score: (i === timeIdx.i ? -9 : 0) + (1 - s.numeric / Math.max(1, s.n)) + (NAME_HINTS.test(table.headers[i]) ? 0.5 : 0) + (s.distinct < s.n ? 0.3 : 0) }))
      .sort((a, b) => b.score - a.score)[0]
    const valueIdx = stats
      .map((s, i) => ({ i, score: (i === timeIdx.i || i === nameIdx.i ? -9 : 0) + s.numeric / Math.max(1, s.n) + (VALUE_HINTS.test(table.headers[i]) ? 0.5 : 0) }))
      .sort((a, b) => b.score - a.score)[0]
    const timeRepeats = stats[timeIdx.i].distinct < stats[timeIdx.i].n
    const nameRepeats = stats[nameIdx.i].distinct < stats[nameIdx.i].n
    const timeIsPeriod = stats[timeIdx.i].period / rowsN > 0.8
    const valueIsNumeric = stats[valueIdx.i].numeric / Math.max(1, stats[valueIdx.i].n) > 0.8
    const nameNotNumeric = stats[nameIdx.i].numeric / Math.max(1, stats[nameIdx.i].n) < 0.5
    if (timeIsPeriod && valueIsNumeric && nameNotNumeric && (timeRepeats || nameRepeats) && cols <= 6) {
      return { shape: 'long', timeColumn: timeIdx.i, categoryColumn: nameIdx.i, valueColumn: valueIdx.i }
    }
  }

  // Wide: Zeitspalte = die mit den meisten Perioden (Standard: erste)
  let timeColumn = 0
  let best = -1
  stats.forEach((s, i) => {
    const score = s.period / rowsN + (TIME_HINTS.test(table.headers[i]) ? 0.5 : 0)
    if (score > best) { best = score; timeColumn = i }
  })
  const categoryColumns = table.headers.map((_, i) => i).filter((i) => i !== timeColumn)
  return { shape: 'wide', timeColumn, categoryColumns }
}
