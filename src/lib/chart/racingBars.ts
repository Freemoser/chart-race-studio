import { race, type Data, type Options, type Race } from 'racing-bars'
import type { ChartHandle, ChartInput } from './types'
import { formatValue, parseNumber } from '../data/numbers'
import { createMeasurer, fontString } from '../layout'

/**
 * Wrapper um racing-bars. Alle Anpassungen passieren hier – als Optionen,
 * CSS-Overrides im Container oder DOM-Nachbearbeitung – niemals in der Library.
 * Siehe docs/UPGRADING.md.
 */

let counter = 0
const measure = createMeasurer()

/**
 * Kürzt einen Text mit Auslassungspunkten auf die verfügbare Breite.
 * racing-bars zeichnet die Namen selbst und kürzt nicht, deshalb kürzen wir die Namen in den Daten.
 */
function fitText(text: string, maxW: number, font: string): string {
  if (maxW <= 0) return ''
  if (measure(text, font) <= maxW) return text
  let lo = 0, hi = text.length
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    if (measure(text.slice(0, mid) + '…', font) <= maxW) lo = mid
    else hi = mid - 1
  }
  return lo > 0 ? text.slice(0, lo) + '…' : ''
}

/**
 * Bei `labelsPosition: 'outside'` reserviert racing-bars links genau `labelsWidth` Pixel und kürzt
 * nichts. In schmalen Formaten (9:16) würden lange Namen die ganze Zeichenfläche auffressen, deshalb
 * begrenzen wir die Label-Spalte auf 38 % der Breite und kürzen die Namen entsprechend.
 */
export function labelColumn(input: ChartInput): { width: number; shorten: (name: string) => string } {
  const labelFont = fontString(input.labelSize, 600, input.fontFamily)
  if (input.labelsPosition !== 'outside') return { width: 150, shorten: (n) => n }
  const longest = input.names.reduce((a, b) => (measure(b, labelFont) > measure(a, labelFont) ? b : a), '')
  const needed = Math.ceil(measure(longest, labelFont)) + 16
  const max = Math.max(input.labelSize * 4, Math.round(input.width * 0.38))
  const width = Math.min(needed, max)
  const budget = width - 16
  return { width, shorten: (n) => fitText(n, budget, labelFont) }
}

export function barOptions(input: ChartInput): Options {
  const valueFont = fontString(input.labelSize, 500, input.fontFamily)
  const labelsWidth = labelColumn(input).width
  // Breitester Wert (nach unserer Formatierung), damit Wertlabels rechts nicht abgeschnitten werden
  const maxVal = input.rows.reduce((m, r) => Math.max(m, Math.abs(r.value)), 0)
  const widestValue = measure(formatValue(maxVal, input.numberFormat), valueFont)
  // racing-bars reserviert intern 65px rechts; den Rest ergänzen wir über marginRight
  const marginRight = Math.max(0.01, Math.ceil(widestValue) + 12 - 65)

  const { shorten } = labelColumn(input)
  const colorMap: Record<string, string> = {}
  for (const n of input.names) colorMap[shorten(n)] = input.colors[n]

  return {
    dataShape: 'long',
    dataType: 'json',
    fillDateGapsInterval: null,
    title: '',
    subTitle: '',
    caption: '',
    dateCounter: '',
    labelsPosition: input.labelsPosition,
    labelsWidth,
    showIcons: input.showImages && Object.keys(input.images).length > 0,
    showGroups: false,
    highlightBars: false,
    selectBars: false,
    fixedScale: input.fixedScale,
    controlButtons: 'none',
    overlays: 'none',
    mouseControls: false,
    keyboardControls: false,
    autorun: false,
    loop: false,
    theme: input.theme,
    colorMap,
    injectStyles: true,
    height: input.height,
    width: input.width,
    marginTop: 0.01,
    marginRight,
    marginBottom: 0.01,
    marginLeft: 0.01,
    topN: input.topN,
    tickDuration: Math.max(1, input.tickDuration),
    // Wertlabels formatieren wir selbst (siehe attachValueFormatter); die Library
    // liefert eine maschinenlesbare en-US-Zahl.
    valueLocale: 'en-US',
    valueDecimals: input.numberFormat.compact ? 3 : input.numberFormat.decimals,
  }
}

export function toRacingData(input: ChartInput): Data[] {
  const withIcons = input.showImages
  const { shorten } = labelColumn(input)
  return input.rows.map((r) => {
    const d: Data = { date: r.date, name: shorten(r.name), value: r.value }
    if (withIcons && input.images[r.name]) d.icon = input.images[r.name]
    return d
  })
}

/** CSS, das die Library-Styles gezielt überschreibt (nur innerhalb des Containers). */
export function overrideCss(id: string, input: ChartInput): string {
  const sel = `#${id}`
  // Geschätzte Balkenhöhe für Rundung (Library: (h - Ränder)/(topN*5) Padding)
  const usable = input.height - 30
  const barH = (usable / input.topN) * 0.8
  const rx = Math.round(barH * 0.5 * input.barRounding)
  const iconScale = input.imageScale
  return `
${sel} { background: transparent !important; font-family: ${input.fontFamily}; }
${sel} svg text { font-family: ${input.fontFamily} !important; }
${sel} svg text.label { font-weight: 600; }
${sel} svg text.valueLabel { font-weight: 500; }
${sel} svg rect.bar { rx: ${rx}px; ry: ${rx}px; }
${sel} svg circle { transform: scale(${iconScale}); transform-box: fill-box; transform-origin: center; }
${sel} svg .xAxis .domain { display: none; }
${sel} svg .xAxis .tick line { stroke: ${input.theme === 'dark' ? '#3a3f45' : '#dfe3e8'}; }
${sel} svg .xAxis .tick text { fill: ${input.theme === 'dark' ? '#9aa3ad' : '#7a828c'}; }
${sel} .controls, ${sel} .overlay { display: none !important; }
`
}

