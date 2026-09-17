import Papa from 'papaparse'
import type { RawTable } from './types'

/** Liest CSV-Text in eine Rohtabelle. Trennzeichen wird automatisch erkannt. */
export function parseCsv(text: string, sourceName?: string): RawTable {
  const res = Papa.parse<string[]>(text.replace(/^﻿/, ''), {
    skipEmptyLines: 'greedy',
    delimitersToGuess: [',', ';', '\t', '|'],
  })
  const rows = res.data.filter((r) => r.some((c) => String(c ?? '').trim() !== ''))
  if (rows.length === 0) return { headers: [], rows: [], sourceName }
  const headers = rows[0].map((h, i) => (String(h ?? '').trim() || `Spalte ${i + 1}`))
  const width = headers.length
  const body = rows.slice(1).map((r) => {
    const out: (string | null)[] = []
    for (let i = 0; i < width; i++) {
      const c = r[i]
      out.push(c == null || String(c).trim() === '' ? null : String(c).trim())
    }
    return out
  })
  return { headers, rows: body, sourceName }
}

/** Liest die erste Tabelle einer XLSX/XLS/ODS-Datei. */
export async function parseXlsx(buffer: ArrayBuffer, sourceName?: string): Promise<RawTable> {
  const XLSX = await import('xlsx')
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheetName = wb.SheetNames[0]
  const sheet = wb.Sheets[sheetName]
  const aoa = XLSX.utils.sheet_to_json<(string | number | Date | null)[]>(sheet, { header: 1, raw: true, defval: null })
  const rows = aoa.filter((r) => r.some((c) => c != null && String(c).trim() !== ''))
  if (rows.length === 0) return { headers: [], rows: [], sourceName }
  const norm = (c: string | number | Date | null): string | number | null => {
    if (c == null) return null
    if (c instanceof Date) return `${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, '0')}-${String(c.getDate()).padStart(2, '0')}`
    if (typeof c === 'number') return c
    const s = String(c).trim()
    return s === '' ? null : s
  }
  const headers = rows[0].map((h, i) => (h == null || String(h).trim() === '' ? `Spalte ${i + 1}` : String(h).trim()))
  const width = headers.length
  const body = rows.slice(1).map((r) => Array.from({ length: width }, (_, i) => norm(r[i] ?? null)))
  return { headers, rows: body, sourceName }
}

export async function parseFile(file: File): Promise<RawTable> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.ods') || name.endsWith('.xlsm')) {
    return parseXlsx(await file.arrayBuffer(), file.name)
  }
  return parseCsv(await file.text(), file.name)
}

/** Serialisiert eine Rohtabelle als CSV (Semikolon, UTF-8 BOM) für den Download. */
export function toCsv(table: RawTable): string {
  const esc = (v: string | number | null) => {
    const s = v == null ? '' : String(v)
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return '﻿' + [table.headers.map(esc).join(';'), ...table.rows.map((r) => r.map(esc).join(';'))].join('\n')
}
