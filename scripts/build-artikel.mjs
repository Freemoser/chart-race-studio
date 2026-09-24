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
import { ARCS, POSTS, visiteVon } from '../src/content/roadmap.ts'
import * as DATEN from '../src/samples/data.ts'

const QUELLE = 'src/content/artikel'
const ZIEL = 'beitrag'
const ENTWURF = path.join(ZIEL, 'entwurf')
const mitEntwuerfen = process.argv.includes('--entwuerfe')

const FREIGABE = JSON.parse(fs.readFileSync('src/content/freigabe.json', 'utf8'))
const L = JSON.parse(fs.readFileSync('src/content/legal.json', 'utf8'))
const BASIS = (process.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
const DATEN_ZIEL = 'public/daten'

// Metadaten der Beispiel-Datensätze. src/samples/index.ts ist über den Pfad-Alias @/ nicht direkt
// aus Node importierbar; die wenigen Felder, die hier gebraucht werden, stehen dort je Datensatz
// in einer eigenen Zeile und lassen sich verlässlich auslesen.
const DATENSAETZE = Object.fromEntries(fs.readFileSync('src/samples/index.ts', 'utf8').split('    id: ').slice(1).map((b) => {
  const g = (re) => (b.match(re) ?? [])[1]
  const id = g(/^'(.*?)'/)
  const quelle = DATEN[g(/headers: (\w+)\.headers/)]
  return [id, { id, titel: g(/title: '(.*?)',\n/), untertitel: g(/subtitle: '(.*?)',\n/), quelle: g(/source: '(.*?)',\n/), quelleUrl: g(/sourceUrl: '(.*?)'/), einheit: g(/unit: '(.*?)'/), daten: quelle }]
}))

// Ein Post gilt ab „naechster“ als freigabefähig: Der Artikel muss online sein, wenn der
// LinkedIn-Beitrag erscheint, sonst läuft der Link im ersten Kommentar ins Leere.
const FREIGABEFAEHIG = new Set(['veroeffentlicht', 'naechster'])

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
  // Anleitungen gehören zu keinem Post: Sie erklären das Werkzeug und sind jederzeit gültig.
  const anleitung = kopf.art === 'anleitung'
  for (const pflicht of [...(anleitung ? [] : ['post']), 'slug', 'titel', 'beschreibung', 'frage', 'stand', 'bereit']) {
    if (!kopf[pflicht]) throw new Error(`${datei}: Feld „${pflicht}“ fehlt`)
  }
  if (!/^[a-z0-9-]+$/.test(kopf.slug)) throw new Error(`${datei}: slug nur aus a–z, 0–9 und Bindestrich`)
  return { datei, ...kopf, anleitung, post: anleitung ? undefined : Number(kopf.post), bereit: kopf.bereit === 'ja', text: m[2].trim() }
}

