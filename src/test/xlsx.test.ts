import { describe, expect, it } from 'vitest'
import * as XLSX from 'xlsx'
import { parseXlsx } from '@/lib/data/parse'
import { detectMapping } from '@/lib/data/detect'
import { buildDataset } from '@/lib/data/transform'

describe('XLSX-Import', () => {
  it('liest die erste Tabelle inkl. Zahlen und Datumswerten', async () => {
    const aoa = [
      ['Jahr', 'Nordrhein-Westfalen', 'Vereinigte Arabische Emirate'],
      [2019, 100, 5.5],
      [2020, 110, 6.25],
      [2021, 120, 7],
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'Daten')
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
    const table = await parseXlsx(buf, 'test.xlsx')
    expect(table.headers).toEqual(['Jahr', 'Nordrhein-Westfalen', 'Vereinigte Arabische Emirate'])
    expect(table.rows.length).toBe(3)
    const m = detectMapping(table)
    expect(m.shape).toBe('wide')
    const ds = buildDataset(table, m)
    expect(ds.periods.map((p) => p.label)).toEqual(['2019', '2020', '2021'])
    expect(ds.rows.find((r) => r.name === 'Vereinigte Arabische Emirate' && r.date === '2020-01-01')?.value).toBe(6.25)
    expect(ds.issues.filter((i) => i.level === 'error')).toEqual([])
  })
})
