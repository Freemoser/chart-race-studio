/*
 * Erzeugt impressum.html und datenschutz.html als statische Seiten.
 * Aufruf: node scripts/build-legal.mjs   (läuft automatisch als Teil von npm run build)
 *
 * Warum statisch und nicht als Route in der Anwendung: Im Impressum steht eine
 * ladungsfähige, oft private Anschrift. Die gehört nicht in den Suchindex. In einer
 * Single-Page-Anwendung mit Hash-Routen ist das unmöglich – dort gibt es nur ein einziges
 * HTML-Dokument, und ein noindex darauf würde die ganze Seite aus dem Index nehmen.
 * Als eigene Datei bekommt jede Rechtsseite ihr eigenes `noindex, follow`.
 *
 * § 5 DDG verlangt leicht erkennbar, unmittelbar erreichbar und ständig verfügbar.
 * Der Link im Footer erfüllt das vollständig; Auffindbarkeit über Google ist nicht gefordert.
 */
import fs from 'node:fs'

const L = JSON.parse(fs.readFileSync('src/content/legal.json', 'utf8'))
const env = process.env
const ga = env.VITE_GA_ID || ''
const cf = env.VITE_CF_BEACON || ''
const hatAnschrift = Boolean(L.street && L.zip)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Abschnittsnummern zentral vergeben. Von Hand nummeriert entstehen bei bedingten
// Abschnitten doppelte Nummern, und der Text wird beim Zitieren unbrauchbar.
function nummerieren(abschnitte) {
  let n = 0
  return abschnitte.filter(Boolean).map((a) => `<h2>${++n}. ${a.titel}</h2>\n${a.inhalt}`).join('\n\n')
}

const anschrift = hatAnschrift
  ? `<p>${esc(L.operator)}<br />${L.companyName ? esc(L.companyName) + '<br />' : ''}${esc(L.street)}<br />${esc(L.zip)} ${esc(L.city)}<br />${esc(L.country)}</p>`
  : `<p class="warnung">Anschrift fehlt. Vor dem öffentlichen Betrieb in <code>src/content/legal.json</code> eintragen – § 5 DDG verlangt eine ladungsfähige Anschrift. <code>npm run check:launch</code> meldet das als Blocker.</p>`

const seite = (titel, beschreibung, inhalt) => `<!doctype html>
<html lang="de" data-brand="klar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${titel} – ${esc(L.siteName)}</title>
    <meta name="description" content="${esc(beschreibung)}" />
    <meta name="robots" content="noindex, follow" />
    <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="./favicon-96.png" sizes="96x96" type="image/png" />
    <link rel="icon" href="./favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
    <script type="module" src="/src/article.ts"></script>
  </head>
  <body>
    <header class="site">
      <div class="wrap">
        <strong>${esc(L.siteName)}</strong>
        <a href="./">Studio</a>
        <a href="./#redaktionsplan">Redaktionsplan</a>
        <a href="./impressum.html">Impressum</a>
        <a href="./datenschutz.html">Datenschutz</a>
      </div>
    </header>
    <main class="wrap">
      <article>
        <h1>${titel}</h1>
${inhalt}
      </article>
      <footer class="site"><p><a href="./">Zurück zum Studio</a></p></footer>
    </main>
  </body>
</html>
`