// ---------- Kleines Markdown ----------
// Bewusst minimal und ohne Abhängigkeit: Absätze, ## und ###, Listen, Tabellen, Zitate,
// **fett**, *kursiv* und [Links](url). Mehr brauchen diese Artikel nicht, und jedes weitere
// Konstrukt wäre eine Stelle, an der ein Entwurf anders aussieht als gedacht.
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
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
    const bild = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
    if (bild) {
      // Bilder liegen unter public/beitrag/…; Breite und Höhe aus dem PNG-Kopf, damit die Seite
      // beim Laden nicht springt.
      const [, alt, src] = bild
      let masse = ''
      try {
        const kopfBytes = fs.readFileSync(path.join('public', ZIEL, src)).subarray(16, 24)
        masse = ` width="${kopfBytes.readUInt32BE(0) / 2}" height="${kopfBytes.readUInt32BE(4) / 2}"`
      } catch { throw new Error(`Bild ${src} fehlt unter public/${ZIEL}/`) }
      html.push(`<figure><img src="${src}" alt="${esc(alt)}"${masse} loading="lazy" /><figcaption>${inline(alt)}</figcaption></figure>`)
      continue
    }
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
  const post = a.anleitung ? { nr: 0, title: a.titel, refs: [] } : POSTS.find((p) => p.nr === a.post)
  if (!post) throw new Error(`${a.datei}: Post ${a.post} steht nicht im Redaktionsplan`)
  const tiefe = entwurf ? '../../' : '../'
  const { html, faq } = markdown(a.text)
  // Der erste Absatz ist die Antwort. Er steht als Lead direkt unter der Überschrift –
  // Antwortmaschinen und Vorschauen zitieren am ehesten den ersten Absatz.
  const [ersterBlock, ...restBloecke] = html.split('\n\n')
  if (!ersterBlock.startsWith('<p>')) throw new Error(`${a.datei}: Der Text muss mit einem Absatz beginnen, der die Frage beantwortet`)
  const lead = ersterBlock.replace(/^<p>/, '<p class="lead">').replace(/<a href="([a-z0-9-]+)\.html">(.*?)<\/a>/g, (m, slug, text) =>
    entwurf || alle.some((x) => x.slug === slug && x.live) ? m : text)
  // Relative Links im Text sind für beitrag/ geschrieben; die Vorschau liegt eine Ebene tiefer.
  // Links auf Artikel, die noch nicht online sind, werden im Live-Build zu reinem Text – sonst
  // führen sie ins Leere. Sobald der Zielartikel freigegeben ist, erscheint der Link von selbst.
  const entlinken = (h) => entwurf ? h : h.replace(/<a href="([a-z0-9-]+)\.html">(.*?)<\/a>/g, (m, slug, text) =>
    alle.some((x) => x.slug === slug && x.live) ? m : text)
  const rumpf = entlinken(restBloecke.join('\n\n').replace(/href="\.\.\//g, `href="${tiefe}`))
    .replace(/<img src="(?!https?:|\.\.\/)/g, entwurf ? '<img src="../' : '<img src="')
    .replace(/href="(vorlagen\/)/g, `href="${tiefe}$1`)

  // Verweise auf andere Posts: auf deren Artikel, wenn es ihn gibt, sonst auf den Redaktionsplan.
  const verweise = (post.refs ?? []).map((r) => {
    const ziel = alle.find((x) => x.post === r && (entwurf || x.live))
    const titel = POSTS.find((p) => p.nr === r)?.title ?? `Post ${r}`
    return ziel ? `<a href="${ziel.slug}.html">${esc(titel)}</a>` : `<a href="${tiefe}#redaktionsplan">${esc(titel)}</a>`
  })

  const basis = BASIS
  const ogBild = fs.existsSync(path.join('public', ZIEL, 'og', `${a.slug}.png`)) && basis ? `${basis}/${ZIEL}/og/${a.slug}.png` : ''
  const ds = post.sampleId ? DATENSAETZE[post.sampleId] : undefined
  const csv = ds?.daten && !entwurf ? `${tiefe}daten/${ds.id}.csv` : ''
  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'Article',
    headline: a.titel, description: a.beschreibung, inLanguage: 'de-DE',
    author: { '@type': 'Person', name: L.operator },
    ...(a.veroeffentlicht ? { datePublished: a.veroeffentlicht } : {}),
    dateModified: a.stand,
    ...(ogBild ? { image: ogBild } : {}),
    ...(basis ? { mainEntityOfPage: `${basis}/${ZIEL}/${a.slug}.html` } : {}),
    about: a.frage,
  }]
  // Der Datensatz als eigenes Objekt: macht ihn für die Google-Datensatzsuche auffindbar und
  // gibt Antwortmaschinen eine zitierfähige Quelle mit Zeitraum und Herkunft.
  if (ds?.daten) {
    const jahre = ds.daten.rows.map((r) => String(r[0])).filter((j) => /^\d{4}$/.test(j))
    jsonld.push({
      '@context': 'https://schema.org', '@type': 'Dataset',
      name: ds.titel, description: `${ds.untertitel ?? ds.titel}. ${a.beschreibung}`,
      creator: { '@type': 'Person', name: L.operator },
      ...(jahre.length ? { temporalCoverage: `${jahre[0]}/${jahre.at(-1)}` } : {}),
      spatialCoverage: post.sampleId === 'hund-katze-welt' ? 'Welt' : 'Deutschland',
      variableMeasured: ds.daten.headers.slice(1),
      ...(ds.quelleUrl ? { isBasedOn: ds.quelleUrl } : {}),
      ...(ds.quelle ? { citation: ds.quelle } : {}),
      dateModified: a.stand,
      ...(basis ? { url: `${basis}/${ZIEL}/${a.slug}.html`, distribution: { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${basis}/daten/${ds.id}.csv` } } : {}),
    })
  }
  // Anleitung: die Schritte als HowTo, aus den ###-Überschriften unter „Schritt für Schritt“.
  if (a.anleitung) {
    const teil = a.text.split(/\n## /).find((t) => /^Schritt für Schritt/.test(t)) ?? ''
    const schritte = [...teil.matchAll(/^### (.+)$/gm)].map((m) => m[1].replace(/^\d+\.\s*/, ''))
    if (schritte.length) jsonld.push({
      '@context': 'https://schema.org', '@type': 'HowTo', name: a.titel, description: a.beschreibung, inLanguage: 'de-DE',
      tool: { '@type': 'HowToTool', name: `Studio von ${L.siteName}` },
      step: schritte.map((name, i) => ({ '@type': 'HowToStep', position: i + 1, name })),
    })
  }
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
    <title>${esc(a.titel.length + L.siteName.length + 3 <= 65 ? `${a.titel} | ${L.siteName}` : a.titel)}</title>
    <meta name="description" content="${esc(a.beschreibung)}" />
${entwurf ? '    <meta name="robots" content="noindex, nofollow" />\n' : ''}    <link rel="icon" href="${tiefe}favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="${tiefe}favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="${tiefe}favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="${tiefe}apple-touch-icon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(a.titel)}" />
    <meta property="og:description" content="${esc(a.beschreibung)}" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="${esc(L.siteName)}" />
${ogBild ? `    <meta property="og:image" content="${ogBild}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:card" content="summary_large_image" />\n` : ''}${a.veroeffentlicht ? `    <meta property="article:published_time" content="${a.veroeffentlicht}" />\n` : ''}    <meta property="article:modified_time" content="${a.stand}" />
    <script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : jsonld)}</script>
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
${entwurf ? `    <p class="entwurf">Entwurf · ${a.bereit ? 'bereit zur Freigabe' : 'noch nicht bereit'} · nicht öffentlich</p>\n` : ''}    <!--rahmen:kopf-->

    <main class="wrap">
      <article>
        <p class="meta">${a.anleitung ? 'Anleitung' : `Visite ${visiteVon(post.nr)} · Post ${post.nr}: ${esc(post.title)}`}</p>
        <h1>${esc(a.titel)}</h1>
        ${lead}
        <p class="meta">Stand ${datumDe(a.stand)} · von ${esc(L.operator)}${post.publishedOn ? ` · auf LinkedIn seit ${datumDe(post.publishedOn)}` : ''}</p>
        ${bild}
${rumpf.split('\n').map((z) => '        ' + z).join('\n')}
        <aside class="kasten">
${csv ? `          <p><a href="${csv}" download>Daten als CSV herunterladen</a> · ${esc(ds.titel)}</p>\n` : ''}${post.sampleId ? `          <p><a href="${tiefe}?beispiel=${post.sampleId}">Datensatz im Studio öffnen und selbst animieren</a></p>\n` : ''}${post.linkedInUrl ? `          <p><a href="${post.linkedInUrl}" rel="noopener">Zum Beitrag auf LinkedIn</a></p>\n` : ''}${verweise.length ? `          <p>Baut auf: ${verweise.join(' · ')}</p>\n` : ''}          <p><a href="${tiefe}artikel/datenherkunft.html">Woher die Zahlen kommen</a></p>
        </aside>
      </article>
    </main>
    <!--rahmen:fuss-->
  </body>
</html>
`
}

// ---------- Übersicht aller Live-Artikel ----------
// Die Drehscheibe für interne Links: Jeder Artikel ist von hier aus einen Klick entfernt, und
// Crawler ohne JavaScript finden die Reihe, ohne die Single-Page-Anwendung ausführen zu müssen.
function uebersicht(live) {
  const nachKapitel = [
    ...ARCS.map((arc) => ({ arc, liste: live.filter((a) => POSTS.find((p) => p.nr === a.post)?.arc === arc.id) })),
    { arc: { label: 'Anleitungen' }, liste: live.filter((a) => a.anleitung) },
  ].filter((k) => k.liste.length)
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Tiermedizin in Zahlen', inLanguage: 'de-DE',
    description: 'Zahlen zu Tierärzten, Tierarztpraxen und Haustieren in Deutschland – jede mit Jahr und Quelle.',
    author: { '@type': 'Person', name: L.operator },
    mainEntity: { '@type': 'ItemList', itemListElement: live.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.titel, ...(BASIS ? { url: `${BASIS}/${ZIEL}/${a.slug}.html` } : {}) })) },
  }
  return `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tiermedizin in Zahlen: Tierärzte, Praxen und Haustiere in Deutschland</title>
    <meta name="description" content="Wie viele Tierärzte, Tierarztpraxen und Haustiere gibt es in Deutschland? Zeitreihen seit 1991, jede Zahl mit Jahr und Quelle." />
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="../favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="../favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tiermedizin in Zahlen" />
    <meta property="og:description" content="Tierärzte, Tierarztpraxen und Haustiere in Deutschland – Zeitreihen mit Quelle." />
    <meta property="og:locale" content="de_DE" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <!--rahmen:kopf-->
    <main class="wrap">
      <h1>Tiermedizin in Zahlen</h1>
      <p class="lead">Wie viele Tierärzte, Tierarztpraxen und Haustiere gibt es in Deutschland, und wie hat sich das seit 1991 verändert? Jeder Artikel beantwortet eine Frage mit Zahl, Jahr und Quelle und nennt, was die Zahl nicht sagt.</p>
${nachKapitel.map((k) => `      <h2>${esc(k.arc.label)}</h2>
      <ul class="liste">
${k.liste.map((a) => `        <li><a href="${a.slug}.html">${esc(a.frage)}</a><br />${esc(a.beschreibung)}</li>`).join('\n')}
      </ul>`).join('\n')}
      <p class="meta">Dazu: <a href="../artikel/tierarztketten-deutschland.html">Wer betreibt die Tierarztpraxen in Deutschland?</a> · <a href="../artikel/datenherkunft.html">Woher die Zahlen kommen</a></p>
    </main>
    <!--rahmen:fuss-->
  </body>
</html>
`
}

// ---------- Lauf ----------
const dateien = fs.existsSync(QUELLE) ? fs.readdirSync(QUELLE).filter((f) => f.endsWith('.md') && f !== 'README.md').sort() : []
const artikel = dateien.map(lesen)

const doppelt = (feld) => artikel.map((a) => a[feld]).filter((v, i, xs) => v !== undefined && xs.indexOf(v) !== i)
if (doppelt('slug').length) throw new Error(`Doppelter slug: ${doppelt('slug').join(', ')}`)
if (doppelt('post').length) throw new Error(`Zwei Entwürfe für Post ${doppelt('post').join(', ')}`)

for (const a of artikel) {
  const post = POSTS.find((p) => p.nr === a.post)
  a.live = Boolean(FREIGABE.artikelLive && (a.anleitung || FREIGABEFAEHIG.has(post?.status) || post?.vorabOnline) && a.bereit)
  // Veröffentlichungsdatum des Artikels: das LinkedIn-Datum, sonst der Stand beim Freischalten.
  a.veroeffentlicht = post?.publishedOn ?? (a.live ? a.stand : undefined)
}

fs.rmSync(ZIEL, { recursive: true, force: true })
const live = artikel.filter((a) => a.live)
if (live.length || mitEntwuerfen) fs.mkdirSync(ZIEL, { recursive: true })
for (const a of live) fs.writeFileSync(path.join(ZIEL, `${a.slug}.html`), seite(a, { entwurf: false, alle: artikel }))
if (live.length) fs.writeFileSync(path.join(ZIEL, 'index.html'), uebersicht(live))

// CSV je Datensatz eines Live-Artikels. Nur freigegebene – dieselbe Regel wie für die Seiten.
fs.rmSync(DATEN_ZIEL, { recursive: true, force: true })
const csvIds = [...new Set(live.map((a) => POSTS.find((p) => p.nr === a.post)?.sampleId).filter((id) => id && DATENSAETZE[id]?.daten))]
if (csvIds.length) fs.mkdirSync(DATEN_ZIEL, { recursive: true })
const zelle = (v) => v == null ? '' : /[",;\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v)
for (const id of csvIds) {
  const { daten, quelle } = DATENSAETZE[id]
  // BOM und Semikolon nicht: Komma-CSV mit Punkt als Dezimaltrenner ist das, was Werkzeuge und
  // Antwortmaschinen zuverlässig lesen. Die Quelle steht in der letzten Zeile als Kommentar.
  const zeilen = [daten.headers, ...daten.rows].map((r) => r.map(zelle).join(','))
  fs.writeFileSync(path.join(DATEN_ZIEL, `${id}.csv`), zeilen.join('\n') + `\n# ${quelle ?? ''}\n`)
}
if (mitEntwuerfen) {
  fs.mkdirSync(ENTWURF, { recursive: true })
  for (const a of artikel) fs.writeFileSync(path.join(ENTWURF, `${a.slug}.html`), seite(a, { entwurf: true, alle: artikel }))
  fs.writeFileSync(path.join(ENTWURF, 'index.html'), `<!doctype html><html lang="de"><head><meta charset="UTF-8" /><meta name="robots" content="noindex, nofollow" /><title>Entwürfe</title><script type="module" src="/src/article.ts"></script></head><body><main class="wrap"><h1>Artikelentwürfe</h1><ol>\n${
    artikel.map((a) => `<li><a href="${a.slug}.html">${a.anleitung ? `Anleitung: ${esc(a.titel)}` : `Post ${a.post}: ${esc(POSTS.find((p) => p.nr === a.post)?.title ?? a.slug)}`}</a>${a.bereit ? '' : ' (noch nicht bereit)'}</li>`).join('\n')}\n</ol></main></body></html>\n`)
}

// Übersicht für Oberfläche, Sitemap und llms.txt. Deterministisch sortiert, damit sie nur bei
// echten Änderungen im Diff auftaucht.
const index = artikel.map((a) => ({ post: a.post, ...(a.anleitung ? { art: 'anleitung' } : {}), slug: a.slug, titel: a.titel, beschreibung: a.beschreibung, frage: a.frage, stand: a.stand, bereit: a.bereit, live: a.live }))
fs.writeFileSync('src/content/artikel-index.json', JSON.stringify(index, null, 2) + '\n')

console.log(`Artikel: ${artikel.length} Entwürfe, ${artikel.filter((a) => a.bereit).length} bereit, ${live.length} online${FREIGABE.artikelLive ? '' : ' (Freigabe aus)'}${mitEntwuerfen ? `, Vorschau unter /${ENTWURF}/` : ''}`)
