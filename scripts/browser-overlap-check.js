/*
 * Automatischer Layout-Test für die Beispiel-Datensätze.
 *
 * Ausführen im Dev-Modus in der Browser-Konsole (window.__crs muss existieren):
 *   copy(await (await fetch('/scripts/browser-overlap-check.js')).text())  // oder Datei-Inhalt einfügen
 *
 * Geprüft wird für jeden Datensatz × Diagrammtyp × Format:
 *   - sichtbare Texte, die seitlich aus dem Chart-SVG herauslaufen
 *   - sich überlappende Texte (gleichartige Balken-Labels ausgenommen, die kreuzen beim Rangwechsel)
 *   - Bühnen-Elemente (Titel, Datum, Quelle, Wasserzeichen), die das Chart überdecken
 *   - abgeschnittene Bühnen-Texte (enden mit „…“)
 *
 * Wichtige Fallen, die hier bewusst behandelt werden:
 *   - Ausgeblendete Achsen-Ticks (display:none, Größe 0) dürfen NICHT als „außerhalb“ gelten.
 *   - Der Chart-Container ist beim Bar Race ein Enkel des SVG-Elternknotens, nicht der Elternknoten
 *     selbst; sonst wird der eigene Container als überlappendes Bühnen-Element gemeldet.
 *   - In versteckten Browser-Tabs laufen keine requestAnimationFrame-Callbacks und Timer werden
 *     gedrosselt. Für Bar-Race-Zwischenzustände deshalb den Export-Renderer (export.html) mit
 *     virtueller Uhr verwenden, nicht die Live-Vorschau.
 */
;(async () => {
  const { useApp } = window.__crs
  const { SAMPLES } = await import('/src/samples/index.ts')
  const wait = (ms) => new Promise((r) => setTimeout(r, ms))
  const inter = (a, b, tol = 1) => a.x < b.x + b.w - tol && a.x + a.w > b.x + tol && a.y < b.y + b.h - tol && a.y + a.h > b.y + tol
  const stageEl = () => document.querySelector('main section div[style*="transform"]')
  const visible = (t) => {
    const cs = getComputedStyle(t)
    if (cs.display === 'none' || cs.visibility === 'hidden') return false
    const r = t.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) return false
    return parseFloat(t.closest('g[opacity]')?.getAttribute('opacity') ?? '1') > 0.3
  }
  const findings = []
  let combos = 0
  for (const sample of SAMPLES) {
    for (const chartType of ['line', 'bar']) {
      for (const format of ['16:9', '1:1', '4:5', '9:16']) {
        const prev = document.querySelector('main section svg')
        useApp.getState().loadSample(sample)
        useApp.getState().updateSettings({ chartType, format })
        let svg = null
        for (let k = 0; k < 12; k++) {
          await wait(250)
          svg = document.querySelector('main section svg')
          if (svg && svg !== prev && svg.querySelector('text')) break
          svg = null
        }
        if (!svg) { findings.push({ sample: sample.id, chartType, format, issue: 'nicht gerendert' }); continue }
        combos++
        const sb = svg.getBoundingClientRect()
        const boxes = [...svg.querySelectorAll('text')].filter((t) => t.textContent.trim() && visible(t)).map((t) => {
          const r = t.getBoundingClientRect()
          return { x: r.left, y: r.top, w: r.width, h: r.height, txt: t.textContent.trim(), cls: t.getAttribute('class') || 'tick' }
        })
        for (const a of boxes) {
          if (a.x < sb.left - 1 || a.x + a.w > sb.right + 1) findings.push({ sample: sample.id, chartType, format, issue: 'Text seitlich außerhalb', text: a.txt, cls: a.cls })
        }
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i], b = boxes[j]
            const gleichartig = a.cls === b.cls && (a.cls.startsWith('label') || a.cls === 'valueLabel')
            if (inter(a, b) && !gleichartig) findings.push({ sample: sample.id, chartType, format, issue: 'Text-Überlappung', a: a.txt, b: b.txt, ca: a.cls, cb: b.cls })
          }
        }
        // Text gegen sichtbare Flächen (Legendenkästchen, Balken). Genau diese Klasse von
        // Fehlern hat die Prüfung lange übersehen: Die Legende der Weltkarte lag über ihren
        // eigenen Farbkästchen, und Text-gegen-Text meldete nichts.
        const flaechen = [...svg.querySelectorAll('rect')].filter((r) => {
          const f = r.getAttribute('fill') || ''
          if (!f || f === 'none' || f.startsWith('url(')) return false
          const b = r.getBoundingClientRect()
          return b.width > 2 && b.height > 2
        }).map((r) => { const b = r.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height } })
        for (const t of boxes) {
          for (const fl of flaechen) {
            if (inter(t, fl, 2)) { findings.push({ sample: sample.id, chartType, format, issue: 'Text über Farbfläche', text: t.txt }); break }
          }
        }

        let node = svg
        while (node.parentElement && node.parentElement !== stageEl()) node = node.parentElement
        const chart = node.getBoundingClientRect()
        for (const c of [...stageEl().children].filter((x) => x !== node && x.textContent.trim())) {
          const r = c.getBoundingClientRect()
          if (inter({ x: r.left, y: r.top, w: r.width, h: r.height }, { x: chart.left, y: chart.top, w: chart.width, h: chart.height }, 2)) {
            findings.push({ sample: sample.id, chartType, format, issue: 'Bühnen-Element überdeckt Chart', text: c.textContent.trim().slice(0, 40) })
          }
        }
        const gekuerzt = [...stageEl().querySelectorAll('div')].filter((d) => d.textContent.trim().endsWith('…'))
        if (gekuerzt.length) findings.push({ sample: sample.id, chartType, format, issue: 'Bühnen-Text abgeschnitten', text: gekuerzt[0].textContent.trim().slice(-50) })
      }
    }
  }
  return { geprüft: combos, befunde: findings.length, liste: findings }
})()
