import { describe, expect, it } from 'vitest'
import { parseCsv } from '@/lib/data/parse'
import { detectMapping } from '@/lib/data/detect'
import { buildDataset, seriesGaps } from '@/lib/data/transform'

describe('Lücken innerhalb einzelner Reihen', () => {
  const t = parseCsv('Jahr;A;B\n1992;10;\n1993;11;5\n1994;12;\n1995;13;7')
  const ds = buildDataset(t, detectMapping(t))
  it('meldet die Reihe mit dem fehlenden Jahr', () => {
    expect(seriesGaps(ds.periods, ds.names, ds.rows)).toEqual([{ name: 'B', years: 1, from: 1993, to: 1995 }])
    expect(ds.issues.some((i) => i.message.includes('„B“: ein Jahr ohne Werte zwischen 1993 und 1995'))).toBe(true)
  })
  it('meldet nichts für lückenlose Reihen', () => {
    const t2 = parseCsv('Jahr;A\n2000;1\n2001;2\n2002;3')
    const d2 = buildDataset(t2, detectMapping(t2))
    expect(seriesGaps(d2.periods, d2.names, d2.rows)).toEqual([])
  })
})
