import { useRef, useState } from 'react'
import { Flag, ImagePlus, RotateCcw, X } from 'lucide-react'
import { useApp } from '@/state/store'
import { paletteColor } from '@/lib/palettes'
import { FlagPicker } from './FlagPicker'

async function fileToDataUrl(file: File, maxSize = 256): Promise<string> {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * scale)
  c.height = Math.round(bmp.height * scale)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  return c.toDataURL('image/png')
}

export function CategoryList() {
  const dataset = useApp((s) => s.dataset)
  const settings = useApp((s) => s.settings)
  const { setCategoryStyle, resetCategoryStyles, toggleSecondaryAxis } = useApp()
  const isLine = settings.chartType === 'line'
  const [flagFor, setFlagFor] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingName = useRef<string | null>(null)
  if (!dataset) return <p className="text-xs text-ink-faint">Erst Daten laden.</p>

  return (
    <div className="flex flex-col gap-1.5">
      <ul className="flex max-h-72 flex-col gap-1 overflow-auto pr-1">
        {dataset.names.map((n, i) => {
          const st = settings.categories[n] ?? {}
          const color = st.color ?? paletteColor(settings.paletteId, i)
          return (
            <li key={n} className="relative flex items-center gap-2 rounded-md border border-line px-2 py-1">
              <input type="color" value={color} onChange={(e) => setCategoryStyle(n, { color: e.target.value })} aria-label={`Farbe für ${n}`} />
              <span className="min-w-0 flex-1 truncate text-[13px]" title={n}>{n}</span>
              {isLine && (
                <button type="button" aria-pressed={settings.secondaryAxis.includes(n)} title="Auf rechter Y-Achse zeichnen" onClick={() => toggleSecondaryAxis(n)}
                  className={`min-h-8 rounded border px-1.5 text-[11px] font-semibold ${settings.secondaryAxis.includes(n) ? 'border-primary bg-primary text-white' : 'border-line text-ink-faint hover:text-ink'}`}>
                  Y2
                </button>
              )}
              {st.image ? (
                <span className="flex items-center gap-1">
                  <img src={st.image} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-line" />
                  <button type="button" className="min-h-8 rounded p-1 text-ink-faint hover:text-err" aria-label="Bild entfernen" onClick={() => setCategoryStyle(n, { image: null })}><X size={14} /></button>
                </span>
              ) : (
                <span className="flex items-center">
                  <button type="button" className="min-h-8 rounded p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink" title="Bild hochladen" onClick={() => { pendingName.current = n; fileRef.current?.click() }}><ImagePlus size={15} /></button>
                  <button type="button" className="min-h-8 rounded p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink" title="Flagge wählen" onClick={() => setFlagFor(flagFor === n ? null : n)}><Flag size={15} /></button>
                </span>
              )}
              {flagFor === n && (
                <div className="absolute right-0 top-full">
                  <FlagPicker onPick={(u) => setCategoryStyle(n, { image: u })} onClose={() => setFlagFor(null)} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0]; const n = pendingName.current
        if (f && n) setCategoryStyle(n, { image: await fileToDataUrl(f) })
        e.target.value = ''
      }} />
      <button type="button" className="btn-ghost !min-h-9 self-start !py-1 text-xs" onClick={resetCategoryStyles}><RotateCcw size={13} /> Farben & Bilder zurücksetzen</button>
    </div>
  )
}
