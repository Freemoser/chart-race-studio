import type { VideoFormat } from './formats'
import type { ChartSettings } from './settings'

export interface Rect { x: number; y: number; w: number; h: number }

export interface StageLayout {
  width: number
  height: number
  padding: number
  title: { x: number; y: number; size: number; lines: string[]; lineHeight: number; align: 'left' | 'center' } | null
  subtitle: { x: number; y: number; size: number; lines: string[]; lineHeight: number; align: 'left' | 'center' } | null
  chart: Rect
  date: { x: number; y: number; size: number; anchor: 'end' } | null
  caption: { x: number; y: number; size: number; lines: string[]; lineHeight: number } | null
  watermark: { x: number; y: number; size: number; anchor: 'start' | 'end'; baseline: 'top' | 'bottom'; logoSize: number } | null
  /** Basisschriftgröße für racing-bars (--base-font-size) */
  labelSize: number
}

export type MeasureFn = (text: string, font: string) => number

/** Zeilenumbruch anhand einer Messfunktion (Canvas measureText). */
export function wrapText(text: string, maxWidth: number, font: string, measure: MeasureFn, maxLines = 3): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (measure(test, font) <= maxWidth || !cur) cur = test
    else { lines.push(cur); cur = w }
    if (lines.length === maxLines) break
  }
  if (lines.length < maxLines && cur) lines.push(cur)
  else if (lines.length === maxLines && cur) {
    // Es blieb Text übrig: letzte Zeile mit Auslassungspunkten kennzeichnen
    const last = lines[maxLines - 1]
    lines[maxLines - 1] = measure(last + '…', font) <= maxWidth ? last + '…' : last.replace(/\s*\S*$/, '…')
  }
  return lines
}

export function fontString(size: number, weight: number, family: string) {
  return `${weight} ${size}px ${family}`
}

/**
 * Berechnet die Positionen aller Elemente auf der Bühne. Wird identisch von der
 * Live-Vorschau (DOM) und vom Export (Canvas) verwendet, damit beides deckungsgleich ist.
 */
export function computeLayout(format: VideoFormat, s: ChartSettings, measure: MeasureFn, family: string): StageLayout {
  const { width: W, height: H, preset: p } = format
  const pad = p.padding
  const contentW = W - pad * 2
  let y = pad

  const titleFont = fontString(p.titleSize, 700, family)
  const subFont = fontString(p.subtitleSize, 400, family)
  // Bei Datum oben rechts: Titelbreite reduzieren, damit sich nichts überlappt
  const dateW = s.showDate && p.dateTopRight ? measure('0000', fontString(p.dateSize, 700, family)) + pad * 0.5 : 0
  const textW = contentW - dateW

  let title: StageLayout['title'] = null
  if (s.title.trim()) {
    const lines = wrapText(s.title, textW, titleFont, measure, 2)
    const lh = p.titleSize * 1.15
    title = { x: s.titleAlign === 'center' ? W / 2 : pad, y, size: p.titleSize, lines, lineHeight: lh, align: s.titleAlign }
    y += lines.length * lh + p.titleSize * 0.25
  }
  let subtitle: StageLayout['subtitle'] = null
  if (s.subtitle.trim()) {
    const lines = wrapText(s.subtitle, textW, subFont, measure, 2)
    const lh = p.subtitleSize * 1.3
    subtitle = { x: s.titleAlign === 'center' ? W / 2 : pad, y, size: p.subtitleSize, lines, lineHeight: lh, align: s.titleAlign }
    y += lines.length * lh
  }
  if (title || subtitle) y += pad * 0.5

  let date: StageLayout['date'] = null
  const headerH = y - pad
  if (s.showDate && p.dateTopRight) {
    // Vertikal am Kopfbereich ausrichten (Grundlinie)
    const baseline = pad + Math.max(p.dateSize * 0.85, Math.min(headerH, p.dateSize * 0.85))
    date = { x: W - pad, y: baseline, size: p.dateSize, anchor: 'end' }
    y = Math.max(y, baseline + p.dateSize * 0.35)
  }

  // Fußbereich: Quelle + Wasserzeichen
  let bottom = H - pad
  const wmOnBottom = s.watermarkEnabled && s.watermarkPosition.startsWith('bottom')
  const wmSize = Math.round(p.watermarkSize * s.watermarkScale)
  const capFont = fontString(p.captionSize, 400, family)
  let caption: StageLayout['caption'] = null
  if (s.source.trim()) {
    const wmW = wmOnBottom && s.watermarkPosition === 'bottom-right' ? measure(s.watermarkText, fontString(wmSize, 600, family)) + (s.watermarkLogo ? wmSize * 1.6 : 0) + pad * 0.5 : 0
    // Quellenangaben dürfen nicht abgeschnitten werden: bis zu drei Zeilen, in schmalen Formaten vier.
    const lines = wrapText(s.source, contentW - wmW, capFont, measure, W < 1200 ? 4 : 3)
    const lh = p.captionSize * 1.3
    caption = { x: pad, y: bottom - lines.length * lh + lh * 0.8, size: p.captionSize, lines, lineHeight: lh }
    bottom -= lines.length * lh + p.captionSize * 0.6
  } else if (wmOnBottom) {
    bottom -= wmSize * 1.2 + p.captionSize * 0.4
  }

  let watermark: StageLayout['watermark'] = null
  if (s.watermarkEnabled) {
    const isRight = s.watermarkPosition.endsWith('right')
    const isBottom = s.watermarkPosition.startsWith('bottom')
    watermark = {
      x: isRight ? W - pad : pad,
      y: isBottom ? H - pad : pad,
      size: wmSize,
      anchor: isRight ? 'end' : 'start',
      baseline: isBottom ? 'bottom' : 'top',
      logoSize: wmSize * 1.4,
    }
    if (!isBottom && !title && !subtitle) y = Math.max(y, pad + wmSize * 1.6)
  }

  if (s.showDate && !p.dateTopRight) {
    // Datum unten rechts über dem Fußbereich
    date = { x: W - pad, y: bottom - p.captionSize * 0.2, size: p.dateSize, anchor: 'end' }
    bottom -= p.dateSize * 1.0
  }

  const chart: Rect = { x: pad, y, w: contentW, h: Math.max(200, bottom - y) }
  return { width: W, height: H, padding: pad, title, subtitle, chart, date, caption, watermark, labelSize: p.labelSize }
}

/**
 * Canvas-basierte Textmessung mit Cache. Der Cache wird geleert, sobald
 * Webfonts fertig geladen sind – sonst bleiben Maße der Fallback-Schrift stehen.
 */
export function createMeasurer(): MeasureFn {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  const ctx = canvas?.getContext('2d') ?? null
  const cache = new Map<string, number>()
  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.addEventListener('loadingdone', () => cache.clear())
    if (document.fonts.status === 'loading') document.fonts.ready.then(() => cache.clear())
  }
  return (text, font) => {
    if (!ctx) return text.length * 10
    const key = font + '|' + text
    const c = cache.get(key)
    if (c !== undefined) return c
    ctx.font = font
    const w = ctx.measureText(text).width
    cache.set(key, w)
    return w
  }
}
