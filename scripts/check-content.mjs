/*
 * Inhaltsprüfung: findet dünne, doppelte und unverlinkte Inhalte.
 * Aufruf: npm run check:content
 *
 * Geprüft werden die Redaktionsplan-Einträge, die Beispiel-Datensätze und die Artikelseiten.
 * Es geht nicht um Wortzahl um ihrer selbst willen, sondern um drei konkrete Mängel:
 * zu wenig Substanz (Kennzahlen, Datenkunde), Waisen ohne eingehende Verlinkung, und
 * ungeprüfte Textbausteine (Platzhalter, Dubletten).
 */
import fs from 'node:fs'

const lies = (f) => fs.readFileSync(f, 'utf8')
const befunde = []
const melde = (schwere, bereich, text) => befunde.push({ schwere, bereich, text })

// ---------- Redaktionsplan ----------
const rm = lies('src/content/roadmap.ts')
const bloecke = rm.split('  {\n    nr: ').slice(1)
const posts = bloecke.map((b) => {
  const g = (re) => (b.match(re) ?? [])[1]
  const figs = g(/figures: \[(.*?)\],\n/s)
  return {
    nr: Number(b.split(',')[0]),
    title: g(/title: '(.*?)',\n/),
    hook: g(/hook: '(.*?)',\n/s) ?? '',
    figures: figs ? (figs.match(/'[^']*'/g) ?? []).length : 0,
    refs: (g(/refs: \[(.*?)\]/) ?? '').split(',').map((x) => Number(x.trim())).filter(Boolean),
    dataStatus: g(/dataStatus: '(.*?)'/),
    dataNote: g(/dataNote: '(.*?)',\n/s),
    sampleId: g(/sampleId: '(.*?)'/),
  }
})
const eingehend = new Map(posts.map((p) => [p.nr, 0]))
for (const p of posts) for (const r of p.refs) eingehend.set(r, (eingehend.get(r) ?? 0) + 1)

for (const p of posts) {
  if (p.figures < 3) melde('mangel', `Post ${p.nr}`, `nur ${p.figures} Kennzahlen – zu dünn für einen eigenen Beitrag`)
  if (p.hook.length < 60) melde('mangel', `Post ${p.nr}`, `Aufhänger mit ${p.hook.length} Zeichen zu knapp`)
  if (p.dataStatus !== 'belegt' && !p.dataNote) melde('mangel', `Post ${p.nr}`, `Datenlage „${p.dataStatus}“, aber keine Notiz, was fehlt`)
  if (p.refs.length === 0 && eingehend.get(p.nr) === 0 && p.nr !== 1) melde('hinweis', `Post ${p.nr}`, 'weder Verweis auf noch von anderen Posts – hängt in der Reihe frei')
  if (eingehend.get(p.nr) === 0 && p.nr < 29) melde('hinweis', `Post ${p.nr}`, 'kein anderer Post verweist hierher')
  if (!p.sampleId && p.dataStatus === 'belegt' && !p.dataNote) melde('hinweis', `Post ${p.nr}`, 'als belegt markiert, aber weder Datensatz noch Notiz')
}
// Dubletten in den Aufhängern
for (let i = 0; i < posts.length; i++) {
  for (let j = i + 1; j < posts.length; j++) {
    const a = posts[i].hook.slice(0, 60), b = posts[j].hook.slice(0, 60)
    if (a && a === b) melde('mangel', `Post ${posts[i].nr}/${posts[j].nr}`, 'gleicher Aufhänger')
  }
}

// ---------- Datensätze ----------
const sm = lies('src/samples/index.ts')
for (const b of sm.split('    id: ').slice(1)) {
  const id = (b.match(/^'(.*?)'/) ?? [])[1]
  const desc = (b.match(/description: "(.*?)",\n/s) ?? [])[1] ?? ''
  const info = (b.match(/dataInfo: \[(.*?)\n    \],/s) ?? [])[1] ?? ''
  const absaetze = (info.match(/^\s*"/gm) ?? []).length
  const src = /source: '/.test(b), url = /sourceUrl: '/.test(b)
  if (desc.length < 40) melde('mangel', `Datensatz ${id}`, `Kachel-Text mit ${desc.length} Zeichen zu kurz`)
  if (desc.length > 170) melde('hinweis', `Datensatz ${id}`, `Kachel-Text mit ${desc.length} Zeichen zu lang – gehört in die Dateninfo`)
  if (absaetze < 3) melde('mangel', `Datensatz ${id}`, `nur ${absaetze} Absätze Datenkunde`)
  if (!src) melde('mangel', `Datensatz ${id}`, 'keine Quellenangabe')
  if (!url) melde('hinweis', `Datensatz ${id}`, 'keine Quellen-URL')
}

// ---------- Artikel ----------
for (const f of fs.existsSync('artikel') ? fs.readdirSync('artikel').filter((x) => x.endsWith('.html')) : []) {
  const h = lies(`artikel/${f}`)
  const text = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')
  const woerter = text.split(/\s+/).filter(Boolean).length
  const intern = (h.match(/href="\.\.?\//g) ?? []).length
  if (woerter < 600) melde('mangel', `Artikel ${f}`, `nur ${woerter} Wörter – zu dünn, um in Suchergebnissen zu bestehen`)
  if (!/<meta name="description"/.test(h)) melde('mangel', `Artikel ${f}`, 'keine Meta-Description')
  if (!/application\/ld\+json/.test(h)) melde('hinweis', `Artikel ${f}`, 'keine strukturierten Daten')
  if (intern < 3) melde('hinweis', `Artikel ${f}`, `nur ${intern} interne Links`)
}

// ---------- Artikelentwürfe zur Post-Reihe ----------
// Nicht die gebauten Seiten, sondern die Quellen: Die meisten Entwürfe sind noch nicht online,
// sollen aber schon jetzt die Regeln aus src/content/artikel/README.md einhalten.
const AD = 'src/content/artikel'
const entwuerfe = fs.existsSync(AD) ? fs.readdirSync(AD).filter((x) => /^\d{2,}-.*\.md$/.test(x)) : []
const mitArtikel = new Set()
for (const f of entwuerfe) {
  const roh = lies(`${AD}/${f}`)
  const kopf = Object.fromEntries([...(roh.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '').matchAll(/^(\w+):\s*(.*)$/gm)].map((m) => [m[1], m[2].trim()]))
  const text = roh.replace(/^---[\s\S]*?\n---\n/, '')
  const nr = Number(kopf.post)
  mitArtikel.add(nr)
  const wo = `Artikel ${f}`
  if (!f.startsWith(String(nr).padStart(2, '0') + '-')) melde('mangel', wo, `Dateiname passt nicht zu post: ${kopf.post}`)
  if ((kopf.beschreibung ?? '').length > 160) melde('mangel', wo, `Beschreibung mit ${kopf.beschreibung.length} Zeichen über 160 – Google schneidet ab`)
  if ((kopf.titel ?? '').length > 70) melde('hinweis', wo, `Titel mit ${kopf.titel.length} Zeichen über 70`)
  const erster = text.trim().split(/\n{2,}/)[0] ?? ''
  if (!/\d/.test(erster)) melde('mangel', wo, 'erster Absatz ohne Zahl – er soll die Frage beantworten')
  for (const pflicht of ['## Das Wichtigste in Kürze', '## Was die Zahl nicht sagt', '## Quelle und Methode']) {
    if (!text.includes(pflicht)) melde('mangel', wo, `Abschnitt „${pflicht.slice(3)}“ fehlt`)
  }
  const woerter = text.replace(/[|#*>-]/g, ' ').split(/\s+/).filter(Boolean).length
  if (woerter < 400) melde('mangel', wo, `nur ${woerter} Wörter`)
  if (kopf.bereit === 'ja' && /\*\*Offen:\*\*/.test(text)) melde('mangel', wo, 'als bereit markiert, enthält aber noch „Offen:“')
  if (/\b(TODO|TBD|FIXME|Lorem ipsum)\b/.test(text)) melde('mangel', wo, 'Platzhalter im Text')
}
for (const p of posts) {
  if (!mitArtikel.has(p.nr)) melde('hinweis', `Post ${p.nr}`, 'noch kein Artikelentwurf')
}

// ---------- Platzhalter ----------
for (const f of ['src/content/roadmap.ts', 'src/samples/index.ts', 'src/content/site.ts']) {
  for (const [i, z] of lies(f).split('\n').entries()) {
    if (/\b(TODO|TBD|FIXME|Lorem ipsum|Platzhalter)\b/.test(z)) melde('hinweis', `${f}:${i + 1}`, 'Platzhalter im Text')
  }
}

const zeige = (titel, art) => {
  const l = befunde.filter((b) => b.schwere === art)
  console.log(`\n${titel} (${l.length})`)
  for (const b of l) console.log(`  - ${b.bereich}: ${b.text}`)
}
zeige('MÄNGEL', 'mangel')
zeige('Hinweise', 'hinweis')
const m = befunde.filter((b) => b.schwere === 'mangel').length
console.log(m ? `\n${m} Mängel zu beheben.` : '\nKeine Mängel.')
process.exit(m ? 1 : 0)