// ---------- Impressum ----------
const impressum = nummerieren([
  { titel: 'Angaben gemäß § 5 DDG', inhalt: anschrift },
  { titel: 'Kontakt', inhalt: `<p>E-Mail: <a href="mailto:${esc(L.email)}">${esc(L.email)}</a>${L.phone ? `<br />Telefon: ${esc(L.phone)}` : ''}</p>` },
  L.vatId && { titel: 'Umsatzsteuer-Identifikationsnummer', inhalt: `<p>${esc(L.vatId)}</p>` },
  { titel: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV', inhalt: `<p>${esc(L.responsible)}${hatAnschrift ? `, ${esc(L.street)}, ${esc(L.zip)} ${esc(L.city)}` : ''}</p>` },
  { titel: 'Verbraucherstreitbeilegung', inhalt: '<p>Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>' },
  { titel: 'Haftung für Inhalte', inhalt: '<p>Als Diensteanbieter bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Die mitgelieferten Beispieldatensätze sind mit Sorgfalt recherchiert und mit Quelle sowie Dateninfo versehen; sie ersetzen keine amtliche Statistik. Lücken, Methodenbrüche und berechnete Werte sind je Datensatz offengelegt.</p>' },
  { titel: 'Haftung für Links', inhalt: '<p>Diese Seite verlinkt auf externe Quellen, auf deren Inhalte ich keinen Einfluss habe. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar.</p>' },
  { titel: 'Urheberrecht', inhalt: '<p>Der Programmcode steht unter der MIT-Lizenz. Die Diagramm-Animation basiert auf <a href="https://github.com/hatemhosny/racing-bars" target="_blank" rel="noreferrer">racing-bars</a> (MIT). Die Rechte an den zitierten Statistiken liegen bei den jeweils genannten Herausgebern.</p>' },
])

// ---------- Datenschutz ----------
const messung = []
if (cf) messung.push('<p><strong>Cloudflare Web Analytics</strong> (Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA) misst Seitenaufrufe ohne Cookies und ohne geräteübergreifende Wiedererkennung. Es werden keine Profile gebildet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Weil dabei keine Informationen auf deinem Gerät gespeichert oder ausgelesen werden, ist keine Einwilligung nach § 25 TDDDG erforderlich.</p>')
if (ga) messung.push('<p><strong>Google Analytics 4</strong> (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) wird ausschließlich nach deiner ausdrücklichen Einwilligung geladen. Erst dann werden Cookies gesetzt. Die IP-Adresse wird gekürzt, Google Signals und die Personalisierung von Werbung sind abgeschaltet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 25 Abs. 1 TDDDG. Du kannst jederzeit widerrufen: <button type="button" data-consent-reset>Auswahl erneut treffen</button>.</p>')
if (!messung.length) messung.push('<p>Es findet keine Reichweitenmessung statt. Es sind keine Analyse-Skripte eingebunden und es werden keine Cookies zu Statistikzwecken gesetzt.</p>')

const datenschutz = nummerieren([
  { titel: 'Das Wichtigste zuerst', inhalt: `<p>${esc(L.siteName)} läuft vollständig im Browser. Tabellen, die du hochlädst oder eingibst, die erzeugten Videos und deine Einstellungen verlassen dein Gerät nicht. Es gibt keinen Server, der sie entgegennimmt.</p>` },
  { titel: 'Verantwortlicher', inhalt: `<p>${esc(L.operator)}${hatAnschrift ? `, ${esc(L.street)}, ${esc(L.zip)} ${esc(L.city)}` : ''}<br />E-Mail: <a href="mailto:${esc(L.email)}">${esc(L.email)}</a></p>` },
  { titel: 'Aufruf der Seite', inhalt: '<p>Die Seite wird über GitHub Pages ausgeliefert (GitHub, Inc., 88 Colin P Kelly Jr Street, San Francisco, CA 94107, USA). Beim Abruf verarbeitet der Hoster technisch notwendige Zugriffsdaten wie IP-Adresse, Zeitpunkt, abgerufene Datei und User-Agent. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Darauf habe ich keinen Einfluss und erhalte davon keine Kopie.</p>' },
  { titel: 'Speicherung im Browser', inhalt: '<p>Deine Einstellungen und, falls du sie triffst, deine Entscheidung zur Statistik werden im lokalen Speicher deines Browsers abgelegt. Sie werden nicht übertragen und lassen sich jederzeit über die Browser-Einstellungen löschen.</p>' },
  { titel: 'Schriften und Programmcode', inhalt: '<p>Schriften und Programmcode werden mit der Seite selbst ausgeliefert. Es findet keine Nachladung von Google Fonts oder einem anderen fremden Server statt.</p>' },
  { titel: 'Reichweitenmessung', inhalt: messung.join('\n') },
  { titel: 'Google Search Console', inhalt: '<p>Für diese Seite wird die Google Search Console genutzt. Sie verarbeitet <strong>keine</strong> Daten der Besucherinnen und Besucher: Es wird kein Skript geladen, kein Cookie gesetzt und kein Zählpixel eingebunden. Ausgewertet werden ausschließlich Daten, die bei Google ohnehin anfallen, wenn die Seite in den Suchergebnissen erscheint.</p>' },
  { titel: 'Deine Rechte', inhalt: '<p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, dich bei einer Aufsichtsbehörde zu beschweren. Zuständig ist die Aufsichtsbehörde deines Wohnorts oder das Bayerische Landesamt für Datenschutzaufsicht.</p>' },
])

fs.writeFileSync('impressum.html', seite('Impressum', 'Anbieterkennzeichnung nach § 5 DDG und Verantwortlichkeit für die Inhalte dieser Website.', impressum))
fs.writeFileSync('datenschutz.html', seite('Datenschutzerklärung', 'Welche Daten diese Seite verarbeitet – und welche ausdrücklich nicht.', datenschutz))
console.log(`impressum.html und datenschutz.html erzeugt · Anschrift ${hatAnschrift ? 'vorhanden' : 'FEHLT'} · Messung: ${[cf && 'Cloudflare', ga && 'GA4'].filter(Boolean).join(', ') || 'keine'}`)
