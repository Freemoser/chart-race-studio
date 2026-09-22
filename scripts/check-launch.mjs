/*
 * Livegang-Prüfung. Läuft gegen den BUILD, nicht gegen den Quelltext – geprüft wird,
 * was ausgeliefert wird. Aufruf: npm run build && npm run check:launch
 *
 * Getrennt nach Blockern (Exit 1) und Hinweisen (Exit 0).
 *
 * Grundregel: auf Fehlerklassen prüfen, nicht auf konkrete Altwerte. Eine Prüfung auf eine
 * bestimmte Platzhalter-Domain schlägt nach deren Entfernung nie wieder an und ist dann
 * stiller toter Code.
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'
const blocker = []
const hinweise = []
const lies = (f) => fs.readFileSync(f, 'utf8')

if (!fs.existsSync(DIST)) {
  console.log('Kein dist/ gefunden. Erst `npm run build` ausführen.')
  process.exit(1)
}

// ---------- Rechtsangaben ----------
const L = JSON.parse(lies('src/content/legal.json'))
if (!L.street) blocker.push('Impressum: Straße und Hausnummer fehlen (§ 5 DDG verlangt eine ladungsfähige Anschrift; ein unvollständiges Impressum ist abmahnfähig).')
if (!L.zip) blocker.push('Impressum: PLZ fehlt.')
if (!L.email && !L.phone) blocker.push('Impressum: keine Kontaktmöglichkeit hinterlegt.')
if (!fs.existsSync('LICENSE')) blocker.push('LICENSE fehlt, das Projekt verspricht aber MIT.')

// ---------- Pflichtseiten im Build ----------
for (const datei of ['impressum.html', 'datenschutz.html']) {
  const p = path.join(DIST, datei)
  if (!fs.existsSync(p)) { blocker.push(`Pflichtseite ${datei} fehlt im Build.`); continue }
  const html = lies(p)
  if (!/<meta name="robots" content="noindex/.test(html)) {
    blocker.push(`${datei} trägt kein noindex. Im Impressum steht eine ladungsfähige, oft private Anschrift – die gehört nicht als eigenes Suchergebnis in den Index.`)
  }
  if (/TODO|TBD|FIXME|Platzhalter/i.test(html)) blocker.push(`${datei} enthält noch einen Platzhalter.`)
}

// ---------- Alle ausgelieferten Seiten einsammeln ----------
const seiten = []
const gehe = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) gehe(p)
    else if (e.name.endsWith('.html')) seiten.push(p)
  }
}
gehe(DIST)
// export.html ist der interne Render-Rahmen, keine Seite
const inhaltsSeiten = seiten.filter((p) => !p.endsWith('export.html') && !p.endsWith('404.html'))
// Route in der Schreibweise, die tatsächlich ausgeliefert wird – auf GitHub Pages mit .html.
const route = (p) => '/' + path.relative(DIST, p).replace(/^index\.html$/, '')

// ---------- Canonical ----------
const start = path.join(DIST, 'index.html')
const canonical = lies(start).match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ''
if (!canonical) hinweise.push('Startseite hat kein Canonical. Entsteht, wenn VITE_SITE_URL beim Build nicht gesetzt ist.')
else if (/localhost|127\.0\.0\.1|\.pages\.dev|example\./.test(canonical)) blocker.push(`Canonical zeigt auf ${canonical} statt auf die Live-Domain.`)

// ---------- Sitemap gegen noindex, beide Richtungen ----------
const sitemapPfad = path.join(DIST, 'sitemap.xml')
if (!fs.existsSync(sitemapPfad)) {
  hinweise.push('Keine sitemap.xml im Build. Entsteht nur mit gesetztem VITE_SITE_URL.')
} else {
  const xml = lies(sitemapPfad)
  const inSitemap = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/'))
  const basis = canonical ? new URL(canonical).pathname.replace(/\/$/, '') : ''
  for (const p of inhaltsSeiten) {
    const html = lies(p)
    const noindex = /<meta name="robots" content="noindex/.test(html)
    const r = (basis + route(p)).replace(/\/$/, '') || '/'
    if (noindex && inSitemap.has(r)) blocker.push(`${route(p)} steht in der Sitemap, trägt aber noindex. Die Search Console meldet das als Fehler.`)
    if (!noindex && !inSitemap.has(r)) hinweise.push(`${route(p)} ist indexierbar, fehlt aber in der Sitemap.`)
  }
  for (const loc of inSitemap) if (/#/.test(loc)) blocker.push(`Sitemap enthält ${loc} – Fragmente sind keine eigenen URLs.`)
}

// ---------- Canonical je Seite eindeutig ----------
const canons = new Map()
for (const p of inhaltsSeiten) {
  const html = lies(p)
  const c = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  if (!c) continue
  if (canons.has(c)) blocker.push(`${route(p)} und ${canons.get(c)} tragen dasselbe Canonical (${c}). Eine Unterseite, die auf die Startseite kanonisiert, verschwindet aus dem Index.`)
  else canons.set(c, route(p))
  if (/<meta name="robots" content="noindex/.test(html)) hinweise.push(`${route(p)} trägt noindex und zugleich ein Canonical – überflüssig.`)
}

// ---------- Favicon ----------
for (const [datei, warum] of [
  ['favicon.svg', 'Basis-Symbol'],
  ['favicon-96.png', 'Google übernimmt ein Favicon in die Suchergebnisse nur bei einer Kantenlänge, die ein Vielfaches von 48 ist'],
  ['favicon.ico', 'Browser fragen /favicon.ico unaufgefordert ab; ohne die Datei erzeugt jeder Aufruf einen 404'],
]) {
  if (!fs.existsSync(path.join(DIST, datei))) hinweise.push(`${datei} fehlt (${warum}).`)
}

// ---------- Messung und Integrationen ----------
const env = process.env
if (!env.VITE_SITE_URL) hinweise.push('VITE_SITE_URL nicht gesetzt: ohne sie entstehen weder robots.txt noch sitemap.xml und es gibt kein Canonical.')
if (!env.VITE_GA_ID && !env.VITE_CF_BEACON) hinweise.push('Keine Reichweitenmessung konfiguriert. In Ordnung – die Datenschutzerklärung sagt dann ausdrücklich, dass nicht gemessen wird.')
if (env.VITE_GA_ID && !/^G-[A-Z0-9]+$/.test(env.VITE_GA_ID)) hinweise.push(`VITE_GA_ID sieht nicht wie eine GA4-Messkennung aus (erwartet G-XXXXXXX, gefunden ${env.VITE_GA_ID}).`)
if (!env.VITE_GSC_VERIFICATION) hinweise.push('VITE_GSC_VERIFICATION nicht gesetzt: die Search Console kann die Seite dann nur über eine andere Methode bestätigen.')

// Datenschutztext und tatsächliche Einbindung müssen zusammenpassen
const ds = fs.existsSync(path.join(DIST, 'datenschutz.html')) ? lies(path.join(DIST, 'datenschutz.html')) : ''
const gaImBuild = seiten.some((p) => /googletagmanager/.test(lies(p)))
const gaImText = /Google Analytics/.test(ds)
if (gaImBuild !== gaImText) blocker.push(`Datenschutzerklärung und Einbindung passen nicht zusammen: Google Analytics ${gaImBuild ? 'ist eingebunden, steht aber nicht im Text' : 'steht im Text, ist aber nicht eingebunden'}.`)
if (!L.companyName && /Petleo|GmbH|UG /.test(ds + lies(path.join(DIST, 'impressum.html')))) {
  hinweise.push('Ein Geschäftsname taucht im Text auf, ist aber nicht als companyName gepflegt. Nach § 5 DDG gehört zur Firma die Rechtsform.')
}

const zeige = (titel, liste) => { if (!liste.length) return; console.log(`\n${titel} (${liste.length})`); for (const t of liste) console.log(`  - ${t}`) }
zeige('BLOCKER', blocker)
zeige('Hinweise', hinweise)
console.log(blocker.length ? `\n${blocker.length} Blocker. Nicht bereit für den öffentlichen Betrieb.` : '\nKeine Blocker.')
process.exit(blocker.length ? 1 : 0)
