import { Pause, Play, RotateCcw } from 'lucide-react'
import { preview, usePreview } from '@/lib/preview/controller'
import { useApp } from '@/state/store'
import { totalDurationSec } from '@/lib/settings'
import { formatById } from '@/lib/formats'

export function Transport() {
  const snap = usePreview()
  const dataset = useApp((s) => s.dataset)
  const settings = useApp((s) => s.settings)
  const total = totalDurationSec(settings, dataset?.periods.length ?? 0)
  const format = formatById(settings.format)
  const disabled = snap.total === 0
  const stateLabel = snap.state === 'holdStart' ? 'Standbild Anfang' : snap.state === 'holdEnd' ? 'Standbild Ende' : snap.state === 'playing' ? 'läuft' : snap.state === 'ended' ? 'Ende' : 'Pause'

  return (
    <div className="flex flex-wrap items-center gap-3 px-1">
      <div className="flex items-center gap-1.5">
        <button type="button" className="btn-primary !min-h-10 !px-3" onClick={() => preview.toggle()} disabled={disabled} aria-label={snap.playing ? 'Pause' : 'Abspielen'}>
          {snap.playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button type="button" className="btn-ghost !min-h-10 !px-3" onClick={() => preview.restart()} disabled={disabled} aria-label="Von Anfang">
          <RotateCcw size={16} />
        </button>
      </div>
      <input
        type="range"
        className="min-w-[140px] flex-1"
        min={0}
        max={Math.max(0, snap.total - 1)}
        value={Math.min(snap.index, Math.max(0, snap.total - 1))}
        disabled={disabled}
        onChange={(e) => preview.seek(Number(e.target.value))}
        aria-label="Position"
      />
      <div className="flex items-center gap-3 text-xs text-ink-muted tabular-nums">
        <span className="hidden sm:inline">{stateLabel}</span>
        <span>{format.width}×{format.height}</span>
        <span className="font-medium text-ink">{total.toFixed(1)} s</span>
      </div>
    </div>
  )
}
