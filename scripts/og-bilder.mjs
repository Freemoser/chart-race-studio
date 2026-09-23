/*
 * Erzeugt die Vorschaubilder (1200 × 630), die LinkedIn, Slack und Messenger beim Teilen eines
 * Links zeigen. Ohne sie erscheint im ersten Kommentar unter einem Post nur eine graue Kachel.
 *
 *   node scripts/og-bilder.mjs
 *
 * Rendert mit einem lokal installierten Chrome im Headless-Modus, deshalb läuft das Skript nicht
 * im Build, sondern von Hand – die Bilder werden eingecheckt:
 *   public/og-standard.png           für alle Seiten ohne eigenes Bild
 *   public/beitrag/og/<slug>.png     je Artikel mit `bereit: ja`
 *
 * Das Bild zeigt die Antwort, nicht nur die Frage: Titel und Kernzahl aus dem ersten Satz der
 * Beschreibung. Wer im Feed nur das Bild sieht, soll die Zahl schon haben.
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const CHROME = process.env.CHROME_BIN ?? [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => fs.existsSync(p))
if (!CHROME) { console.error('Kein Chrome gefunden. Pfad über CHROME_BIN setzen.'); process.exit(1) }

const L = JSON.parse(fs.readFileSync('src/content/legal.json', 'utf8'))
const INDEX = JSON.parse(fs.readFileSync('src/content/artikel-index.json', 'utf8'))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const FONT = pathToFileURL(path.resolve('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).href

function karte({ oben, titel, text }) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url('${FONT}') format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; font-family: Inter, sans-serif; background: #0f4c5c; color: #fff;
  padding: 72px 80px; display: flex; flex-direction: column; font-feature-settings: 'tnum' 1; }
.oben { font-size: 26px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #9adbcf; }
h1 { margin-top: 28px; font-size: ${titel.length > 55 ? 58 : 66}px; line-height: 1.08; font-weight: 750; letter-spacing: -0.02em; }
p { margin-top: 28px; font-size: 30px; line-height: 1.35; color: #d7ebe8; max-width: 1000px; }
.fuss { margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 24px; color: #9adbcf; }
.balken { width: 120px; height: 10px; background: #e36414; border-radius: 5px; }
</style></head><body>
<div class="oben">${esc(oben)}</div>
<h1>${esc(titel)}</h1>
${text ? `<p>${esc(text)}</p>` : ''}
<div class="fuss"><span>${esc(L.operator)} · Zahlen mit Quelle</span><span class="balken"></span></div>
</body></html>`
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'))
function render(html, ziel) {
  const f = path.join(tmp, 'karte.html')
  fs.writeFileSync(f, html)
  fs.mkdirSync(path.dirname(ziel), { recursive: true })
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', `--screenshot=${path.resolve(ziel)}`, pathToFileURL(f).href], { stdio: 'ignore' })
}

render(karte({ oben: 'Tiermedizin in Zahlen', titel: 'Tierärzte, Praxen und Haustiere in Deutschland', text: 'Zeitreihen seit 1991 – jede Zahl mit Jahr und Quelle.' }), 'public/og-standard.png')
let n = 1
for (const a of INDEX.filter((x) => x.bereit)) {
  const ersterSatz = a.beschreibung.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? a.beschreibung
  render(karte({ oben: 'Tiermedizin in Zahlen', titel: a.titel, text: ersterSatz }), `public/beitrag/og/${a.slug}.png`)
  n++
}
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`${n} Vorschaubilder erzeugt.`)
