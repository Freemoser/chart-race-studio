/**
 * Schriften der drei Branding-Richtungen. Die Dateien liegen im Bundle
 * (fontsource, OFL-1.1) und werden für den Export als Data-URL in das
 * SVG eingebettet, sonst fehlen sie beim Rasterisieren.
 */
import interUrl from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import interExtUrl from '@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2?url'
import plex400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2?url'
import plex500 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2?url'
import plex600 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2?url'
import plex700 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2?url'
import plexExt400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-400-normal.woff2?url'
import plexExt600 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-600-normal.woff2?url'
import plexExt700 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-700-normal.woff2?url'
import manropeUrl from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url'
import manropeExtUrl from '@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2?url'

export type BrandId = 'klar' | 'editorial' | 'signal'

export interface FontFace { family: string; url: string; weight: string; unicodeRange?: string }

export const BRAND_FONTS: Record<BrandId, { family: string; css: string; faces: FontFace[] }> = {
  klar: {
    family: 'Inter Variable',
    css: `'Inter Variable', Inter, system-ui, sans-serif`,
    faces: [
      { family: 'Inter Variable', url: interUrl, weight: '100 900' },
      { family: 'Inter Variable', url: interExtUrl, weight: '100 900', unicodeRange: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
    ],
  },
  editorial: {
    family: 'IBM Plex Sans',
    css: `'IBM Plex Sans', system-ui, sans-serif`,
    faces: [
      { family: 'IBM Plex Sans', url: plex400, weight: '400' },
      { family: 'IBM Plex Sans', url: plex500, weight: '500' },
      { family: 'IBM Plex Sans', url: plex600, weight: '600' },
      { family: 'IBM Plex Sans', url: plex700, weight: '700' },
      { family: 'IBM Plex Sans', url: plexExt400, weight: '400', unicodeRange: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
      { family: 'IBM Plex Sans', url: plexExt600, weight: '600', unicodeRange: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
      { family: 'IBM Plex Sans', url: plexExt700, weight: '700', unicodeRange: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
    ],
  },
  signal: {
    family: 'Manrope Variable',
    css: `'Manrope Variable', Manrope, system-ui, sans-serif`,
    faces: [
      { family: 'Manrope Variable', url: manropeUrl, weight: '200 800' },
      { family: 'Manrope Variable', url: manropeExtUrl, weight: '200 800', unicodeRange: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
    ],
  },
}

/** @font-face-Regeln mit URL (für das Dokument) */
export function fontFaceCss(brand: BrandId, embed?: Map<string, string>): string {
  return BRAND_FONTS[brand].faces
    .map((f) => {
      const src = embed?.get(f.url) ?? f.url
      return `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:block;src:url(${src}) format('woff2');${f.unicodeRange ? `unicode-range:${f.unicodeRange};` : ''}}`
    })
    .join('\n')
}

const embedCache = new Map<string, Promise<string>>()

/** Lädt die Schriftdateien und liefert eine Map URL -> data:-URL (gecacht). */
export async function embeddedFontMap(brand: BrandId): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  await Promise.all(
    BRAND_FONTS[brand].faces.map(async (f) => {
      if (!embedCache.has(f.url)) {
        embedCache.set(
          f.url,
          fetch(f.url).then(async (r) => {
            const buf = await r.arrayBuffer()
            let bin = ''
            const bytes = new Uint8Array(buf)
            for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
            return `data:font/woff2;base64,${btoa(bin)}`
          }),
        )
      }
      out.set(f.url, await embedCache.get(f.url)!)
    }),
  )
  return out
}

/** Wartet, bis die Schriften des Brands geladen sind (document.fonts). */
export async function ensureFontsLoaded(brand: BrandId, sizes = [16, 26, 52]): Promise<void> {
  const fam = BRAND_FONTS[brand].family
  await Promise.all(sizes.flatMap((s) => [400, 500, 600, 700].map((w) => document.fonts.load(`${w} ${s}px '${fam}'`, 'Nordrhein-Westfalen 0123456789'))))
}
