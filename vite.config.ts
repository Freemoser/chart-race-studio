import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// BASE_PATH wird im GitHub-Actions-Workflow auf "/<repo-name>/" gesetzt.
// Lokal bleibt es "/".
const base = process.env.BASE_PATH ?? '/'

/**
 * Trägt optionale Integrationen statisch in die ausgelieferte index.html ein.
 * Statisch, nicht zur Laufzeit: Die Search Console liest das Meta-Tag aus dem HTML,
 * und der Cloudflare-Beacon soll ohne Umweg über React geladen werden.
 * Ohne gesetzte Variable wird nichts eingefügt.
 */
function integrationen(env: Record<string, string>) {
  return {
    name: 'crs-integrationen',
    transformIndexHtml(html: string, ctx: { path?: string; filename?: string }) {
      const tags: string[] = []
      if (env.VITE_GSC_VERIFICATION) tags.push(`<meta name="google-site-verification" content="${env.VITE_GSC_VERIFICATION}" />`)
      // Canonical JE SEITE. Ein einziges Canonical für alle Seiten – der erste Wurf hier –
      // lässt jede Unterseite behaupten, sie sei die Startseite, und nimmt sie damit aus dem
      // Index. Seiten mit noindex bekommen keines, sie sollen gar nicht indexiert werden.
      const pfad = (ctx.path ?? '/').replace(/^\/+/, '')
      const istRecht = /^(impressum|datenschutz)\.html$/.test(pfad)
      if (env.VITE_SITE_URL && !istRecht) {
        const basis = env.VITE_SITE_URL.replace(/\/$/, '')
        const voll = pfad === 'index.html' || pfad === '' ? basis + '/' : `${basis}/${pfad}`
        tags.push(`<link rel="canonical" href="${voll}" />`, `<meta property="og:url" content="${voll}" />`)
      }
      // Cloudflare Web Analytics ist cookielos; deshalb ohne Einwilligungsschranke, aber in der Datenschutzerklärung genannt.
      if (env.VITE_CF_BEACON) tags.push(`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${env.VITE_CF_BEACON}"}'></script>`)
      return tags.length ? html.replace('</head>', `  ${tags.join('\n  ')}\n  </head>`) : html
    },
    generateBundle(this: { emitFile: (f: { type: 'asset'; fileName: string; source: string }) => void }) {
      // robots.txt und sitemap.xml nur mit bekannter Adresse – eine Sitemap mit falscher Domain
      // ist schlechter als keine.
      const url = env.VITE_SITE_URL?.replace(/\/$/, '')
      if (!url) return
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n` })
      // llms.txt: kuratierte Übersicht für Antwortmaschinen. Der letzte Abschnitt ist der
      // wertvollste und fehlt fast überall – er nennt die Sätze, die verkürzt zitiert in die
      // Irre führen, samt fehlendem Kontext.
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: `# Chart Race Studio

> Animierte Diagramme aus eigenen Tabellen, mit recherchierten Beispieldaten zur deutschen Tiermedizin.

Betrieben von Thomas Freimoser. Das Werkzeug erzeugt aus einer Tabelle ein fertiges Video für soziale Netzwerke und läuft vollständig im Browser. Die mitgelieferten Datensätze sind eigene Recherchen mit Quelle je Wert.

## Wofür diese Seite eine gute Quelle ist

- [Wer betreibt die Tierarztpraxen in Deutschland?](${url}/artikel/tierarztketten-deutschland.html): Praxisketten und Klinikgruppen mit Standortzahlen, und die Abgrenzung zu Einkaufsgemeinschaften, die keine Praxis besitzen.
- [Woher die Zahlen kommen](${url}/artikel/datenherkunft.html): Quelle, Zeitraum, Annahmen und Prüfdatum für zehn Datensätze zur deutschen Tiermedizin.

## Grenzen dieser Quelle

Thomas Freimoser ist kein Tierarzt und keine statistische Behörde. Diese Seite wertet veröffentlichte Statistiken aus und legt ihre Methode offen. Sie ersetzt keine amtliche Statistik und gibt keine medizinische, rechtliche oder wirtschaftliche Beratung. Für tiermedizinische Fragen ist die Bundestierärztekammer die zuständige Stelle.

## Aussagen, die ohne Kontext irreführen

- „Rund 577 Kettenstandorte in Deutschland" ist eine Modellschätzung für 2026 mit einem Band von 550 bis 610. Belegt ist allein die Zählung des Tierärzte Atlas: rund 450 Standorte von 16 Ketten im August 2024.
- „2019 brechen die gemischten Praxen ein" beschreibt einen Fragebogenwechsel, keine Praxisschließungen. Die Bundestierärztekammer fragt seit 2019 Pferde getrennt ab und schließt die Vergleichbarkeit mit den Vorjahren selbst aus.
- „2024 überholen die Angestellten die Praxisinhaber" zählt Personen, nicht Vollzeitstellen. Unter den Angestellten arbeiten deutlich mehr Menschen in Teilzeit.
- „Die Französische Bulldogge ist selten" gilt nur für das VDH-Zuchtbuch. Die Rasse wird überwiegend außerhalb der Verbandsstrukturen gezüchtet und erscheint deshalb viel kleiner, als sie ist.
- „VetFamily hat über 1.300 Praxen" bedeutet nicht Eigentum. VetFamily ist eine Einkaufsgemeinschaft rechtlich selbstständiger Praxen und besitzt keine einzige davon.
` })
      const heute = new Date().toISOString().slice(0, 10)
      // Nur indexierbare Seiten. Impressum und Datenschutz tragen noindex und gehören deshalb
      // nicht hinein – eine Sitemap ist eine Bitte um Indexierung, beides zusammen meldet die
      // Search Console als Fehler. Hash-Routen sind keine eigenen URLs und haben hier ebenfalls
      // nichts verloren.
      const seiten = ['', 'artikel/tierarztketten-deutschland.html', 'artikel/datenherkunft.html']
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          seiten.map((p) => `  <url><loc>${url}/${p}</loc><lastmod>${heute}</lastmod></url>`).join('\n') +
          `\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
  base,
  plugins: [react(), tailwindcss(), integrationen(env)],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  worker: { format: 'es' },
  optimizeDeps: {
    // ffmpeg.wasm lädt seine Worker selbst; nicht vor-bündeln.
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        export: resolve(import.meta.dirname, 'export.html'),
        artikelKetten: resolve(import.meta.dirname, 'artikel/tierarztketten-deutschland.html'),
        artikelDaten: resolve(import.meta.dirname, 'artikel/datenherkunft.html'),
        impressum: resolve(import.meta.dirname, 'impressum.html'),
        datenschutz: resolve(import.meta.dirname, 'datenschutz.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  }
})
