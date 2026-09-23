/*
 * Baut aus den Entwürfen in src/content/artikel/*.md die Artikelseiten zur Post-Reihe.
 *
 *   node scripts/build-artikel.mjs              Live-Seiten nach beitrag/ (läuft im Build)
 *   node scripts/build-artikel.mjs --entwuerfe  zusätzlich ALLE Entwürfe nach beitrag/entwurf/,
 *                                               mit noindex, zum Gegenlesen unter `npm run dev`
 *
 * Eine Seite geht nur online, wenn alle drei Bedingungen erfüllt sind:
 *   1. freigabe.json: artikelLive ist true
 *   2. der zugehörige Post steht im Redaktionsplan auf „veroeffentlicht“
 *   3. der Entwurf trägt `bereit: ja`
 * Fehlt eine davon, entsteht keine Datei – nicht versteckt, sondern gar nicht gebaut.
 *
 * Beide Ausgabeordner sind erzeugt und stehen in .gitignore. Die Übersicht
 * src/content/artikel-index.json wird dagegen eingecheckt, weil Oberfläche und Vite-Konfiguration
 * sie importieren.
 *
 * Format der Entwürfe: siehe src/content/artikel/README.md.
 */
import fs from 'node:fs'
import path from 'node:path'
import { POSTS, visiteVon } from '../src/content/roadmap.ts'

const QUELLE = 'src/content/artikel'
const ZIEL = 'beitrag'
const ENTWURF = path.join(ZIEL, 'entwurf')
const mitEntwuerfen = process.argv.includes('--entwuerfe')

const FREIGABE = JSON.parse(fs.readFileSync('src/content/freigabe.json', 'utf8'))
const L = JSON.parse(fs.readFileSync('src/content/legal.json', 'utf8'))

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const datumDe = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

// ---------- Entwürfe lesen ----------
function lesen(datei) {
  const roh = fs.readFileSync(path.join(QUELLE, datei), 'utf8')
  const m = roh.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error(`${datei}: Kopfbereich zwischen --- fehlt`)
  const kopf = {}
  for (const zeile of m[1].split('\n')) {
    const k = zeile.match(/^(\w+):\s*(.*)$/)
    if (k) kopf[k[1]] = k[2].trim()
  }
  for (const pflicht of ['post', 'slug', 'titel', 'beschreibung', 'frage', 'stand', 'bereit']) {
    if (!kopf[pflicht]) throw new Error(`${datei}: Feld „${pflicht}“ fehlt`)
  }
  if (!/^[a-z0-9-]+$/.test(kopf.slug)) throw new Error(`${datei}: slug nur aus a–z, 0–9 und Bindestrich`)
  return { datei, ...kopf, post: Number(kopf.post), bereit: kopf.bereit === 'ja', text: m[2].trim() }
}

// ---------- Kleines Markdown ----------
// Bewusst minimal und ohne Abhängigkeit: Absätze, ## und ###, Listen, Tabellen, Zitate,
// **fett**, *kursiv* und [Links](url). Mehr brauchen diese Artikel nicht, und jedes weitere
// Konstrukt wäre eine Stelle, an der ein Entwurf anders aussieht als gedacht.
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const extern = /^https?:/.test(u)
      return `<a href="${u}"${extern ? ' rel="noopener"' : ''}>${t}</a>`
    })
}

