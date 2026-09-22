import * as d3 from 'd3'
import type { ChartHandle, ChartInput } from './types'
import { formatValue } from '../data/numbers'
import { createMeasurer, fontString } from '../layout'
import geo from '../../assets/bundeslaender.json'

/**
 * Choropleth-Race für die deutschen Bundesländer.
 *
 * Wie der Line-Renderer ist `renderAt(t)` eine reine Funktion der Zeit ohne Transitions,
 * damit der Frame-für-Frame-Export exakt reproduzierbar bleibt. Zwischen zwei Jahren wird
 * linear interpoliert, dadurch wandert die Farbe weich statt zu springen.
 *
 * Die Farbskala hat eine über den gesamten Zeitraum feste Domäne. Eine mitlaufende Skala
 * würde jedes Jahr neu normieren – die Karte sähe dann immer gleich aus, egal wie sich die
 * Werte entwickeln. Genau dieser Fehler war beim Line-Race schon einmal drin.
 */
type GeoFeature = { type: 'Feature'; properties: { name: string }; geometry: d3.GeoGeometryObjects }
const FEATURES = (geo as { features: GeoFeature[] }).features

export function createMapRace(container: HTMLElement, input: ChartInput): ChartHandle {
  const measure = createMeasurer()
  const { width: W, height: H, periods, names } = input
  const P = periods.length
  const dark = input.theme === 'dark'
  const textColor = dark ? '#f2f4f7' : '#1c2229'
  const mutedColor = dark ? '#9aa3ad' : '#7a828c'
  const leerColor = dark ? '#2a2f35' : '#eceef1'
  const kanteColor = dark ? '#1a1d21' : '#ffffff'

  // Werte-Matrix: Name -> Periodenindex -> Wert
  const idx = new Map(periods.map((p, i) => [p.iso, i]))
  const serien = new Map<string, (number | null)[]>()
  for (const n of names) serien.set(n, new Array<number | null>(P).fill(null))
  for (const r of input.rows) {
    const i = idx.get(r.date)
    if (i !== undefined) serien.get(r.name)?.splice(i, 1, r.value)
  }
  const wertAt = (n: string, t: number): number | null => {
    const reihe = serien.get(n)
    if (!reihe) return null
    const i = Math.max(0, Math.min(P - 1, Math.floor(t)))
    const j = Math.min(P - 1, i + 1)
    const a = reihe[i], b = reihe[j]
    if (a == null) return b == null ? null : b
    if (b == null) return a
    return a + (b - a) * (t - i)
  }

  // Feste Domäne über alle Werte. Untergrenze bewusst 0, damit die Fläche ehrlich bleibt.
  const alleWerte = input.rows.map((r) => r.value).filter((v) => Number.isFinite(v))
  const maxWert = alleWerte.length ? Math.max(...alleWerte) : 1
  const rampe = dark ? ['#1e2a36', '#85B7EB'] : ['#E6F1FB', '#0C447C']
  const farbe = d3.scaleLinear<string>().domain([0, maxWert]).range(rampe).interpolate(d3.interpolateRgb).clamp(true)

  // Nur Bundesländer zeichnen, für die es auch Daten gibt – sonst suggeriert die Karte Lücken,
  // die in Wahrheit gar nicht Teil des Datensatzes sind.
  const bekannt = new Set(names)
  const passende = FEATURES.filter((f) => bekannt.has(f.properties.name))

  // Layout: Seitenpanel rechts, im Hochformat darunter. Die Panelbreite richtet sich nach dem
  // längsten Namen, damit die Karte nicht unnötig Platz abgibt – „Mecklenburg-Vorpommern“ braucht
  // deutlich mehr als „Bayern“.
  const hochformat = W / H < 0.9
  const zeilenSchrift = Math.min(input.labelSize * 0.82, 20)
  const breitesterName = Math.max(...names.map((n) => measure(n, fontString(zeilenSchrift, 400, input.fontFamily))))
  const breitesterWert = Math.max(...input.rows.map((r) => measure(formatValue(r.value, input.numberFormat), fontString(zeilenSchrift, 600, input.fontFamily))))
  const panelBreite = hochformat ? W : Math.min(Math.max(breitesterName + breitesterWert + zeilenSchrift * 2.4, 170), W * 0.34)
  const sichtbarMax = Math.max(1, Math.min(names.length, input.topN))
  const panelHoehe = hochformat ? Math.min(H * 0.42, 16 + sichtbarMax * (zeilenSchrift * 1.6)) : H
  const kartenB = hochformat ? W : W - panelBreite - 14
  const kartenH = hochformat ? H - panelHoehe - 12 : H

  const svg = d3.select(container).append('svg')
    .attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`)
    .attr('font-family', input.fontFamily)
  const gKarte = svg.append('g')
  const gPanel = svg.append('g').attr('transform', hochformat ? `translate(0,${kartenH + 12})` : `translate(${kartenB + 12},0)`)

  // Unten wird ein festes Band für die Legende reserviert. Vorher lief beides aus dem Bild:
  // Die Karte wurde in der vollen Höhe zentriert und die Legendenbeschriftung saß darunter.
  const legendBand = 46
  const projektion = d3.geoMercator().fitSize([kartenB, Math.max(40, kartenH - legendBand)], { type: 'FeatureCollection', features: passende } as never)
  const pfad = d3.geoPath(projektion)

  const flaechen = gKarte.selectAll('path').data(passende).join('path')
    .attr('d', (f) => pfad(f as never))
    .attr('stroke', kanteColor).attr('stroke-width', 0.75)

  // Legende im reservierten Band unten links
  const legB = Math.min(kartenB * 0.5, 180)
  const verlaufId = `crs-ramp-${Math.random().toString(36).slice(2, 8)}`
  const verlauf = svg.append('defs').append('linearGradient').attr('id', verlaufId)
  verlauf.append('stop').attr('offset', '0%').attr('stop-color', rampe[0])
  verlauf.append('stop').attr('offset', '100%').attr('stop-color', rampe[1])
  const legSchrift = Math.min(input.labelSize * 0.72, 14)
  gKarte.append('rect').attr('x', 2).attr('y', kartenH - 26).attr('width', legB).attr('height', 8).attr('rx', 2)
    .attr('fill', `url(#${verlaufId})`)
  gKarte.append('text').attr('x', 2).attr('y', kartenH - 5).attr('class', 'tick')
    .attr('font-size', legSchrift).attr('fill', mutedColor).text('0')
  gKarte.append('text').attr('x', legB).attr('y', kartenH - 5).attr('text-anchor', 'end').attr('class', 'tick')
    .attr('font-size', legSchrift).attr('fill', mutedColor)
    .text(formatValue(maxWert, input.numberFormat))
  if (input.primaryAxisLabel) {
    gKarte.append('text').attr('x', 2).attr('y', kartenH - 32).attr('class', 'axisTitle')
      .attr('font-size', legSchrift).attr('font-weight', 600).attr('fill', mutedColor)
      .text(input.primaryAxisLabel)
  }

  // Seitenpanel: die Werte des aktuellen Jahres, absteigend. Der Block wird vertikal zentriert,
  // sonst klebt eine kurze Liste oben in der Ecke und die Fläche darunter bleibt leer.
  const sichtbar = sichtbarMax
  const zeilenHoehe = Math.max(zeilenSchrift * 1.35, Math.min(zeilenSchrift * 2.6, (panelHoehe - 12) / sichtbar))
  const schrift = zeilenSchrift
  const oben = Math.max(0, (panelHoehe - sichtbar * zeilenHoehe) / 2)
  const zeilen = d3.range(sichtbar).map((i) => {
    const g = gPanel.append('g').attr('transform', `translate(0,${oben + i * zeilenHoehe + schrift})`)
    return {
      punkt: g.append('rect').attr('x', 0).attr('y', -schrift * 0.78).attr('width', schrift * 0.72).attr('height', schrift * 0.72).attr('rx', 2),
      name: g.append('text').attr('x', schrift * 1.15).attr('class', 'label').attr('font-size', schrift).attr('fill', textColor),
      wert: g.append('text').attr('x', panelBreite - 2).attr('text-anchor', 'end').attr('class', 'valueLabel')
        .attr('font-size', schrift).attr('font-weight', 600).attr('fill', textColor),
    }
  })

  const nameFont = fontString(schrift, 400, input.fontFamily)
  const kuerze = (s: string, max: number) => {
    if (measure(s, nameFont) <= max) return s
    let lo = 0, hi = s.length
    while (lo < hi) {
      const m = (lo + hi + 1) >> 1
      if (measure(s.slice(0, m) + '…', nameFont) <= max) lo = m; else hi = m - 1
    }
    return lo > 0 ? s.slice(0, lo) + '…' : ''
  }

  let aktuell = 0
  function renderAt(t: number) {
    aktuell = Math.max(0, Math.min(P - 1, Math.round(t)))
    flaechen.attr('fill', (f) => {
      const v = wertAt(f.properties.name, t)
      return v == null ? leerColor : farbe(v)
    })
    const rang = names
      .map((n) => ({ n, v: wertAt(n, t) }))
      .filter((d): d is { n: string; v: number } => d.v != null)
      .sort((a, b) => b.v - a.v)
    zeilen.forEach((z, i) => {
      const d = rang[i]
      if (!d) { z.punkt.attr('opacity', 0); z.name.text(''); z.wert.text(''); return }
      const wertText = formatValue(d.v, input.numberFormat)
      const platz = panelBreite - schrift * 1.15 - measure(wertText, fontString(schrift, 600, input.fontFamily)) - 10
      z.punkt.attr('opacity', 1).attr('fill', farbe(d.v))
      z.name.text(kuerze(d.n, Math.max(20, platz)))
      z.wert.text(wertText)
    })
  }
  renderAt(0)

  const hoerer: ((i: number, last: boolean) => void)[] = []
  let laeuft = false
  return {
    kind: 'map',
    dates: periods.map((p) => p.iso),
    goTo: (i: number) => { renderAt(i); hoerer.forEach((f) => f(i, i >= P - 1)) },
    renderAt,
    play: () => { laeuft = true },
    pause: () => { laeuft = false },
    isRunning: () => laeuft,
    currentIndex: () => aktuell,
    onDateChange: (fn) => { hoerer.push(fn); return () => { const i = hoerer.indexOf(fn); if (i >= 0) hoerer.splice(i, 1) } },
    svg: () => svg.node(),
    destroy: () => { svg.remove() },
  }
}
