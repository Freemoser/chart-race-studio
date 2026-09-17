// Flaggen aus flag-icons (MIT). Lazy als SVG-Text geladen und als data:-URL gespeichert,
// damit sie ohne externe Requests im Export landen.
export const FLAGS = import.meta.glob('/node_modules/flag-icons/flags/4x3/*.svg', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

export async function flagDataUrl(code: string): Promise<string | null> {
  const key = Object.keys(FLAGS).find((k) => k.endsWith(`/${code}.svg`))
  if (!key) return null
  const svg = await FLAGS[key]()
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}
