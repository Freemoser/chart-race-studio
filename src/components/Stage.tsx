import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '@/state/store'
import { formatById } from '@/lib/formats'
import { computeLayout, createMeasurer } from '@/lib/layout'
import { prepareChartInput } from '@/lib/chart/prepare'
import { createChart } from '@/lib/chart/create'
import type { ChartHandle } from '@/lib/chart/types'
import { preview, usePreview } from '@/lib/preview/controller'
import { BRAND_FONTS, ensureFontsLoaded } from '@/lib/fonts'
import { stageColors } from '@/lib/stageColors'
import { formatPeriod, periodForLabel } from '@/lib/data/dates'

const measure = createMeasurer()

/**
 * Live-Vorschau in Zielauflösung, per CSS-Transform auf die verfügbare Fläche
 * skaliert. Layout-Berechnung ist dieselbe wie im Export (computeLayout).
 */
export function Stage() {
  const dataset = useApp((s) => s.dataset)
  const settings = useApp((s) => s.settings)
  const brand = useApp((s) => s.brand)
  const format = formatById(settings.format)
  const family = BRAND_FONTS[brand].css
  const [fontsReady, setFontsReady] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<ChartHandle | null>(null)
  const [scale, setScale] = useState(0.3)
  const snap = usePreview()

  useEffect(() => { ensureFontsLoaded(brand).then(() => setFontsReady((n) => n + 1)) }, [brand])

  // fontsReady/brand erzwingen eine Neuberechnung, sobald Schriften geladen sind (Textmaße ändern sich)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layout = useMemo(() => computeLayout(format, settings, measure, family), [format, settings, family, fontsReady])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colors = useMemo(() => stageColors(settings.theme), [settings.theme, brand, fontsReady])

  const input = useMemo(
    () => (dataset && dataset.periods.length >= 2 && dataset.names.length > 0 ? prepareChartInput(dataset, settings, layout.chart, layout.labelSize, family) : null),
    [dataset, settings, layout.chart, layout.labelSize, family],
  )
  // Schlüssel, bei dessen Änderung das Chart neu aufgebaut wird
  const inputKey = useMemo(() => (input ? JSON.stringify({ ...input, rows: input.rows.length, periods: input.periods.length, rowsHash: hashRows(input.rows) }) + settings.chartType : ''), [input, settings.chartType])

  // Skalierung an verfügbare Fläche
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setScale(Math.min(r.width / format.width, r.height / format.height))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [format.width, format.height])

  // Chart-Lebenszyklus
  useEffect(() => {
    const container = chartRef.current
    if (!container || !input) { preview.detach(); handleRef.current = null; return }
    let cancelled = false
    const prevIndex = preview.getSnapshot().index
    const wasPlaying = preview.getSnapshot().playing
    preview.detach()
    handleRef.current?.destroy()
    handleRef.current = null
    container.innerHTML = ''
    const timer = setTimeout(() => {
      createChart(settings.chartType, container, input).then((h) => {
        if (cancelled) { h.destroy(); return }
        handleRef.current = h
        preview.attach(h, prevIndex, wasPlaying)
      })
    }, 120)
    return () => { cancelled = true; clearTimeout(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputKey, fontsReady])

  useEffect(() => () => { preview.detach(); handleRef.current?.destroy() }, [])
  useEffect(() => { preview.holdStart = settings.holdStart; preview.holdEnd = settings.holdEnd; preview.loop = settings.loopPreview }, [settings.holdStart, settings.holdEnd, settings.loopPreview])

  const dateLabel = input ? formatPeriod(periodForLabel(input.periods, snap.index), settings.dateTemplate) : ''
  const W = format.width, H = format.height

  return (
    <div ref={wrapRef} className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div style={{ width: W * scale, height: H * scale }} className="relative shadow-[0_10px_40px_-12px_rgba(0,0,0,.35)]">
        <div
          className="absolute left-0 top-0 origin-top-left select-none overflow-hidden"
          style={{ width: W, height: H, transform: `scale(${scale})`, background: colors.bg, color: colors.fg, fontFamily: family }}
        >
          {layout.title && (
            <div className="absolute" style={{ left: layout.title.align === 'center' ? 0 : layout.title.x, width: layout.title.align === 'center' ? W : undefined, top: layout.title.y, textAlign: layout.title.align, fontSize: layout.title.size, lineHeight: `${layout.title.lineHeight}px`, fontWeight: 700, whiteSpace: 'pre' }}>
              {layout.title.lines.join('\n')}
            </div>
          )}
          {layout.subtitle && (
            <div className="absolute" style={{ left: layout.subtitle.align === 'center' ? 0 : layout.subtitle.x, width: layout.subtitle.align === 'center' ? W : undefined, top: layout.subtitle.y, textAlign: layout.subtitle.align, fontSize: layout.subtitle.size, lineHeight: `${layout.subtitle.lineHeight}px`, fontWeight: 400, color: colors.muted, whiteSpace: 'pre' }}>
              {layout.subtitle.lines.join('\n')}
            </div>
          )}
          {layout.date && settings.showDate && (
            <div className="absolute tabular-nums" style={{ right: W - layout.date.x, top: layout.date.y - layout.date.size * 0.92, fontSize: layout.date.size, lineHeight: 1, fontWeight: 700, opacity: 0.85 }}>
              {dateLabel}
            </div>
          )}
          <div ref={chartRef} className="absolute" style={{ left: layout.chart.x, top: layout.chart.y, width: layout.chart.w, height: layout.chart.h }} />
          {!input && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: Math.round(W / 40), color: colors.muted }}>
              Daten laden, um die Vorschau zu sehen
            </div>
          )}
          {layout.caption && (
            <div className="absolute" style={{ left: layout.caption.x, top: layout.caption.y - layout.caption.size * 0.8, fontSize: layout.caption.size, lineHeight: `${layout.caption.lineHeight}px`, color: colors.muted, whiteSpace: 'pre' }}>
              {layout.caption.lines.join('\n')}
            </div>
          )}
          {layout.watermark && settings.watermarkEnabled && (
            <div
              className="absolute flex items-center"
              style={{
                [layout.watermark.anchor === 'end' ? 'right' : 'left']: layout.watermark.anchor === 'end' ? W - layout.watermark.x : layout.watermark.x,
                [layout.watermark.baseline === 'bottom' ? 'bottom' : 'top']: layout.watermark.baseline === 'bottom' ? H - layout.watermark.y : layout.watermark.y,
                gap: layout.watermark.size * 0.5,
                fontSize: layout.watermark.size,
                lineHeight: 1,
                fontWeight: 600,
                opacity: settings.watermarkOpacity,
                height: layout.watermark.logoSize,
              }}
            >
              {settings.watermarkLogo && <img src={settings.watermarkLogo} alt="" style={{ width: layout.watermark.logoSize, height: layout.watermark.logoSize, objectFit: 'contain' }} />}
              <span style={{ paddingBottom: layout.watermark.baseline === 'bottom' ? layout.watermark.size * 0.12 : 0 }}>{settings.watermarkText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function hashRows(rows: { date: string; name: string; value: number }[]): number {
  let h = 0
  for (const r of rows) {
    const s = r.date + r.name + r.value
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return h
}