/**
 * DOM-Nachbearbeitung nach jedem Render von racing-bars (per MutationObserver):
 *  - Wertlabels nach unseren Regeln formatieren (Präfix, Suffix, Tausender, kompakt);
 *    die Library liefert en-US-Zahlen per Tween.
 *  - Achsenbeschriftung (oben) im gleichen Zahlenformat, ohne Präfix/Suffix.
 *  - Bei zu dichten Achsen-Ticks (schmale Formate) jeden k-ten Tick ausblenden,
 *    damit sich Beschriftungen nicht überlagern. Entscheidung anhand der
 *    Tick-Abstände, dadurch stabil über die Animation.
 */
export function attachValueFormatter(root: HTMLElement, input: ChartInput): () => void {
  const fmt = (raw: string) => {
    const n = parseNumber(raw.replace(/,/g, ''))
    return n === null ? raw : formatValue(n, input.numberFormat)
  }
  const axisFormat = { ...input.numberFormat, prefix: '', suffix: '' }
  const fmtAxis = (raw: string) => {
    const n = parseNumber(raw.replace(/,/g, ''))
    return n === null ? raw : formatValue(n, axisFormat)
  }
  const tickFont = fontString(input.labelSize * 0.8, 400, input.fontFamily)
  const tickX = (g: Element) => { const m = /translate\(([-\d.]+)/.exec(g.getAttribute('transform') ?? ''); return m ? Number(m[1]) : NaN }
  let scheduled = false
  const apply = () => {
    scheduled = false
    root.querySelectorAll<SVGTextElement>('text.valueLabel').forEach((el) => {
      const t = el.textContent ?? ''
      if (!t || (el as unknown as { __fmt?: string }).__fmt === t) return
      const out = fmt(t)
      ;(el as unknown as { __fmt?: string }).__fmt = out
      if (out !== t) el.textContent = out
    })
    // Achsen-Ticks: formatieren und ausdünnen
    const ticks = [...root.querySelectorAll<SVGGElement>('.xAxis .tick')]
      .map((g) => ({ g, x: tickX(g), text: g.querySelector('text') }))
      .filter((t) => t.text && Number.isFinite(t.x))
      .sort((a, b) => a.x - b.x)
    let widest = 0
    for (const t of ticks) {
      const raw = t.text!.textContent ?? ''
      const marked = t.text as unknown as { __fmt?: string }
      if (raw && marked.__fmt !== raw) {
        const out = fmtAxis(raw)
        marked.__fmt = out
        if (out !== raw) t.text!.textContent = out
      }
      widest = Math.max(widest, measure(t.text!.textContent ?? '', tickFont))
    }
    if (ticks.length > 1) {
      let minGap = Infinity
      for (let i = 1; i < ticks.length; i++) minGap = Math.min(minGap, ticks[i].x - ticks[i - 1].x)
      const k = minGap > 0 && Number.isFinite(minGap) ? Math.max(1, Math.ceil((widest * 1.25) / minGap)) : 1
      ticks.forEach((t, i) => { t.text!.style.display = i % k === 0 ? '' : 'none' })
    }
  }
  const obs = new MutationObserver(() => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(apply)
  })
  obs.observe(root, { subtree: true, childList: true, characterData: true })
  apply()
  return () => obs.disconnect()
}

export async function createBarRace(container: HTMLElement, input: ChartInput): Promise<ChartHandle> {
  // Eigenes inneres Element mit generierter ID: Die ID des übergebenen Containers bleibt unangetastet
  // (racing-bars scoped sein CSS auf die Element-ID).
  const id = `crs-bar-${++counter}`
  const inner = document.createElement('div')
  inner.id = id
  inner.style.width = `${input.width}px`
  inner.style.height = `${input.height}px`
  inner.style.setProperty('--base-font-size', `${input.labelSize / 1.5}px`)
  container.appendChild(inner)
  const style = document.createElement('style')
  style.textContent = overrideCss(id, input)
  document.head.appendChild(style)

  const racer: Race = await race(toRacingData(input), inner, barOptions(input))
  const detachFmt = attachValueFormatter(inner, input)
  const dates = racer.getAllDates()
  const listeners = new Set<(i: number, last: boolean) => void>()
  racer.on('dateChange', (d) => {
    const i = dates.indexOf(d.date)
    listeners.forEach((fn) => fn(i, d.isLastDate))
  })

  return {
    kind: 'bar',
    dates,
    goTo: (i) => racer.setDate(dates[Math.min(dates.length - 1, Math.max(0, i))]),
    play: () => racer.play(),
    pause: () => racer.pause(),
    isRunning: () => racer.isRunning(),
    currentIndex: () => dates.indexOf(racer.getDate()),
    onDateChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn) },
    svg: () => inner.querySelector('svg'),
    destroy: () => {
      detachFmt()
      try { racer.destroy() } catch { /* bereits entfernt */ }
      style.remove()
      inner.remove()
    },
  }
}
