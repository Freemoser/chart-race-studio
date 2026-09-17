import { useEffect, useRef, useState } from 'react'
import { Clapperboard, Download, FileImage, Film, Loader2, X } from 'lucide-react'
import { useApp } from '@/state/store'
import { runExport, downloadBlob, isAbortError, type ExportKind, type ExportProgress, type ExportResult } from '@/lib/export/exportController'
import { totalDurationSec } from '@/lib/settings'
import { formatById } from '@/lib/formats'
import { preview } from '@/lib/preview/controller'
import { Section } from './ui'

export function ExportPanel() {
  const dataset = useApp((s) => s.dataset)
  const settings = useApp((s) => s.settings)
  const brand = useApp((s) => s.brand)
  const [busy, setBusy] = useState<ExportKind | null>(null)
  const [progress, setProgress] = useState<ExportProgress | null>(null)
  const [result, setResult] = useState<ExportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const startRef = useRef(0)
  const webcodecs = typeof VideoEncoder !== 'undefined'
  const ready = !!dataset && dataset.periods.length >= 2 && dataset.names.length > 0
  const format = formatById(settings.format)
  const total = totalDurationSec(settings, dataset?.periods.length ?? 0)

  useEffect(() => {
    if (!busy) return
    const t = setInterval(() => setElapsed((performance.now() - startRef.current) / 1000), 250)
    return () => clearInterval(t)
  }, [busy])

  const start = async (kind: ExportKind) => {
    if (!dataset) return
    setError(null)
    setResult(null)
    setBusy(kind)
    setProgress({ phase: 'prepare', frame: 0, total: 0, ratio: 0 })
    startRef.current = performance.now()
    preview.pause()
    const ac = new AbortController()
    abortRef.current = ac
    try {
      const res = await runExport({ dataset, settings, brand, kind, signal: ac.signal, pngIndex: preview.getSnapshot().index, onProgress: setProgress })
      setResult(res)
      downloadBlob(res.blob, res.filename)
    } catch (e) {
      if (!isAbortError(e)) setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(null)
      abortRef.current = null
    }
  }

  const pct = progress ? Math.round(progress.ratio * 100) : 0
  const phaseLabel = progress?.phase === 'prepare' ? 'Vorbereiten' : progress?.phase === 'render' ? 'Frames rendern' : progress?.phase === 'encode' ? 'Kodieren' : 'Abschließen'
  const eta = progress && progress.ratio > 0.02 && busy ? Math.max(0, elapsed / progress.ratio - elapsed) : null

  return (
    <div>
      <Section title="Video exportieren" hint={`${format.width}×${format.height} · ${total.toFixed(1)} s`}>
        <p className="text-[13px] text-ink-muted">
          Der Export rendert Frame für Frame in Zielauflösung (30 fps), unabhängig von der Rechnerleistung. Standbilder und Wasserzeichen sind in der Datei enthalten.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button type="button" className="btn-primary !min-h-12" disabled={!ready || !!busy} onClick={() => start('mp4')}>
            {busy === 'mp4' ? <Loader2 className="animate-spin" size={18} /> : <Film size={18} />} MP4
          </button>
          <button type="button" className="btn-ghost !min-h-12" disabled={!ready || !!busy} onClick={() => start('gif')}>
            {busy === 'gif' ? <Loader2 className="animate-spin" size={18} /> : <Clapperboard size={18} />} GIF
          </button>
          <button type="button" className="btn-ghost !min-h-12" disabled={!ready || !!busy} onClick={() => start('png')} title="Aktuelles Vorschaubild als PNG">
            {busy === 'png' ? <Loader2 className="animate-spin" size={18} /> : <FileImage size={18} />} PNG
          </button>
        </div>
        {busy && progress && (
          <div className="card flex flex-col gap-2 p-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium">{phaseLabel}{progress.note ? ` – ${progress.note}` : ''}</span>
              <span className="tabular-nums text-ink-muted">{progress.total ? `${progress.frame}/${progress.total} · ` : ''}{pct} %</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line"><div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} /></div>
            <div className="flex items-center justify-between text-xs text-ink-faint">
              <span className="tabular-nums">{elapsed.toFixed(0)} s{eta !== null ? ` · noch ca. ${Math.ceil(eta)} s` : ''}</span>
              <button type="button" className="btn-ghost !min-h-8 !px-2 !py-1 text-xs" onClick={() => abortRef.current?.abort()}><X size={13} /> Abbrechen</button>
            </div>
          </div>
        )}
        {result && !busy && (
          <div className="card flex items-center justify-between gap-2 p-3 text-[13px]">
            <span>
              <b>{result.filename}</b> · {(result.blob.size / 1024 / 1024).toFixed(1)} MB
              <span className="ml-2 text-ink-faint">{result.encoder === 'webcodecs' ? 'WebCodecs H.264' : result.encoder === 'ffmpeg' ? 'ffmpeg.wasm' : result.encoder}</span>
            </span>
            <button type="button" className="btn-ghost !min-h-9" onClick={() => downloadBlob(result.blob, result.filename)}><Download size={15} /> Erneut speichern</button>
          </div>
        )}
        {error && <p className="text-[13px] text-err">Export fehlgeschlagen: {error}</p>}
        <p className="text-[11px] leading-snug text-ink-faint">
          Für LinkedIn, Instagram und TikTok passt die Datei so, wie sie herauskommt: MP4 mit H.264, 1080p, 30 fps, ohne Tonspur. Im LinkedIn-Editor sieht man links und rechts schwarze Ränder, das ist nur die Vorschau des Editors und nicht Teil des Videos. Für den Feed ist 4:5 das Format mit der meisten Fläche.
        </p>
        <p className="text-[11px] leading-snug text-ink-faint">
          Encoder: {webcodecs ? 'WebCodecs (H.264) verfügbar – schnell und ohne Download.' : 'WebCodecs nicht verfügbar – es wird ffmpeg.wasm (ca. 30 MB, einmalig) geladen.'} GIF: max. 720 px, 15 fps. PNG: aktuelles Vorschaubild in Zielauflösung.
        </p>
      </Section>
    </div>
  )
}
