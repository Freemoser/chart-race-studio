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
    transformIndexHtml(html: string) {
      const tags: string[] = []
      if (env.VITE_GSC_VERIFICATION) tags.push(`<meta name="google-site-verification" content="${env.VITE_GSC_VERIFICATION}" />`)
      if (env.VITE_SITE_URL) tags.push(`<link rel="canonical" href="${env.VITE_SITE_URL}" />`, `<meta property="og:url" content="${env.VITE_SITE_URL}" />`)
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
      const heute = new Date().toISOString().slice(0, 10)
      const seiten = ['', 'artikel/tierarztketten-deutschland.html', '#redaktionsplan', '#impressum', '#datenschutz']
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
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  }
})
