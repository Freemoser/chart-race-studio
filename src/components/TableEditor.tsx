import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { useApp } from '@/state/store'

/** Editierbare Tabelle für die manuelle Dateneingabe. */
export function TableEditor() {
  const table = useApp((s) => s.table)
  const { updateCell, addRow, removeRow, addColumn, removeColumn, renameColumn } = useApp()
  const [editingHeader, setEditingHeader] = useState<number | null>(null)
  if (!table) return null
  const maxRows = 300
  const rows = table.rows.slice(0, maxRows)

  return (
    <div className="flex flex-col gap-2">
      <div className="max-h-[360px] overflow-auto rounded-md border border-line">
        <table className="w-max min-w-full border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 bg-surface-2">
            <tr>
              <th className="w-8 border-b border-line px-1 py-1.5 text-left text-xs font-normal text-ink-faint">#</th>
              {table.headers.map((h, c) => (
                <th key={c} className="group border-b border-l border-line px-1 py-1 text-left font-semibold">
                  <span className="flex items-center gap-1">
                    {editingHeader === c ? (
                      <input autoFocus className="input !py-0.5" defaultValue={h} onBlur={(e) => { renameColumn(c, e.target.value.trim() || h); setEditingHeader(null) }} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setEditingHeader(null) }} />
                    ) : (
                      <button type="button" className="min-h-8 rounded px-1.5 text-left hover:bg-surface" title="Umbenennen" onClick={() => setEditingHeader(c)}>{h}</button>
                    )}
                    <button type="button" className="min-h-8 rounded p-1 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100 hover:text-err disabled:hidden" aria-label="Spalte löschen" disabled={table.headers.length <= 2} onClick={() => removeColumn(c)}>
                      <X size={14} />
                    </button>
                  </span>
                </th>
              ))}
              <th className="border-b border-l border-line px-1">
                <button type="button" className="min-h-8 rounded p-1 text-ink-muted hover:bg-surface" aria-label="Spalte hinzufügen" onClick={addColumn}><Plus size={14} /></button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="group odd:bg-surface even:bg-surface-2/40">
                <td className="border-b border-line px-1 py-0.5 text-xs text-ink-faint tabular-nums">{ri + 1}</td>
                {r.map((cell, ci) => (
                  <td key={ci} className="border-b border-l border-line p-0">
                    <input
                      className="w-full min-w-[90px] bg-transparent px-2 py-1.5 tabular-nums outline-none focus:bg-accent-soft/40"
                      value={cell ?? ''}
                      onChange={(e) => updateCell(ri, ci, e.target.value === '' ? null : e.target.value)}
                      aria-label={`Zeile ${ri + 1}, ${table.headers[ci]}`}
                    />
                  </td>
                ))}
                <td className="border-b border-l border-line px-1">
                  <button type="button" className="min-h-8 rounded p-1 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100 hover:text-err" aria-label="Zeile löschen" onClick={() => removeRow(ri)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <button type="button" className="btn-ghost !min-h-9 !py-1" onClick={addRow}><Plus size={14} /> Zeile</button>
        <span>{table.rows.length} Zeilen{table.rows.length > maxRows ? ` (erste ${maxRows} editierbar)` : ''} · {table.headers.length} Spalten</span>
      </div>
    </div>
  )
}
