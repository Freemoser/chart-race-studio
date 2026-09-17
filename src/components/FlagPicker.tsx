import { useMemo, useState } from 'react'

import { FLAGS, flagDataUrl } from '@/lib/flags'

const COMMON: [string, string][] = [
  ['de', 'Deutschland'], ['at', 'Österreich'], ['ch', 'Schweiz'], ['fr', 'Frankreich'], ['it', 'Italien'], ['es', 'Spanien'], ['nl', 'Niederlande'], ['be', 'Belgien'], ['pl', 'Polen'], ['cz', 'Tschechien'], ['dk', 'Dänemark'], ['se', 'Schweden'], ['no', 'Norwegen'], ['fi', 'Finnland'], ['gb', 'Vereinigtes Königreich'], ['ie', 'Irland'], ['pt', 'Portugal'], ['gr', 'Griechenland'], ['hu', 'Ungarn'], ['ro', 'Rumänien'], ['tr', 'Türkei'], ['us', 'USA'], ['ca', 'Kanada'], ['mx', 'Mexiko'], ['br', 'Brasilien'], ['ar', 'Argentinien'], ['cn', 'China'], ['jp', 'Japan'], ['kr', 'Südkorea'], ['in', 'Indien'], ['au', 'Australien'], ['nz', 'Neuseeland'], ['za', 'Südafrika'], ['ae', 'Vereinigte Arabische Emirate'], ['sa', 'Saudi-Arabien'], ['ru', 'Russland'], ['ua', 'Ukraine'], ['eu', 'Europäische Union'],
]

export function FlagPicker({ onPick, onClose }: { onPick: (dataUrl: string) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const all = useMemo(() => Object.keys(FLAGS).map((k) => k.split('/').pop()!.replace('.svg', '')).sort(), [])
  const list = q.trim()
    ? all.filter((c) => c.includes(q.toLowerCase()) || COMMON.find(([cc]) => cc === c)?.[1].toLowerCase().includes(q.toLowerCase()))
    : COMMON.map(([c]) => c)
  const name = (c: string) => COMMON.find(([cc]) => cc === c)?.[1] ?? c.toUpperCase()
  return (
    <div className="card absolute z-20 mt-1 w-72 p-2 shadow-lg">
      <input autoFocus className="input mb-2" placeholder="Land oder Code suchen…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid max-h-48 grid-cols-6 gap-1 overflow-auto">
        {list.slice(0, 120).map((c) => (
          <button key={c} type="button" title={name(c)} className="flex min-h-9 items-center justify-center rounded hover:bg-surface-2" onClick={async () => { const u = await flagDataUrl(c); if (u) onPick(u); onClose() }}>
            <span className={`fi fi-${c}`} style={{ width: 28, height: 21, display: 'inline-block', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
              <FlagImg code={c} />
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="btn-ghost mt-2 w-full !min-h-9" onClick={onClose}>Schließen</button>
    </div>
  )
}

const cache = new Map<string, string>()
function FlagImg({ code }: { code: string }) {
  const [src, setSrc] = useState<string | null>(cache.get(code) ?? null)
  if (!src) flagDataUrl(code).then((u) => { if (u) { cache.set(code, u); setSrc(u) } })
  return src ? <img src={src} alt="" width={28} height={21} className="rounded-[2px] shadow-sm" /> : <span className="inline-block h-[21px] w-7 rounded-[2px] bg-line" />
}
