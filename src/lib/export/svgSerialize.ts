/**
 * Serialisiert ein Live-SVG (aus racing-bars oder dem Line-Renderer) zu einem
 * eigenständigen SVG-String: berechnete Styles werden inline geschrieben,
 * Schriften als @font-face mit data:-URLs eingebettet.
 */
const STYLE_PROPS = [
  'fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray',
  'opacity', 'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'text-anchor', 'dominant-baseline',
  'display', 'visibility', 'rx', 'ry', 'transform', 'transform-box', 'transform-origin', 'paint-order',
]

const DEFAULTS: Record<string, string[]> = {
  fill: ['rgb(0, 0, 0)'],
  'fill-opacity': ['1'],
  stroke: ['none'],
  'stroke-width': ['1px'],
  'stroke-opacity': ['1'],
  'stroke-linecap': ['butt'],
  'stroke-linejoin': ['miter'],
  'stroke-dasharray': ['none'],
  opacity: ['1'],
  'font-style': ['normal'],
  'letter-spacing': ['normal'],
  'text-anchor': ['start'],
  'dominant-baseline': ['auto'],
  display: ['inline', 'block'],
  visibility: ['visible'],
  rx: ['auto', '0px'],
  ry: ['auto', '0px'],
  transform: ['none'],
  'transform-box': ['view-box'],
  'transform-origin': [],
  'paint-order': ['normal'],
}

function inlineStyles(src: Element, dst: Element, win: Window) {
  const cs = win.getComputedStyle(src)
  const parts: string[] = []
  const tag = src.tagName.toLowerCase()
  for (const p of STYLE_PROPS) {
    const v = cs.getPropertyValue(p)
    if (!v) continue
    if ((p === 'rx' || p === 'ry') && tag !== 'rect') continue
    if (p === 'transform-origin' && cs.getPropertyValue('transform') === 'none') continue
    if (p === 'transform' && src.hasAttribute('transform')) continue
    if (DEFAULTS[p]?.includes(v)) continue
    if (p.startsWith('font') || p === 'letter-spacing' || p === 'text-anchor') {
      if (tag !== 'text' && tag !== 'tspan') continue
    }
    parts.push(`${p}:${v}`)
  }
  if (parts.length) dst.setAttribute('style', parts.join(';'))
  const sc = src.children, dc = dst.children
  for (let i = 0; i < sc.length; i++) if (dc[i]) inlineStyles(sc[i], dc[i], win)
}

export function serializeSvg(svg: SVGSVGElement, fontFaceCss: string, width: number, height: number): string {
  const win = svg.ownerDocument.defaultView ?? window
  const clone = svg.cloneNode(true) as SVGSVGElement
  inlineStyles(svg, clone, win)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))
  if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${width} ${height}`)
  // Interaktive Reste entfernen
  clone.querySelectorAll('[onclick]').forEach((e) => e.removeAttribute('onclick'))
  const style = svg.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = fontFaceCss
  clone.insertBefore(style, clone.firstChild)
  let str = new XMLSerializer().serializeToString(clone)
  // Ungültige XML-Zeichen (z.B. &nbsp; aus .html()) absichern
  str = str.replace(/&nbsp;/g, ' ')
  return str
}

/** Rasterisiert einen SVG-String zu einem Bild (dekodiert, sofort zeichenbar). */
export async function svgToImage(svgString: string): Promise<HTMLImageElement> {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    img.decoding = 'sync'
    img.src = url
    await img.decode()
    return img
  } finally {
    // URL erst nach decode freigeben
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}
