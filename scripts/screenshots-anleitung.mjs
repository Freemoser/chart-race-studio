/*
 * Erzeugt die Screenshots der Anleitung „Weltkarte nach Daten einfärben und animieren“ aus dem
 * echten Studio – nicht von Hand, damit sie nach jeder Änderung an der Oberfläche neu entstehen
 * können und nie etwas zeigen, das es so nicht mehr gibt.
 *
 *   npm run dev            (in einem zweiten Terminal)
 *   node scripts/screenshots-anleitung.mjs
 *
 * Ergebnis: public/beitrag/anleitung/*.png in doppelter Auflösung.
 */
import fs from 'node:fs'
import path from 'node:path'
import { starteChrome } from './lib/cdp.mjs'

const BASIS = process.env.STUDIO_URL ?? 'http://localhost:5173/'
const ZIEL = 'public/beitrag/anleitung'
const VORLAGE = path.resolve('public/vorlagen/vorlage-weltkarte.csv')
fs.mkdirSync(ZIEL, { recursive: true })

const b = await starteChrome({ breite: 1440, hoehe: 1000, skala: 2 })
try {
  // ---------- 1. Die Tabelle, wie sie im Tabellenprogramm aussieht ----------
  const zeilen = fs.readFileSync(VORLAGE, 'utf8').trim().split('\n').map((z) => z.split(','))
  const kopf = zeilen[0]
  const zeige = [...zeilen.slice(1, 6), null, zeilen.at(-1)]
  const td = (v, i) => `<td class="${i === 0 ? 'zeit' : kopf[i].startsWith('Summe:') ? 'summe' : ''}">${v}</td>`
  const html = `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 24px; font: 15px Inter, system-ui, sans-serif; background: #fff; }
    table { border-collapse: collapse; }
    th, td { border: 1px solid #d0d5db; padding: 7px 12px; text-align: right; font-variant-numeric: tabular-nums; }
    th { background: #f1f3f5; font-weight: 600; }
    .band th { border: 0; background: none; font-size: 12px; font-weight: 600; padding: 0 0 6px; text-align: center; }
    .band .z { color: #0f4c5c } .band .l { color: #6b7280 } .band .s { color: #e36414 }
    td.zeit, th.zeit { text-align: left; background: #f8fafb; font-weight: 600; }
    th.summe, td.summe { background: #fdf1e8; }
    tr.luecke td { text-align: center; color: #9aa3ad; }
  </style><table id="tabelle">
    <tr class="band"><th class="z">Zeit</th><th class="l" colspan="${kopf.length - 3}">Länder: deutsch, englisch oder ISO-Code</th><th class="s" colspan="2">Summen → Mini-Linie</th></tr>
    <tr>${kopf.map((h, i) => `<th class="${i === 0 ? 'zeit' : h.startsWith('Summe:') ? 'summe' : ''}">${h}</th>`).join('')}</tr>
    ${zeige.map((z) => z ? `<tr>${z.map(td).join('')}</tr>` : `<tr class="luecke"><td colspan="${kopf.length}">… eine Zeile je Jahr …</td></tr>`).join('\n')}
  </table>`
  const tmp = path.resolve(ZIEL, '_tabelle.html')
  fs.writeFileSync(tmp, html)
  await b.oeffne(`file://${tmp}`, { warteMs: 300 })
  await b.foto(`${ZIEL}/01-tabelle.png`, { selektor: '#tabelle', rand: 16 })
  fs.rmSync(tmp)

  // ---------- 2. Datei laden ----------
  await b.oeffne(BASIS, { warteMs: 1500 })
  await b.js(`localStorage.clear()`)
  await b.oeffne(BASIS, { warteMs: 1500 })
  const { root } = await b.cdp('DOM.getDocument')
  const { nodeId } = await b.cdp('DOM.querySelector', { nodeId: root.nodeId, selector: 'input[type=file]' })
  await b.cdp('DOM.setFileInputFiles', { nodeId, files: [VORLAGE] })
  await b.warte(1500)
  await b.js(`window.__crs.useApp.getState().updateSettings({ chartType: 'map', format: '1:1', topN: 5, title: 'Hund oder Katze – was ist wo häufiger?', subtitle: 'Hundeanteil an Hunden und Katzen, sechs Länder, 2000 bis 2026', source: 'Quelle: Tiermedizin in Zahlen, Vorlage Weltkarte', suffix: ' %' })`)
  await b.warte(1200)
  await b.foto(`${ZIEL}/02-datei-laden.png`, { selektor: '[data-section="Spaltenzuordnung"]' })

  // ---------- 3. Kartenabgleich ----------
  await b.foto(`${ZIEL}/03-kartenabgleich.png`, { selektor: '[data-section="Kartenabgleich"]' })

  // ---------- 4. Gestaltung: Karte und Kipppunkt ----------
  await b.klick('Gestaltung')
  await b.js(`window.__crs.useApp.getState().updateSettings({ divergingAt: 50, divergingLabels: ['Katzen', 'Hunde'], primaryAxisLabel: 'Länder je Stufe' })`)
  await b.warte(800)
  await b.foto(`${ZIEL}/04-gestaltung.png`, { selektor: '[data-section="Karte & Beschriftung"]' })

  // ---------- 5. Ergebnis ----------
  await b.js(`(() => { const r = document.querySelector('input[aria-label=Position]'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(r, r.max); r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })) })()`)
  await b.warte(1000)
  await b.foto(`${ZIEL}/05-ergebnis.png`, { selektor: '[data-buehne]' })

  const f = b.fehler()
  if (f.length) console.warn('Konsolenfehler im Studio:', f.slice(0, 3).map((e) => JSON.stringify(e.params).slice(0, 200)))
  console.log(fs.readdirSync(ZIEL).join(', '))
} finally {
  await b.ende()
}
