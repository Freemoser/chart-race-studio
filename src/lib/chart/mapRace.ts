import * as d3 from 'd3'
import type { ChartHandle, ChartInput } from './types'
import { formatValue } from '../data/numbers'
import { createMeasurer, fontString } from '../layout'
import { ordneZu, summenSpalte } from './geo'

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
export function createMapRace(container: HTMLElement, input: ChartInput): ChartHandle {
  const measure = createMeasurer()
  const { width: W, height: H, periods } = input
  // Datenstandard: Spalten „Summe: …“ sind keine Flächen, sondern die Mini-Linie im Panel.
  // Alles andere wird über die Namenstabelle einer Fläche zugeordnet (deutsch, englisch, ISO).
  const zuordnung = ordneZu(input.names)
  const summen = zuordnung.summen
  const names = input.names.filter((n) => !summen.includes(n))
  const kartenRows = input.rows.filter((r) => !summen.includes(r.name))
  const P = periods.length
  const dark = input.theme === 'dark'
  const textColor = dark ? '#f2f4f7' : '#1c2229'
  const mutedColor = dark ? '#9aa3ad' : '#7a828c'
  const leerColor = dark ? '#2a2f35' : '#eceef1'
  const kanteColor = dark ? '#1a1d21' : '#ffffff'

  // Werte-Matrix: Name -> Periodenindex -> Wert
  const idx = new Map(periods.map((p, i) => [p.iso, i]))
  const serien = new Map<string, (number | null)[]>()
  for (const n of input.names) serien.set(n, new Array<number | null>(P).fill(null))
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
  const alleWerte = kartenRows.map((r) => r.value).filter((v) => Number.isFinite(v))
  const maxWert = alleWerte.length ? Math.max(...alleWerte) : 1
  const minWert = alleWerte.length ? Math.min(...alleWerte) : 0
  // Divergierend, sobald die Werte Anteile um einen Kipppunkt sind (hier: 50 Prozent).
  // Eine sequenzielle Skala würde „mehr Hunde" und „mehr Katzen" als dieselbe Richtung
  // darstellen – der Kipppunkt ist aber die ganze Aussage.
  const divergiert = input.divergingAt != null
  const mitte = input.divergingAt ?? 0
  // Stufen statt stufenloser Skala. Ein weicher Verlauf macht aus einem Kipppunkt einen
  // Grauverlauf – fast alle Länder landen dann in der Mitte und die Karte wird unlesbar.
  // Die Schwellen entsprechen der üblichen Einteilung: ±3 Punkte „etwa gleich", ±10 „leicht".
  const STUFEN = [mitte - 10, mitte - 3, mitte + 3, mitte + 10]
  const STUFENFARBEN = ['#20B2AA', '#9ADBCF', '#D9D9D9', '#F6B26B', '#F28C28']
  const stufe = d3.scaleThreshold<number, string>().domain(STUFEN).range(STUFENFARBEN)
  // Namen der fünf Stufen, von unten nach oben. Mit Seitennamen („Katzen“, „Hunde“) sprechend,
  // ohne neutral – eine fremde Tabelle soll nie mit „mehr Hunde“ beschriftet werden.
  const [seiteUnten, seiteOben] = input.divergingLabels ?? []
  const STUFENNAMEN = seiteUnten && seiteOben
    ? [`mehr ${seiteUnten}`, `leicht mehr ${seiteUnten}`, 'etwa gleich', `leicht mehr ${seiteOben}`, `mehr ${seiteOben}`]
    : ['deutlich darunter', 'leicht darunter', 'etwa am Kipppunkt', 'leicht darüber', 'deutlich darüber']
  const rampe = dark ? ['#1e2a36', '#85B7EB'] : ['#E6F1FB', '#0C447C']
  const farbe = divergiert
    ? (v: number) => stufe(v)
    : d3.scaleLinear<string>().domain([0, maxWert]).range(rampe).interpolate(d3.interpolateRgb).clamp(true)

  // Nur Bundesländer zeichnen, für die es auch Daten gibt – sonst suggeriert die Karte Lücken,
  // die in Wahrheit gar nicht Teil des Datensatzes sind.
  const FEATURES = zuordnung.features
  const passende = FEATURES.filter((f) => zuordnung.spalteFuer.has(f.properties.name))
  // Bei der Weltkarte alle Länder zeichnen, auch ohne Daten – eine Weltkarte mit Löchern
  // ist unlesbar. Bei Regionalkarten nur, was im Datensatz steht.
  const weltkarte = zuordnung.karte === 'welt'
  const zuZeichnen = weltkarte ? FEATURES : passende
  const flaechenWert = (flaeche: string, t: number) => {
    const spalte = zuordnung.spalteFuer.get(flaeche)
    return spalte ? wertAt(spalte, t) : null
  }

  // Layout: Seitenpanel rechts, im Hochformat darunter. Die Panelbreite richtet sich nach dem
  // längsten Namen, damit die Karte nicht unnötig Platz abgibt – „Mecklenburg-Vorpommern“ braucht
  // deutlich mehr als „Bayern“.
  const hochformat = W / H < 0.9
  const zeilenSchrift = Math.min(input.labelSize * 0.82, 20)
  // Bei Stufen stehen die Stufennamen im Panel, nicht die Ländernamen – sonst wird „leicht mehr Katzen“ abgeschnitten.
  const breitesterName = Math.max(...(divergiert ? STUFENNAMEN : names).map((n) => measure(n, fontString(zeilenSchrift, 400, input.fontFamily))))
  const breitesterWert = Math.max(...kartenRows.map((r) => measure(formatValue(r.value, input.numberFormat), fontString(zeilenSchrift, 600, input.fontFamily))))
  const mitSumme = summen.length > 0
  const panelSpalte = hochformat ? W : Math.min(Math.max(breitesterName + breitesterWert + zeilenSchrift * 2.4, 170), W * 0.34)
  // Im Hochformat teilen sich Liste und Mini-Linie die Breite, im Querformat die Höhe.
  const panelBreite = hochformat && mitSumme ? W * 0.52 : panelSpalte
  // Mit Stufen sind es immer genau fünf Zeilen, unabhängig von Top N.
  const sichtbarMax = divergiert ? STUFENFARBEN.length : Math.max(1, Math.min(names.length, input.topN))
  // Kopfzeile bekommt eigene Höhe und muss im Hochformat mit in die Panelhöhe, sonst läuft
  // die letzte Zeile unten aus dem Bild.
  const kopfHoehe = input.divergingAt != null && input.primaryAxisLabel ? zeilenSchrift * 1.6 : 0
  const panelHoehe = hochformat ? Math.min(H * 0.42, Math.max(16 + kopfHoehe + sichtbarMax * (zeilenSchrift * 1.6), mitSumme ? H * 0.3 : 0)) : H
  const kartenB = hochformat ? W : W - panelSpalte - 14
  const kartenH = hochformat ? H - panelHoehe - 12 : H

  const svg = d3.select(container).append('svg')
    .attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`)
    .attr('font-family', input.fontFamily)
  const gKarte = svg.append('g')
  const gPanel = svg.append('g').attr('transform', hochformat ? `translate(0,${kartenH + 12})` : `translate(${kartenB + 12},0)`)

  // Unten wird ein festes Band für die Legende reserviert. Vorher lief beides aus dem Bild:
  // Die Karte wurde in der vollen Höhe zentriert und die Legendenbeschriftung saß darunter.
  const legendBand = 46
  const projektion = (weltkarte ? d3.geoNaturalEarth1() : d3.geoMercator())
    .fitSize([kartenB, Math.max(40, kartenH - legendBand)], { type: 'FeatureCollection', features: zuZeichnen } as never)
  const pfad = d3.geoPath(projektion)

  const flaechen = gKarte.selectAll('path').data(zuZeichnen).join('path')
    .attr('d', (f) => pfad(f as never))
    .attr('stroke', kanteColor).attr('stroke-width', 0.75)

  // Legende im reservierten Band unten links
  const legB = Math.min(kartenB * 0.5, 180)
  const verlaufId = `crs-ramp-${Math.random().toString(36).slice(2, 8)}`
  const verlauf = svg.append('defs').append('linearGradient').attr('id', verlaufId)
  if (divergiert) {
    verlauf.append('stop').attr('offset', '0%').attr('stop-color', farbe(minWert))
    verlauf.append('stop').attr('offset', '50%').attr('stop-color', farbe(mitte))
    verlauf.append('stop').attr('offset', '100%').attr('stop-color', farbe(maxWert))
  } else {
    verlauf.append('stop').attr('offset', '0%').attr('stop-color', rampe[0])
    verlauf.append('stop').attr('offset', '100%').attr('stop-color', rampe[1])
  }
  const legSchrift = Math.min(input.labelSize * 0.72, 14)
  if (divergiert) {
    // Bei der Ja/Nein-Karte trägt das Seitenpanel bereits die fünf Stufen mit Namen und Anzahl.
    // Eine zweite, bebilderte Legende auf der Karte war redundant und lief in die Beschriftung
    // hinein. Hier bleibt eine Zeile, die nur die Leserichtung der Farben erklärt.
    const zeile = gKarte.append('text').attr('x', 2).attr('y', kartenH - 8)
      .attr('class', 'tick').attr('font-size', legSchrift)
    zeile.append('tspan').attr('fill', STUFENFARBEN[4]).attr('font-weight', 600).text('■ ')
    zeile.append('tspan').attr('fill', mutedColor).text(`${STUFENNAMEN[4]}   `)
    zeile.append('tspan').attr('fill', STUFENFARBEN[0]).attr('font-weight', 600).text('■ ')
    zeile.append('tspan').attr('fill', mutedColor).text(`${STUFENNAMEN[0]}   `)
    zeile.append('tspan').attr('fill', leerColor).attr('font-weight', 600).text('■ ')
    zeile.append('tspan').attr('fill', mutedColor).text('keine Daten')
  } else {
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
  }

  // Seitenpanel: die Werte des aktuellen Jahres, absteigend. Der Block wird vertikal zentriert,
  // sonst klebt eine kurze Liste oben in der Ecke und die Fläche darunter bleibt leer.
  const sichtbar = sichtbarMax
  // Querformat mit Summe: Die Liste bekommt den oberen Teil, die Mini-Linie das untere Drittel.
  const summenHoehe = mitSumme && !hochformat ? Math.min(H * 0.4, 300) : 0
  const listenHoehe = panelHoehe - summenHoehe
  const zeilenHoehe = Math.max(zeilenSchrift * 1.2, Math.min(zeilenSchrift * 2.6, (listenHoehe - kopfHoehe - 10) / sichtbar))
  const schrift = zeilenSchrift
  const oben = kopfHoehe + Math.max(0, (listenHoehe - kopfHoehe - sichtbar * zeilenHoehe) / 2)
  if (kopfHoehe) {
    gPanel.append('text').attr('x', 0).attr('y', oben - zeilenHoehe + schrift * 0.2)
      .attr('class', 'axisTitle').attr('font-size', schrift * 0.85).attr('font-weight', 600).attr('fill', mutedColor)
      .text(input.primaryAxisLabel)
  }
  const zeilen = d3.range(sichtbar).map((i) => {
    const g = gPanel.append('g').attr('transform', `translate(0,${oben + i * zeilenHoehe + schrift})`)
    return {
      punkt: g.append('rect').attr('x', 0).attr('y', -schrift * 0.78).attr('width', schrift * 0.72).attr('height', schrift * 0.72).attr('rx', 2),
      name: g.append('text').attr('x', schrift * 1.15).attr('class', 'label').attr('font-size', schrift).attr('fill', textColor),
      wert: g.append('text').attr('x', panelBreite - 2).attr('text-anchor', 'end').attr('class', 'valueLabel')
        .attr('font-size', schrift).attr('font-weight', 600).attr('fill', textColor),
    }
  })

  // ---------- Mini-Linie der Summenspalten ----------
  // Zeigt, was die Karte nicht zeigen kann: die absolute Menge. Feste Achse ab 0 über den ganzen
  // Zeitraum, aus demselben Grund wie beim Line-Race – eine mitlaufende Achse ließe jedes Jahr
  // gleich hoch aussehen.
  const summe = (() => {
    if (!mitSumme) return null
    const box = hochformat
      ? { x: panelBreite + 16, y: 0, b: W - panelBreite - 16, h: panelHoehe }
      : { x: 0, y: listenHoehe + 8, b: panelSpalte, h: summenHoehe - 8 }
    const g = gPanel.append('g').attr('transform', `translate(${box.x},${box.y})`)
    const titelSchrift = schrift * 0.85
    g.append('text').attr('y', titelSchrift).attr('class', 'axisTitle').attr('font-size', titelSchrift)
      .attr('font-weight', 600).attr('fill', mutedColor)
      .text(weltkarte ? 'Weltweit' : zuordnung.karte === 'bundeslaender' ? 'Deutschland' : 'Insgesamt')
    const reihen = summen.map((spalte, k) => {
      const { name, einheit } = summenSpalte(spalte)
      const farbeR = /hund/i.test(name) ? STUFENFARBEN[4] : /katz/i.test(name) ? STUFENFARBEN[0] : input.colors[spalte]
      const y = titelSchrift * 1.4 + (k + 1) * schrift * 1.5
      const zg = g.append('g').attr('transform', `translate(0,${y})`)
      zg.append('rect').attr('y', -schrift * 0.78).attr('width', schrift * 0.72).attr('height', schrift * 0.72).attr('rx', 2).attr('fill', farbeR)
      zg.append('text').attr('x', schrift * 1.15).attr('class', 'label').attr('font-size', schrift).attr('fill', textColor).text(name)
      const wert = zg.append('text').attr('x', box.b - 2).attr('text-anchor', 'end').attr('class', 'valueLabel')
        .attr('font-size', schrift).attr('font-weight', 600).attr('fill', textColor)
      return { spalte, einheit, farbe: farbeR, wert, reihe: serien.get(spalte) ?? [] }
    })
    const obenLinie = titelSchrift * 1.4 + (summen.length + 1) * schrift * 1.5 - schrift * 0.4
    const achsSchrift = schrift * 0.7
    const hoeheLinie = Math.max(30, box.h - obenLinie - achsSchrift * 1.8)
    const maxS = Math.max(1, ...reihen.flatMap((r) => r.reihe.filter((v): v is number => v != null)))
    const x = d3.scaleLinear().domain([0, Math.max(1, P - 1)]).range([0, box.b - 2])
    const y = d3.scaleLinear().domain([0, maxS * 1.08]).range([obenLinie + hoeheLinie, obenLinie])
    g.append('line').attr('x1', 0).attr('x2', box.b - 2).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', mutedColor).attr('stroke-opacity', 0.35)
    const jahr = (i: number) => periods[i]?.label ?? ''
    g.append('text').attr('x', 0).attr('y', y(0) + achsSchrift * 1.35).attr('class', 'tick').attr('font-size', achsSchrift).attr('fill', mutedColor).text(jahr(0))
    g.append('text').attr('x', box.b - 2).attr('y', y(0) + achsSchrift * 1.35).attr('text-anchor', 'end').attr('class', 'tick').attr('font-size', achsSchrift).attr('fill', mutedColor).text(jahr(P - 1))
    const linien = reihen.map((r) => ({
      ...r,
      pfad: g.append('path').attr('fill', 'none').attr('stroke', r.farbe).attr('stroke-width', Math.max(2, schrift * 0.14)).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round'),
      punkt: g.append('circle').attr('r', Math.max(3, schrift * 0.22)).attr('fill', r.farbe),
    }))
    const zahl = (v: number, einheit: string) => `${v.toLocaleString('de-DE', { maximumFractionDigits: v >= 100 ? 0 : 1 })}${einheit ? ` ${einheit}` : ''}`
    return (t: number) => {
      for (const l of linien) {
        const punkte: [number, number][] = []
        for (let i = 0; i <= Math.floor(t); i++) if (l.reihe[i] != null) punkte.push([x(i), y(l.reihe[i] as number)])
        const v = wertAt(l.spalte, t)
        if (v != null) punkte.push([x(t), y(v)])
        l.pfad.attr('d', punkte.length ? d3.line()(punkte) : null)
        l.punkt.attr('opacity', v == null ? 0 : 1).attr('cx', x(t)).attr('cy', v == null ? 0 : y(v))
        l.wert.text(v == null ? '' : zahl(v, l.einheit))
      }
    }
  })()

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
    aktuell = t
    summe?.(t)
    flaechen.attr('fill', (f) => {
      const v = flaechenWert(f.properties.name, t)
      return v == null ? leerColor : farbe(v)
    })
    // Bei der Ja/Nein-Karte ist eine Rangliste sinnlos – die Spitzenplätze sind Annahmewerte.
    // Stattdessen die Verteilung: wie viele Länder liegen in welcher Stufe.
    const rang = divergiert
      ? (() => {
          const namen = STUFENNAMEN
          const zahl = [0, 0, 0, 0, 0]
          for (const n of names) {
            const v = wertAt(n, t)
            if (v == null) continue
            let i = 0
            while (i < STUFEN.length && v >= STUFEN[i]) i++
            zahl[i]++
          }
          return zahl.map((z, i) => ({ n: namen[i], v: z, farbe: STUFENFARBEN[i] })).reverse()
        })()
      : names
          .map((n) => ({ n, v: wertAt(n, t), farbe: null as string | null }))
          .filter((d): d is { n: string; v: number; farbe: string | null } => d.v != null)
          .sort((a, b) => b.v - a.v)
    zeilen.forEach((z, i) => {
      const d = rang[i]
      if (!d) { z.punkt.attr('opacity', 0); z.name.text(''); z.wert.text(''); return }
      const wertText = divergiert ? String(d.v) : formatValue(d.v, input.numberFormat)
      const platz = panelBreite - schrift * 1.15 - measure(wertText, fontString(schrift, 600, input.fontFamily)) - 10
      z.punkt.attr('opacity', 1).attr('fill', d.farbe ?? farbe(d.v))
      z.name.text(kuerze(d.n, Math.max(20, platz)))
      z.wert.text(wertText)
    })
  }
  renderAt(0)

  const hoerer: ((i: number, last: boolean) => void)[] = []

  // Abspielen in Echtzeit für die Vorschau. Ohne eigene Schleife passiert beim Klick auf Play
  // nichts: Die Vorschau ruft nur play() und verlässt sich darauf, dass der Renderer selbst
  // läuft und onDateChange meldet. Der Export braucht das nicht, der stellt die Zeit selbst.
  let timer: d3.Timer | null = null
  let laeuft = false
  const play = () => {
    if (laeuft) return
    laeuft = true
    const startT = aktuell
    const startMs = performance.now()
    timer = d3.timer(() => {
      const t = startT + (performance.now() - startMs) / input.tickDuration
      const i = Math.floor(Math.min(P - 1, t))
      const vorher = Math.floor(aktuell)
      renderAt(Math.min(P - 1, t))
      if (i !== vorher) hoerer.forEach((f) => f(i, i >= P - 1))
      if (t >= P - 1) { pause(); hoerer.forEach((f) => f(P - 1, true)) }
    })
  }
  const pause = () => { laeuft = false; timer?.stop(); timer = null }

  return {
    kind: 'map',
    dates: periods.map((p) => p.iso),
    goTo: (i: number) => { renderAt(i); hoerer.forEach((f) => f(i, i >= P - 1)) },
    renderAt,
    play,
    pause,
    isRunning: () => laeuft,
    currentIndex: () => Math.round(aktuell),
    onDateChange: (fn) => { hoerer.push(fn); return () => { const i = hoerer.indexOf(fn); if (i >= 0) hoerer.splice(i, 1) } },
    svg: () => svg.node(),
    destroy: () => { pause(); svg.remove() },
  }
}
