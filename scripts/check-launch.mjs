/*
 * Livegang-Prüfung. Meldet getrennt nach Blockern (vor dem Deploy zwingend) und Hinweisen.
 * Aufruf: npm run check:launch
 */
import fs from 'node:fs'

const lies = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '')
const site = lies('src/content/site.ts')
const feld = (name) => (site.match(new RegExp(name + ":\\s*'([^']*)'")) ?? [])[1] ?? ''

const blocker = []
const hinweise = []

if (!feld('street')) blocker.push('Impressum: Straße und Hausnummer fehlen (§ 5 DDG verlangt eine ladungsfähige Anschrift; ein unvollständiges Impressum ist abmahnfähig).')
if (!feld('zip')) blocker.push('Impressum: PLZ fehlt.')
if (!feld('email')) blocker.push('Impressum: Kontakt-E-Mail fehlt.')
if (!fs.existsSync('LICENSE')) blocker.push('LICENSE fehlt, das Projekt verspricht aber MIT.')

const env = process.env
if (!env.VITE_SITE_URL) hinweise.push('VITE_SITE_URL nicht gesetzt: ohne sie entstehen weder robots.txt noch sitemap.xml und es gibt keine kanonische URL.')
if (!env.VITE_GA_ID && !env.VITE_CF_BEACON) hinweise.push('Keine Reichweitenmessung konfiguriert. Das ist in Ordnung – die Datenschutzerklärung sagt dann ausdrücklich, dass nicht gemessen wird.')
if (env.VITE_GA_ID && !/^G-[A-Z0-9]+$/.test(env.VITE_GA_ID)) hinweise.push(`VITE_GA_ID sieht nicht wie eine GA4-Messkennung aus (erwartet G-XXXXXXX, gefunden ${env.VITE_GA_ID}).`)
if (!env.VITE_GSC_VERIFICATION) hinweise.push('VITE_GSC_VERIFICATION nicht gesetzt: die Search Console kann die Seite dann nur über eine andere Methode bestätigen.')
if (!feld('vatId')) hinweise.push('Keine USt-IdNr. hinterlegt. Nur nötig, wenn eine vorhanden ist.')
if (!feld('phone')) hinweise.push('Keine Telefonnummer im Impressum. Zulässig, solange die E-Mail-Adresse eine schnelle Kontaktaufnahme erlaubt.')

const zeige = (titel, liste) => {
  if (!liste.length) return
  console.log(`\n${titel}`)
  for (const t of liste) console.log(`  - ${t}`)
}
zeige(`BLOCKER (${blocker.length})`, blocker)
zeige(`Hinweise (${hinweise.length})`, hinweise)
console.log(blocker.length ? '\nNicht bereit für den öffentlichen Betrieb.' : '\nKeine Blocker.')
process.exit(blocker.length ? 1 : 0)