function markdown(text) {
  const bloecke = text.split(/\n{2,}/)
  const html = []
  const faq = []
  let inFaq = false
  for (let i = 0; i < bloecke.length; i++) {
    const b = bloecke[i].trim()
    if (!b) continue
    const zeilen = b.split('\n')
    if (b.startsWith('## ')) {
      const t = b.slice(3).trim()
      inFaq = /^häufige fragen/i.test(t)
      html.push(`<h2>${inline(t)}</h2>`)
    } else if (b.startsWith('### ')) {
      const t = b.slice(4).trim()
      html.push(`<h3>${inline(t)}</h3>`)
      // Die Antwort ist der nächste Block. Sie geht als FAQPage in die strukturierten Daten.
      if (inFaq && bloecke[i + 1]) faq.push({ frage: t, antwort: bloecke[i + 1].trim().replace(/\*\*|\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') })
    } else if (zeilen.every((z) => z.startsWith('> '))) {
      html.push(`<blockquote>${inline(zeilen.map((z) => z.slice(2)).join(' '))}</blockquote>`)
    } else if (zeilen.every((z) => /^- /.test(z))) {
      html.push(`<ul>\n${zeilen.map((z) => `  <li>${inline(z.slice(2))}</li>`).join('\n')}\n</ul>`)
    } else if (zeilen.every((z) => /^\d+\. /.test(z))) {
      html.push(`<ol>\n${zeilen.map((z) => `  <li>${inline(z.replace(/^\d+\. /, ''))}</li>`).join('\n')}\n</ol>`)
    } else if (zeilen.length >= 2 && zeilen.every((z) => z.startsWith('|')) && /^\|[\s:|-]+\|$/.test(zeilen[1])) {
      const zellen = (z) => z.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      const rechts = zellen(zeilen[1]).map((c) => c.endsWith(':'))
      const td = (c, k, tag) => `<${tag}${rechts[k] ? ' class="num"' : ''}>${inline(c)}</${tag}>`
      html.push(`<div class="scroll"><table>\n<thead><tr>${zellen(zeilen[0]).map((c, k) => td(c, k, 'th')).join('')}</tr></thead>\n<tbody>\n` +
        zeilen.slice(2).map((z) => `<tr>${zellen(z).map((c, k) => td(c, k, 'td')).join('')}</tr>`).join('\n') + `\n</tbody></table></div>`)
    } else {
      html.push(`<p>${inline(zeilen.join(' '))}</p>`)
    }
  }
  return { html: html.join('\n\n'), faq }
}

// ---------- Seite ----------
function seite(a, { entwurf, alle }) {
  const post = POSTS.find((p) => p.nr === a.post)
  if (!post) throw new Error(`${a.datei}: Post ${a.post} steht nicht im Redaktionsplan`)
  const tiefe = entwurf ? '../../' : '../'
  const { html, faq } = markdown(a.text)
  // Der erste Absatz ist die Antwort. Er steht als Lead direkt unter der Überschrift –
  // Antwortmaschinen und Vorschauen zitieren am ehesten den ersten Absatz.
  const [ersterBlock, ...restBloecke] = html.split('\n\n')
  if (!ersterBlock.startsWith('<p>')) throw new Error(`${a.datei}: Der Text muss mit einem Absatz beginnen, der die Frage beantwortet`)
  const lead = ersterBlock.replace(/^<p>/, '<p class="lead">')
  // Relative Links im Text sind für beitrag/ geschrieben; die Vorschau liegt eine Ebene tiefer.
  const rumpf = restBloecke.join('\n\n').replace(/href="\.\.\//g, `href="${tiefe}`)

  // Verweise auf andere Posts: auf deren Artikel, wenn es ihn gibt, sonst auf den Redaktionsplan.
  const verweise = (post.refs ?? []).map((r) => {
    const ziel = alle.find((x) => x.post === r && (entwurf || x.live))
    const titel = POSTS.find((p) => p.nr === r)?.title ?? `Post ${r}`
    return ziel ? `<a href="${ziel.slug}.html">${esc(titel)}</a>` : `<a href="${tiefe}#redaktionsplan">${esc(titel)}</a>`
  })

  const basis = (process.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Article',
    headline: a.titel, description: a.beschreibung, inLanguage: 'de-DE',
    author: { '@type': 'Person', name: L.operator },
    ...(post.publishedOn ? { datePublished: post.publishedOn } : {}),
    dateModified: a.stand,
    ...(basis ? { mainEntityOfPage: `${basis}/${ZIEL}/${a.slug}.html` } : {}),
  }]
  if (faq.length) {
    jsonld.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.frage, acceptedAnswer: { '@type': 'Answer', text: f.antwort } })),
    })
  }

  const bild = fs.existsSync(path.join('public', ZIEL, `${a.slug}.png`))
    ? `<figure><img src="${tiefe}${ZIEL}/${a.slug}.png" alt="${esc(post.title)}" loading="lazy" /></figure>` : ''

  return `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(a.titel)}</title>
    <meta name="description" content="${esc(a.beschreibung)}" />
${entwurf ? '    <meta name="robots" content="noindex, nofollow" />\n' : ''}    <link rel="icon" href="${tiefe}favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="${tiefe}favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="${tiefe}favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="${tiefe}apple-touch-icon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(post.title)}" />
    <meta property="og:description" content="${esc(a.beschreibung)}" />
    <meta property="og:locale" content="de_DE" />
    <script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : jsonld)}</script>
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
${entwurf ? `    <p class="entwurf">Entwurf · ${a.bereit ? 'bereit zur Freigabe' : 'noch nicht bereit'} · nicht öffentlich</p>\n` : ''}    <header class="site">
      <div class="wrap">
        <strong>${esc(L.siteName)}</strong>
        <a href="${tiefe}">Studio</a>
        <a href="${tiefe}#redaktionsplan">Redaktionsplan</a>
        <a href="${tiefe}artikel/datenherkunft.html">Datenherkunft</a>
        <a href="${tiefe}impressum.html">Impressum</a>
      </div>
    </header>

    <main class="wrap">
      <article>
        <p class="meta">Visite ${visiteVon(post.nr)} · Post ${post.nr}</p>
        <h1>${esc(post.title)}</h1>
        ${lead}
        <p class="meta">Stand ${datumDe(a.stand)} · von ${esc(L.operator)}${post.publishedOn ? ` · auf LinkedIn seit ${datumDe(post.publishedOn)}` : ''}</p>
        ${bild}
${rumpf.split('\n').map((z) => '        ' + z).join('\n')}
        <aside class="kasten">
${post.sampleId ? `          <p><a href="${tiefe}?beispiel=${post.sampleId}">Datensatz im Studio öffnen und selbst animieren</a></p>\n` : ''}${post.linkedInUrl ? `          <p><a href="${post.linkedInUrl}" rel="noopener">Zum Beitrag auf LinkedIn</a></p>\n` : ''}${verweise.length ? `          <p>Baut auf: ${verweise.join(' · ')}</p>\n` : ''}          <p><a href="${tiefe}artikel/datenherkunft.html">Woher die Zahlen kommen</a></p>
        </aside>
      </article>
    </main>
  </body>
</html>
`
}

// ---------- Lauf ----------
const dateien = fs.existsSync(QUELLE) ? fs.readdirSync(QUELLE).filter((f) => f.endsWith('.md') && f !== 'README.md').sort() : []
const artikel = dateien.map(lesen)

const doppelt = (feld) => artikel.map((a) => a[feld]).filter((v, i, xs) => xs.indexOf(v) !== i)
if (doppelt('slug').length) throw new Error(`Doppelter slug: ${doppelt('slug').join(', ')}`)
if (doppelt('post').length) throw new Error(`Zwei Entwürfe für Post ${doppelt('post').join(', ')}`)

for (const a of artikel) {
  const post = POSTS.find((p) => p.nr === a.post)
  a.live = Boolean(FREIGABE.artikelLive && post?.status === 'veroeffentlicht' && a.bereit)
}

fs.rmSync(ZIEL, { recursive: true, force: true })
const live = artikel.filter((a) => a.live)
if (live.length || mitEntwuerfen) fs.mkdirSync(ZIEL, { recursive: true })
for (const a of live) fs.writeFileSync(path.join(ZIEL, `${a.slug}.html`), seite(a, { entwurf: false, alle: artikel }))
if (mitEntwuerfen) {
  fs.mkdirSync(ENTWURF, { recursive: true })
  for (const a of artikel) fs.writeFileSync(path.join(ENTWURF, `${a.slug}.html`), seite(a, { entwurf: true, alle: artikel }))
  fs.writeFileSync(path.join(ENTWURF, 'index.html'), `<!doctype html><html lang="de"><head><meta charset="UTF-8" /><meta name="robots" content="noindex, nofollow" /><title>Entwürfe</title><script type="module" src="/src/article.ts"></script></head><body><main class="wrap"><h1>Artikelentwürfe</h1><ol>\n${
    artikel.map((a) => `<li><a href="${a.slug}.html">Post ${a.post}: ${esc(POSTS.find((p) => p.nr === a.post)?.title ?? a.slug)}</a>${a.bereit ? '' : ' (noch nicht bereit)'}</li>`).join('\n')}\n</ol></main></body></html>\n`)
}

// Übersicht für Oberfläche, Sitemap und llms.txt. Deterministisch sortiert, damit sie nur bei
// echten Änderungen im Diff auftaucht.
const index = artikel.map((a) => ({ post: a.post, slug: a.slug, titel: a.titel, beschreibung: a.beschreibung, frage: a.frage, bereit: a.bereit, live: a.live }))
fs.writeFileSync('src/content/artikel-index.json', JSON.stringify(index, null, 2) + '\n')

console.log(`Artikel: ${artikel.length} Entwürfe, ${artikel.filter((a) => a.bereit).length} bereit, ${live.length} online${FREIGABE.artikelLive ? '' : ' (Freigabe aus)'}${mitEntwuerfen ? `, Vorschau unter /${ENTWURF}/` : ''}`)
