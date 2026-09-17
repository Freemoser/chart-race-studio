import * as d3 from 'd3'
import type { ChartHandle, ChartInput } from './types'
import { formatValue } from '../data/numbers'
import { createMeasurer, fontString } from '../layout'
import { formatPeriod } from '../data/dates'

/**
 * Eigener, deterministischer Line-Chart-Race-Renderer auf D3-Basis.
 * `renderAt(t)` zeichnet den Zustand zu einem beliebigen (auch gebrochenen)
 * Datums-Index – ohne Transitions, dadurch exakt reproduzierbar im Export.
 * Unterstützt eine zweite Y-Achse rechts (input.secondaryAxis).
 */
export function createLineRace(container: HTMLElement, input: ChartInput): ChartHandle {
  const measure = createMeasurer()
  const { width: W, height: H, periods, names } = input
  const P = periods.length
  const dark = input.theme === 'dark'
  const axisColor = dark ? '#9aa3ad' : '#7a828c'
  const gridColor = dark ? '#33383e' : '#e6e9ed'
  const textColor = dark ? '#f2f4f7' : '#1c2229'
  const onRight = (n: string) => input.secondaryAxis.includes(n)
  const hasRight = names.some(onRight)
  const fmtFor = (n: string) => (onRight(n) ? input.secondaryFormat : input.numberFormat)

  // Werte-Matrix name -> index -> value|null
  const idx = new Map(periods.map((p, i) => [p.iso, i]))
  const series = new Map<string, (number | null)[]>()
  for (const n of names) series.set(n, new Array<number | null>(P).fill(null))
  for (const r of input.rows) {
    const i = idx.get(r.date)
    if (i !== undefined) series.get(r.name)?.splice(i, 1, r.value)
  }
  const extent = (right: boolean) => {
    let max = 0, min = 0
    for (const r of input.rows) if (onRight(r.name) === right) { if (r.value > max) max = r.value; if (r.value < min) min = r.value }
    return { max, min }
  }
  const extL = extent(false), extR = extent(true)

  const labelFont = fontString(input.labelSize, 600, input.fontFamily)
  const valueFont = fontString(input.labelSize * 0.9, 500, input.fontFamily)
  const tickFont = fontString(input.labelSize * 0.8, 400, input.fontFamily)
  const axisTitleFont = fontString(input.labelSize * 0.8, 600, input.fontFamily)
  // Kopf-Labels sind einzeilig: „Name  Wert“. Platz rechts = breitestes Label + Bild + Abstand.
  const gapText = input.labelSize * 0.45
  const imgSizeAll = input.labelSize * 1.3 * input.imageScale
  const labelWidth = (n: string) => measure(n, labelFont) + gapText + measure(formatValue(onRight(n) ? extR.max : extL.max, fmtFor(n)), valueFont)
  const widestLabel = names.reduce((m, n) => Math.max(m, labelWidth(n)), 0)
  const leftTicks = Math.ceil(Math.max(measure(formatValue(extL.max, input.numberFormat), tickFont), measure(formatValue(extL.min, input.numberFormat), tickFont))) + 16
  const rightTicks = hasRight ? Math.ceil(measure(formatValue(extR.max, input.secondaryFormat), tickFont)) + 16 : 0
  // Die Label-Spalte darf den Plot nicht auffressen: in schmalen Formaten (9:16, besonders mit zweiter
  // Achse) bleibt die Zeichenfläche mindestens 45 % breit, Namen werden dann gekürzt.
  const headNeeded = Math.ceil(widestLabel) + input.labelSize * 1.2 + (input.showImages ? imgSizeAll + input.labelSize * 0.3 : 0)
  const headMax = Math.max(input.labelSize * 3, W - leftTicks - rightTicks - W * 0.45)
  const headSpace = Math.min(headNeeded, headMax)
  const titleSpace = input.primaryAxisLabel || (hasRight && input.secondaryAxisLabel) ? input.labelSize * 1.4 : 0
  // Zweite Achse steht ganz außen, hinter der Label-Spalte, damit sich Ticks und Kopf-Labels nie überlagern.
  const margin = { top: input.labelSize + titleSpace, right: headSpace + rightTicks, bottom: input.labelSize * 2.2, left: leftTicks }
  const plotW = Math.max(50, W - margin.left - margin.right)
  const plotH = Math.max(50, H - margin.top - margin.bottom)

  const svg = d3.select(container).append('svg').attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`)
  svg.style('font-family', input.fontFamily)
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
  const gridG = g.append('g').attr('class', 'grid')
  const yAxisG = g.append('g').attr('class', 'y-axis')
  const y2AxisG = g.append('g').attr('class', 'y2-axis').attr('transform', `translate(${plotW + headSpace},0)`)
  const xAxisG = g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${plotH})`)
  const linesG = g.append('g').attr('class', 'lines')
  const headsG = g.append('g').attr('class', 'heads')
  const defs = svg.append('defs')

  // Achsentitel
  if (input.primaryAxisLabel) g.append('text').attr('x', -margin.left + 4).attr('y', -input.labelSize * 0.9).attr('fill', axisColor).style('font', axisTitleFont).text(input.primaryAxisLabel)
  if (hasRight && input.secondaryAxisLabel) g.append('text').attr('x', plotW + headSpace + rightTicks - 4).attr('y', -input.labelSize * 0.9).attr('fill', axisColor).attr('text-anchor', 'end').style('font', axisTitleFont).text(input.secondaryAxisLabel)

  const x = d3.scaleLinear().domain([0, Math.max(1, P - 1)]).range([0, plotW])
  // Feste Achsen über den gesamten Zeitraum: keine springende Skala während der Animation.
  const y = d3.scaleLinear().domain([extL.min, (extL.max || 1) * 1.06]).nice().range([plotH, 0])
  const y2 = d3.scaleLinear().domain([extR.min, (extR.max || 1) * 1.06]).nice().range([plotH, 0])
  const scaleFor = (n: string) => (onRight(n) ? y2 : y)
  const styleAxis = (sel: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    sel.select('.domain').remove()
    sel.selectAll('text').attr('fill', axisColor).style('font', tickFont)
    sel.selectAll('line').attr('stroke', gridColor)
  }
  yAxisG.call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(8).tickFormat((v) => formatValue(Number(v), input.numberFormat)))
  styleAxis(yAxisG)
  if (hasRight) {
    y2AxisG.call(d3.axisRight(y2).ticks(5).tickSize(0).tickPadding(8).tickFormat((v) => formatValue(Number(v), input.secondaryFormat)))
    styleAxis(y2AxisG)
  }
  gridG.call(d3.axisLeft(y).ticks(5).tickSize(-plotW).tickFormat(() => ''))
  styleAxis(gridG)

  // Bild-Muster für Köpfe
  const patternId = (n: string) => `lr-img-${Math.abs(hash(n))}`
  if (input.showImages) {
    for (const n of names) {
      const img = input.images[n]
      if (!img) continue
      const size = input.labelSize * 1.3 * input.imageScale
      defs.append('pattern').attr('id', patternId(n)).attr('patternUnits', 'objectBoundingBox').attr('width', 1).attr('height', 1)
        .append('image').attr('href', img).attr('width', size).attr('height', size).attr('preserveAspectRatio', 'xMidYMid slice')
    }
  }

  // x-Achse: nur echte Perioden, ausgedünnt
  const realIdx = periods.map((p, i) => (p.real ? i : -1)).filter((i) => i >= 0)
  const maxTicks = Math.max(2, Math.floor(plotW / (input.labelSize * 4)))
  const every = Math.ceil(realIdx.length / maxTicks)
  // Regelmäßige Ticks plus letztes Jahr; ein zu nah am Ende liegender Regel-Tick entfällt (sonst „2024 2025“ übereinander)
  const regular = realIdx.filter((_, k) => k % every === 0)
  const lastIdx = realIdx[realIdx.length - 1]
  const tickIdx = regular.filter((v, k) => k === 0 || lastIdx - v >= every || v === lastIdx)
  if (tickIdx[tickIdx.length - 1] !== lastIdx) tickIdx.push(lastIdx)
  const defaultTpl = (kind: string) => (kind === 'year' ? 'YYYY' : kind === 'quarter' ? 'Q YYYY' : kind === 'month' ? 'MMM YYYY' : kind === 'day' ? 'DD.MM.YY' : 'LABEL')
  xAxisG.call(d3.axisBottom(x).tickValues(tickIdx).tickFormat((v) => formatPeriod(periods[Number(v)], defaultTpl(periods[Number(v)].kind))).tickSize(0).tickPadding(10))
  xAxisG.select('.domain').attr('stroke', gridColor)
  xAxisG.selectAll('text').attr('fill', axisColor).style('font', tickFont)
  // Erstes/letztes Jahr nach innen ausrichten: kollidiert sonst mit dem „0“ der Y-Achse bzw. der Label-Spalte
  xAxisG.selectAll<SVGTextElement, number>('.tick text').attr('text-anchor', (_, i, nodes) => (i === 0 ? 'start' : i === nodes.length - 1 ? 'end' : 'middle'))
  xAxisG.selectAll<SVGTextElement, number>('.tick text').attr('dx', (_, i, nodes) => (i === 0 ? -input.labelSize * 0.3 : i === nodes.length - 1 ? input.labelSize * 0.3 : 0))

  /** Kürzt einen Text mit Auslassungspunkten auf die verfügbare Breite. */
  const fitText = (text: string, maxW: number, font: string): string => {
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

  const valueAt = (vals: (number | null)[], t: number): number | null => {
    const i = Math.floor(t)
    const f = t - i
    const a = vals[i]
    if (a === null || a === undefined) return null
    if (f <= 0 || i + 1 >= P) return a
    const b = vals[i + 1]
    return b === null || b === undefined ? a : a + (b - a) * f
  }

  let current = 0
  const listeners = new Set<(i: number, last: boolean) => void>()

  function renderAt(t: number) {
    t = Math.max(0, Math.min(P - 1, t))
    current = t
    const heads: { name: string; v: number }[] = []
    const upto = Math.floor(t)
    for (const n of names) {
      const v = valueAt(series.get(n)!, t)
      if (v !== null) heads.push({ name: n, v })
    }

    // Top-N-Zugehörigkeit (nur linke Achse) als stetige Deckkraft; rechte Achse immer voll
    const sorted = heads.filter((h) => !onRight(h.name)).sort((a, b) => b.v - a.v)
    const hi = sorted[input.topN - 1]?.v
    const lo = sorted[input.topN]?.v
    const opacityFor = (h: { name: string; v: number }) => {
      if (onRight(h.name) || hi === undefined) return 1
      if (lo === undefined || h.v >= hi) return 1
      if (h.v <= lo) return 0.18
      return 0.18 + 0.82 * ((h.v - lo) / (hi - lo || 1))
    }
    const headOf = (n: string) => heads.find((h) => h.name === n)

    const paths = linesG.selectAll<SVGPathElement, string>('path').data(names, (d) => d)
    paths.enter().append('path').attr('fill', 'none').attr('stroke-width', Math.max(2, input.labelSize * 0.14)).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round')
      .merge(paths)
      .attr('stroke', (n) => input.colors[n])
      .attr('stroke-dasharray', (n) => (onRight(n) ? `${input.labelSize * 0.5} ${input.labelSize * 0.3}` : null))
      // Reihen ohne aktuellen Wert (beendet) bleiben als Verlauf sichtbar, nur gedämpft
      .attr('opacity', (n) => { const h = headOf(n); return h ? opacityFor(h) : series.get(n)!.slice(0, upto + 1).some((v) => v !== null) ? 0.45 : 0 })
      .attr('d', (n) => {
        const vals = series.get(n)!
        const sc = scaleFor(n)
        const line = d3.line<[number, number]>().x((d) => x(d[0])).y((d) => sc(d[1]))
        const pts: [number, number][] = []
        for (let i = 0; i <= upto; i++) { const v = vals[i]; if (v !== null) pts.push([i, v]) }
        const v = valueAt(vals, t)
        if (v !== null && t > upto) pts.push([t, v])
        return pts.length ? line(pts) : null
      })

    // Köpfe und einzeilige Labels („Name  Wert“) mit Kollisionsauflösung, innerhalb der Plot-Höhe geklemmt
    const visible = heads.filter((h) => opacityFor(h) > 0.25)
    const minGap = input.labelSize * 1.35
    const placed = visible.map((h) => ({ ...h, y: scaleFor(h.name)(h.v), ty: scaleFor(h.name)(h.v) }))
    // Label-Box (einzeilig, Grundlinie ty + 0.35·labelSize) vollständig innerhalb der Plot-Höhe halten
    const lo_ = input.labelSize * 0.75, hi_ = plotH - input.labelSize * 0.8
    for (let iter = 0; iter < 20; iter++) {
      placed.sort((a, b) => a.ty - b.ty)
      let moved = false
      for (let i = 1; i < placed.length; i++) {
        const gap = placed[i].ty - placed[i - 1].ty
        if (gap < minGap - 0.01) { const push = (minGap - gap) / 2; placed[i - 1].ty -= push; placed[i].ty += push; moved = true }
      }
      // Klemmen und ggf. nach innen schieben
      for (const p of placed) p.ty = Math.max(lo_, Math.min(hi_, p.ty))
      for (let i = 1; i < placed.length; i++) if (placed[i].ty - placed[i - 1].ty < minGap - 0.01) placed[i].ty = Math.min(hi_, placed[i - 1].ty + minGap)
      for (let i = placed.length - 2; i >= 0; i--) if (placed[i + 1].ty - placed[i].ty < minGap - 0.01) placed[i].ty = Math.max(lo_, placed[i + 1].ty - minGap)
      if (!moved) break
    }
    const xHead = x(t)
    const imgSize = imgSizeAll
    const hasImg = (n: string) => input.showImages && !!input.images[n]
    const heads$ = headsG.selectAll<SVGGElement, typeof placed[number]>('g.head').data(placed, (d) => d.name)
    const enter = heads$.enter().append('g').attr('class', 'head')
    enter.append('path').attr('class', 'leader').attr('fill', 'none').attr('stroke-width', 1)
    enter.append('circle').attr('class', 'dot')
    enter.append('circle').attr('class', 'img')
    enter.append('text').attr('class', 'name').style('font', labelFont)
    enter.append('text').attr('class', 'value').style('font', valueFont)
    const merged = enter.merge(heads$)
    merged.attr('opacity', (d) => opacityFor(d))
    const x0 = xHead + input.labelSize * 0.5
    merged.select<SVGCircleElement>('circle.dot').attr('cx', xHead).attr('cy', (d) => d.y).attr('r', Math.max(3, input.labelSize * 0.22)).attr('fill', (d) => input.colors[d.name])
    // Verbindungslinie nur, wenn das Label verschoben werden musste
    merged.select<SVGPathElement>('path.leader')
      .attr('stroke', (d) => input.colors[d.name]).attr('opacity', 0.6)
      .attr('d', (d) => (Math.abs(d.ty - d.y) > 1 ? `M${xHead},${d.y} L${x0 - input.labelSize * 0.15},${d.ty}` : null))
    merged.select<SVGCircleElement>('circle.img')
      .attr('display', (d) => (hasImg(d.name) ? null : 'none'))
      .attr('cx', x0 + imgSize / 2).attr('cy', (d) => d.ty)
      .attr('r', imgSize / 2).attr('fill', (d) => `url(#${patternId(d.name)})`).attr('stroke', (d) => input.colors[d.name]).attr('stroke-width', 2)
    const textX = (d: typeof placed[number]) => x0 + (hasImg(d.name) ? imgSize + input.labelSize * 0.3 : 0)
    const baseline = (d: typeof placed[number]) => d.ty + input.labelSize * 0.35
    // Namen auf den verbleibenden Platz kürzen, damit nichts über die zweite Achse hinausläuft
    const shownName = (d: typeof placed[number]) => {
      const budget = headSpace - (textX(d) - x0) - input.labelSize * 0.4 - gapText - measure(formatValue(d.v, fmtFor(d.name)), valueFont)
      return fitText(d.name, budget, labelFont)
    }
    merged.select<SVGTextElement>('text.name').attr('x', textX).attr('y', baseline).attr('fill', textColor).text(shownName)
    merged.select<SVGTextElement>('text.value').attr('x', (d) => textX(d) + measure(shownName(d), labelFont) + gapText).attr('y', baseline).attr('fill', axisColor).text((d) => formatValue(d.v, fmtFor(d.name)))
    heads$.exit().remove()
  }

  // Abspielen in Echtzeit (Vorschau)
  let timer: d3.Timer | null = null
  let running = false
  const play = () => {
    if (running) return
    running = true
    const startT = current
    const startMs = performance.now()
    timer = d3.timer(() => {
      const t = startT + (performance.now() - startMs) / input.tickDuration
      const i = Math.floor(Math.min(P - 1, t))
      const prev = Math.floor(current)
      renderAt(t)
      if (i !== prev) listeners.forEach((fn) => fn(i, i >= P - 1))
      if (t >= P - 1) { pause(); listeners.forEach((fn) => fn(P - 1, true)) }
    })
  }
  const pause = () => { running = false; timer?.stop(); timer = null }

  renderAt(0)

  return {
    kind: 'line',
    dates: periods.map((p) => p.iso),
    goTo: (i) => renderAt(i),
    renderAt,
    play,
    pause,
    isRunning: () => running,
    currentIndex: () => Math.floor(current),
    onDateChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn) },
    svg: () => container.querySelector('svg'),
    destroy: () => { pause(); container.innerHTML = '' },
  }
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}
