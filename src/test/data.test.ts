import { describe, expect, it } from 'vitest'
import { parsePeriod, parsePeriods, withSubSteps, formatPeriod } from '@/lib/data/dates'
import { parseNumber, formatValue } from '@/lib/data/numbers'
import { parseCsv } from '@/lib/data/parse'
import { detectMapping } from '@/lib/data/detect'
import { buildDataset, fillAndInterpolate } from '@/lib/data/transform'
import { buildTimeline, frameTime } from '@/lib/chart/timeline'
import { wrapText } from '@/lib/layout'

describe('parsePeriod', () => {
  it('erkennt Jahre, Monate, Tage, Quartale', () => {
    expect(parsePeriod('2019')).toMatchObject({ iso: '2019-01-01', kind: 'year' })
    expect(parsePeriod('2019-03')).toMatchObject({ iso: '2019-03-01', kind: 'month' })
    expect(parsePeriod('03/2019')).toMatchObject({ iso: '2019-03-01', kind: 'month' })
    expect(parsePeriod('15.03.2019')).toMatchObject({ iso: '2019-03-15', kind: 'day' })
    expect(parsePeriod('Q3 2021')).toMatchObject({ iso: '2021-07-01', kind: 'quarter' })
    expect(parsePeriod('2021 Q1')).toMatchObject({ iso: '2021-01-01', kind: 'quarter' })
    expect(parsePeriod('März 2020')).toMatchObject({ iso: '2020-03-01', kind: 'month' })
    expect(parsePeriod('Hund')).toBeNull()
  })
  it('fällt auf Ordinal-Perioden zurück', () => {
    const { periods, ordinal } = parsePeriods(['Runde 1', 'Runde 2', 'Runde 3'])
    expect(ordinal).toBe(true)
    expect(periods.map((p) => p.label)).toEqual(['Runde 1', 'Runde 2', 'Runde 3'])
    expect(formatPeriod(periods[1], 'YYYY')).toBe('Runde 2')
  })
  it('erzeugt Zwischenschritte', () => {
    const { periods } = parsePeriods(['2019', '2020'])
    const out = withSubSteps(periods, 4)
    expect(out.length).toBe(5)
    expect(out[1].real).toBe(false)
    expect(out[1].fraction).toBeCloseTo(0.25)
    expect(out[1].label).toBe('2019')
  })
})

describe('parseNumber', () => {
  it('deutsch und englisch', () => {
    expect(parseNumber('1.234,5')).toBe(1234.5)
    expect(parseNumber('1,234.5')).toBe(1234.5)
    expect(parseNumber('1.234.567')).toBe(1234567)
    expect(parseNumber('12,5')).toBe(12.5)
    expect(parseNumber('12.5')).toBe(12.5)
    expect(parseNumber('3 400')).toBe(3400)
    expect(parseNumber('€ 99')).toBe(99)
    expect(parseNumber('abc')).toBeNull()
  })
  it('formatiert', () => {
    expect(formatValue(1234567.891, { decimals: 1, thousands: true, prefix: '', suffix: ' €', locale: 'de-DE', compact: false })).toBe('1.234.567,9 €')
    expect(formatValue(1234567, { decimals: 0, thousands: false, prefix: '', suffix: '', locale: 'de-DE', compact: false })).toBe('1234567')
  })
})

const wide = `Jahr;Nordrhein-Westfalen;Bayern;Baden-Württemberg
2019;100;80;60
2020;110;;65
2021;120;95;70
2022;130;100;`

const long = `Jahr,Bundesland,Anzahl
2019,Bayern,80
2019,Hessen,40
2020,Bayern,85
2020,Hessen,42`

describe('Import & Erkennung', () => {
  it('erkennt Wide-Format mit Semikolon', () => {
    const t = parseCsv(wide)
    expect(t.headers).toEqual(['Jahr', 'Nordrhein-Westfalen', 'Bayern', 'Baden-Württemberg'])
    const m = detectMapping(t)
    expect(m.shape).toBe('wide')
    expect(m.timeColumn).toBe(0)
    expect(m.categoryColumns).toEqual([1, 2, 3])
  })
  it('erkennt Long-Format', () => {
    const t = parseCsv(long)
    const m = detectMapping(t)
    expect(m).toMatchObject({ shape: 'long', timeColumn: 0, categoryColumn: 1, valueColumn: 2 })
    const ds = buildDataset(t, m)
    expect(ds.names).toEqual(['Bayern', 'Hessen'])
    expect(ds.periods.length).toBe(2)
    expect(ds.rows.length).toBe(4)
  })
  it('erkennt transponiertes Wide-Format', () => {
    const t = parseCsv('Rasse;2019;2020;2021\nDackel;5;6;7\nPudel;3;4;5')
    const m = detectMapping(t)
    expect(m.shape).toBe('wide')
    expect(m.transposed).toBe(true)
    const ds = buildDataset(t, m)
    expect(ds.names).toEqual(['Dackel', 'Pudel'])
    expect(ds.periods.map((p) => p.label)).toEqual(['2019', '2020', '2021'])
  })
  it('meldet Lücken und füllt sie', () => {
    const t = parseCsv(wide)
    const ds = buildDataset(t, detectMapping(t))
    expect(ds.issues.some((i) => i.message.includes('fehlende Werte'))).toBe(true)
    const { rows } = fillAndInterpolate(ds, 'interpolate', 1)
    const bayern2020 = rows.find((r) => r.name === 'Bayern' && r.date === '2020-01-01')
    expect(bayern2020?.value).toBeCloseTo(87.5)
    const bw2022 = rows.find((r) => r.name === 'Baden-Württemberg' && r.date === '2022-01-01')
    expect(bw2022?.value).toBe(70) // letzter Wert fortgeschrieben
    const { rows: none } = fillAndInterpolate(ds, 'none', 1)
    expect(none.find((r) => r.name === 'Bayern' && r.date === '2020-01-01')).toBeUndefined()
  })
  it('interpoliert Zwischenschritte', () => {
    const t = parseCsv(wide)
    const ds = buildDataset(t, detectMapping(t))
    const { periods, rows } = fillAndInterpolate(ds, 'interpolate', 2)
    expect(periods.length).toBe(7)
    const mid = rows.find((r) => r.name === 'Nordrhein-Westfalen' && r.date === periods[1].iso)
    expect(mid?.value).toBeCloseTo(105)
  })
})

describe('Timeline', () => {
  it('rechnet Standbilder in die Gesamtlänge ein', () => {
    const tl = buildTimeline({ fps: 30, periodCount: 5, tick: 1000, holdStartSec: 1, holdEndSec: 3 })
    expect(tl.animMs).toBe(4000)
    expect(tl.holdStartFrames).toBe(30)
    expect(tl.holdEndFrames).toBe(90)
    expect(tl.totalFrames).toBe(30 + 120 + 90 + 1)
    expect(frameTime(tl, 0)).toBe(0)
    expect(frameTime(tl, 29)).toBe(0)
    expect(frameTime(tl, 30)).toBe(0)
    expect(frameTime(tl, 45)).toBeCloseTo(500)
    expect(frameTime(tl, tl.totalFrames - 1)).toBe(4000)
  })
})

describe('wrapText', () => {
  it('bricht Zeilen anhand der Messfunktion um', () => {
    const measure = (t: string) => t.length * 10
    expect(wrapText('Anzahl der Tierarztpraxen in Deutschland', 200, '', measure)).toEqual(['Anzahl der', 'Tierarztpraxen in', 'Deutschland'])
    expect(wrapText('a b c d e f g h', 30, '', measure, 2)).toEqual(['a b', 'c…'])
  })
})
