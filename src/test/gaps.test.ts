import { describe, expect, it } from 'vitest'
import { parseCsv } from '@/lib/data/parse'
import { detectMapping } from '@/lib/data/detect'
import { buildDataset, completeYearGaps, fillAndInterpolate, missingYears } from '@/lib/data/transform'

describe('Zeitlücken bei Jahresdaten', () => {
  const t = parseCsv('Jahr;A;B\n1995;10;1\n2000;20;2\n2001;22;3')
  const ds = buildDataset(t, detectMapping(t))
  it('meldet fehlende Jahre', () => {
    expect(missingYears(ds.periods)).toEqual([1996, 1997, 1998, 1999])
    expect(ds.issues.some((i) => i.message.includes('1996–1999'))).toBe(true)
  })
  it('ergänzt fehlende Jahre linear', () => {
    expect(completeYearGaps(ds.periods).map((p) => p.label)).toEqual(['1995', '1996', '1997', '1998', '1999', '2000', '2001'])
    const { periods, rows } = fillAndInterpolate(ds, 'interpolate', 1)
    expect(periods.length).toBe(7)
    expect(rows.find((r) => r.name === 'A' && r.date === '1997-01-01')?.value).toBeCloseTo(14)
    const none = fillAndInterpolate(ds, 'none', 1)
    expect(none.periods.length).toBe(3)
  })
})
