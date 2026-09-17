import { useRef, useState, type DragEvent } from 'react'
import { AlertTriangle, Download, FileSpreadsheet, Info, Upload, XCircle, Table2, Sparkles } from 'lucide-react'
import { useApp } from '@/state/store'
import { parseFile, toCsv } from '@/lib/data/parse'
import { SAMPLES } from '@/samples'
import { TableEditor } from './TableEditor'
import { Field, Section, Segmented } from './ui'
import { SAMPLE_CATEGORIES, type ColumnMapping } from '@/lib/data/types'

export function DataPanel() {
  const { table, mapping, dataset, setTable, setMapping, loadSample, loadedSampleId, clearData } = useApp()
  const [dragOver, setDragOver] = useState(false)
  const [infoFor, setInfoFor] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onFiles = async (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    setError(null)
    try {
      const t = await parseFile(f)
      if (t.headers.length < 2) throw new Error('Die Datei enthält weniger als zwei Spalten.')
      setTable(t)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Datei konnte nicht gelesen werden.')
    }
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files) }

  const startEmpty = () => {
    setTable({ headers: ['Jahr', 'Kategorie A', 'Kategorie B', 'Kategorie C'], rows: [['2020', '10', '8', '5'], ['2021', '12', '9', '7'], ['2022', '15', '11', '8'], ['2023', '16', '14', '12']] })
  }

  const errors = dataset?.issues.filter((i) => i.level === 'error') ?? []
  const warnings = dataset?.issues.filter((i) => i.level === 'warning') ?? []

  return (
    <div>
      <Section title="Beispiel-Datensätze" hint={`${SAMPLES.length} zum Laden`}>
        {SAMPLE_CATEGORIES.map((cat) => {
          const list = SAMPLES.filter((s) => s.category === cat.id)
          if (list.length === 0) return null
          return (
            <div key={cat.id} className="flex flex-col gap-2">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-ink-faint uppercase">
                {cat.label}
                <span className="h-px flex-1 bg-line" />
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {list.map((s) => (
                  <div key={s.id} className={`card flex flex-col transition-colors ${loadedSampleId === s.id ? 'border-primary ring-2 ring-primary/15' : ''}`}>
                    <button type="button" onClick={() => loadSample(s)} className="flex flex-1 flex-col gap-1 p-3 text-left hover:bg-surface-2/60">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-[13px] font-semibold leading-snug">{s.title}</span>
                        {s.isExample && <span className="shrink-0 rounded bg-warn/15 px-1.5 py-0.5 text-[10px] font-medium text-warn">Beispieldaten</span>}
                      </span>
                      <span className="text-xs leading-snug text-ink-muted">{s.description}</span>
                    </button>
                    {s.dataInfo && s.dataInfo.length > 0 && (
                      <>
                        <button type="button" aria-expanded={infoFor === s.id} onClick={() => setInfoFor(infoFor === s.id ? null : s.id)}
                          className="flex min-h-9 items-center gap-1.5 border-t border-line px-3 text-[11px] text-ink-faint transition-colors hover:bg-surface-2/60 hover:text-ink">
                          <Info size={13} /> Dateninfo{infoFor === s.id ? ' ausblenden' : ''}
                        </button>
                        {infoFor === s.id && (
                          <div className="flex flex-col gap-2 border-t border-line bg-surface-2/40 px-3 py-2.5">
                            {s.dataInfo.map((t, k) => <p key={k} className="text-[11px] leading-snug text-ink-muted">{t}</p>)}
                            <p className="text-[11px] leading-snug text-ink-faint">{s.source}</p>
                            <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="text-[11px] text-primary underline underline-offset-2">Quelle öffnen</a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </Section>

      <Section title="Eigene Daten" hint="CSV, XLSX oder manuell">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center gap-2 rounded-md border-2 border-dashed px-4 py-5 text-center transition-colors ${dragOver ? 'border-primary bg-accent-soft/40' : 'border-line'}`}
        >
          <Upload className="text-ink-faint" size={22} />
          <p className="text-[13px] text-ink-muted">CSV- oder Excel-Datei hierher ziehen</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}><FileSpreadsheet size={16} /> Datei wählen</button>
            <button type="button" className="btn-ghost" onClick={startEmpty}><Table2 size={16} /> Leere Tabelle</button>
          </div>
          <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,.xlsx,.xls,.ods,.xlsm" className="hidden" onChange={(e) => onFiles(e.target.files)} />
          <p className="text-[11px] text-ink-faint">
            Wide-Format (eine Spalte je Kategorie) oder Long-Format (Spalten: Zeit, Kategorie, Wert) – wird automatisch erkannt.
          </p>
        </div>
        {error && <p className="flex items-center gap-2 text-[13px] text-err"><XCircle size={16} /> {error}</p>}
      </Section>

      {table && mapping && (
        <>
          <Section title="Spaltenzuordnung" hint={mapping.shape === 'long' ? 'Long-Format' : mapping.transposed ? 'Wide (transponiert)' : 'Wide-Format'}>
            <MappingEditor headers={table.headers} mapping={mapping} onChange={setMapping} />
            {dataset && dataset.periods.length > 0 && (
              <p className="text-xs text-ink-muted">
                Erkannt: <b className="text-ink">{dataset.periods.length}</b> Perioden ({dataset.periods[0].label} – {dataset.periods[dataset.periods.length - 1].label}), <b className="text-ink">{dataset.names.length}</b> Kategorien
                {dataset.periods[0].kind === 'ordinal' ? ', Perioden ohne Datumsbezug' : ''}.
              </p>
            )}
          </Section>

          {(errors.length > 0 || warnings.length > 0) && (
            <Section title="Datenprüfung" hint={`${errors.length} Fehler, ${warnings.length} Hinweise`} defaultOpen={errors.length > 0}>
              <ul className="flex max-h-40 flex-col gap-1 overflow-auto text-[13px]">
                {[...errors, ...warnings].slice(0, 30).map((i, k) => (
                  <li key={k} className={`flex gap-2 ${i.level === 'error' ? 'text-err' : 'text-warn'}`}>
                    {i.level === 'error' ? <XCircle size={15} className="mt-0.5 shrink-0" /> : <AlertTriangle size={15} className="mt-0.5 shrink-0" />}
                    <span>{i.message}</span>
                  </li>
                ))}
                {errors.length + warnings.length > 30 && <li className="text-ink-faint">… und {errors.length + warnings.length - 30} weitere</li>}
              </ul>
            </Section>
          )}

          <Section title="Tabelle bearbeiten" defaultOpen={false} hint="Zellen direkt editieren">
            <TableEditor />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-ghost" onClick={() => { const blob = new Blob([toCsv(table)], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'daten.csv'; a.click() }}>
                <Download size={16} /> Als CSV speichern
              </button>
              <button type="button" className="btn-ghost text-err" onClick={clearData}><XCircle size={16} /> Daten entfernen</button>
            </div>
          </Section>
        </>
      )}

      {!table && (
        <div className="flex items-start gap-2 px-4 py-3 text-xs text-ink-faint">
          <Sparkles size={14} className="mt-0.5 shrink-0" />
          <span>Tipp: Kategorienamen dürfen lang sein („Nordrhein-Westfalen“). Mit „Labels außerhalb“ wird links automatisch Platz reserviert.</span>
        </div>
      )}
    </div>
  )
}

function MappingEditor({ headers, mapping, onChange }: { headers: string[]; mapping: ColumnMapping; onChange: (m: ColumnMapping) => void }) {
  const sel = (value: number | undefined, onSel: (v: number) => void, label: string) => (
    <Field label={label}>
      <select className="input" value={value ?? ''} onChange={(e) => onSel(Number(e.target.value))}>
        {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
      </select>
    </Field>
  )
  const setShape = (shape: 'wide' | 'long' | 'wide-t') => {
    if (shape === 'long') onChange({ shape: 'long', timeColumn: mapping.timeColumn, categoryColumn: headers.findIndex((_, i) => i !== mapping.timeColumn), valueColumn: headers.length - 1 })
    else if (shape === 'wide-t') onChange({ shape: 'wide', timeColumn: 0, categoryColumns: headers.map((_, i) => i).filter((i) => i !== 0), transposed: true })
    else onChange({ shape: 'wide', timeColumn: mapping.timeColumn, categoryColumns: headers.map((_, i) => i).filter((i) => i !== mapping.timeColumn) })
  }
  const shapeValue = mapping.shape === 'long' ? 'long' : mapping.transposed ? 'wide-t' : 'wide'
  return (
    <div className="flex flex-col gap-3">
      <Segmented
        value={shapeValue}
        onChange={setShape}
        ariaLabel="Datenformat"
        options={[
          { value: 'wide', label: 'Wide', title: 'Zeilen = Perioden, Spalten = Kategorien' },
          { value: 'wide-t', label: 'Wide ↔', title: 'Zeilen = Kategorien, Spalten = Perioden' },
          { value: 'long', label: 'Long', title: 'Spalten: Zeit, Kategorie, Wert' },
        ]}
      />
      {mapping.shape === 'long' ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {sel(mapping.timeColumn, (v) => onChange({ ...mapping, timeColumn: v }), 'Zeit')}
          {sel(mapping.categoryColumn, (v) => onChange({ ...mapping, categoryColumn: v }), 'Kategorie')}
          {sel(mapping.valueColumn, (v) => onChange({ ...mapping, valueColumn: v }), 'Wert')}
        </div>
      ) : mapping.transposed ? (
        <p className="text-xs text-ink-muted">Erste Spalte = Kategorienamen, Spaltenüberschriften = Perioden.</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sel(mapping.timeColumn, (v) => onChange({ shape: 'wide', timeColumn: v, categoryColumns: headers.map((_, i) => i).filter((i) => i !== v) }), 'Zeitspalte')}
          <Field label="Kategorien (Spalten)">
            <div className="flex flex-wrap gap-1 pt-1">
              {headers.map((h, i) => i !== mapping.timeColumn && (
                <label key={i} className="inline-flex cursor-pointer items-center gap-1 rounded border border-line px-2 py-1 text-xs">
                  <input type="checkbox" checked={mapping.categoryColumns?.includes(i) ?? false} onChange={(e) => {
                    const set = new Set(mapping.categoryColumns ?? [])
                    if (e.target.checked) set.add(i)
                    else set.delete(i)
                    onChange({ ...mapping, categoryColumns: [...set].sort((a, b) => a - b) })
                  }} />
                  {h}
                </label>
              ))}
            </div>
          </Field>
        </div>
      )}
    </div>
  )
}
