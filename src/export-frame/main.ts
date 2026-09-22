/**
 * Export-Renderer (läuft in einem versteckten, same-origin iframe).
 *
 * Kern-Trick für deterministische Frames: Wir ersetzen `performance.now` und
 * `requestAnimationFrame` durch eine virtuelle Uhr, BEVOR racing-bars (und
 * damit d3-timer) geladen wird. Danach schreiten wir die Zeit frameweise
 * voran; jede D3-Transition landet exakt im gewünschten Zwischenzustand,
 * unabhängig von der Rechnerleistung.
 */
import type { ChartHandle, ChartInput } from '@/lib/chart/types'
import type { BrandId } from '@/lib/fonts'

type RafCb = (t: number) => void
let vnow = 0
let rafQueue: { id: number; cb: RafCb }[] = []
let rafId = 0

const realPerf = performance
Object.defineProperty(realPerf, 'now', { value: () => vnow, configurable: true, writable: true })
window.requestAnimationFrame = (cb: RafCb) => { rafQueue.push({ id: ++rafId, cb }); return rafId }
window.cancelAnimationFrame = (id: number) => { rafQueue = rafQueue.filter((r) => r.id !== id) }
// d3-timer nutzt setInterval nur, um die Uhr zu "poken" – mit virtueller Uhr schädlich
window.setInterval = (() => 0) as unknown as typeof window.setInterval
window.clearInterval = () => {}

function flush(times = 3) {
  for (let k = 0; k < times; k++) {
    const q = rafQueue
    rafQueue = []
    for (const r of q) { try { r.cb(vnow) } catch (e) { console.error(e) } }
  }
}

export interface ExportFrameApi {
  ready: true
  setup: (input: ChartInput, kind: 'bar' | 'line' | 'map', brand: BrandId) => Promise<{ dates: string[] }>
  renderAt: (timeMs: number) => Promise<SVGSVGElement>
  /** Einmal pro Frame: CSS-Text aller Styles (für die Serialisierung) */
  styleText: () => string
  destroy: () => void
}

let handle: ChartHandle | null = null
let tick = 1
let appliedIdx = 0
let kind: 'bar' | 'line' | 'map' = 'bar'
let fontsCss = ''

async function setup(input: ChartInput, k: 'bar' | 'line' | 'map', brand: BrandId) {
  destroy()
  kind = k
  tick = input.tickDuration
  const { fontFaceCss, ensureFontsLoaded } = await import('@/lib/fonts')
  if (!document.getElementById('fonts')) {
    const st = document.createElement('style')
    st.id = 'fonts'
    document.head.appendChild(st)
  }
  fontsCss = fontFaceCss(brand)
  document.getElementById('fonts')!.textContent = fontsCss
  await ensureFontsLoaded(brand, [input.labelSize, Math.round(input.labelSize * 0.8)])
  const container = document.getElementById('chart')!
  container.innerHTML = ''
  vnow = 0
  appliedIdx = 0
  const { createChart } = await import('@/lib/chart/create')
  handle = await createChart(kind, container, input)
  // Initialzustand vollständig rendern
  flush(3)
  await new Promise((r) => setTimeout(r, 0))
  return { dates: handle.dates }
}

async function renderAt(timeMs: number): Promise<SVGSVGElement> {
  if (!handle) throw new Error('Export-Renderer nicht initialisiert')
  const n = handle.dates.length
  // Line und Map rendern ohne Transitions direkt auf die Zeitposition.
  if (kind === 'line' || kind === 'map') {
    handle.renderAt!(tick > 0 ? Math.min(n - 1, timeMs / tick) : 0)
  } else {
    const target = timeMs <= 0 ? 0 : Math.min(n - 1, Math.ceil(timeMs / tick - 1e-6))
    if (target < appliedIdx) {
      // Rückwärts: Neustart über setDate ohne Zwischenzustände
      appliedIdx = 0
      vnow = 0
      flush()
      handle.goTo(0)
      flush()
    }
    while (appliedIdx < target) {
      appliedIdx++
      vnow = (appliedIdx - 1) * tick
      flush()
      handle.goTo(appliedIdx)
      flush(1)
    }
    vnow = Math.max(vnow, timeMs)
    flush(3)
  }
  // MutationObserver (Wertformatierung) läuft als Microtask
  await Promise.resolve()
  await Promise.resolve()
  const svg = handle.svg()
  if (!svg) throw new Error('Kein SVG gefunden')
  return svg
}

function styleText(): string {
  return Array.from(document.querySelectorAll('style')).map((s) => s.textContent ?? '').join('\n')
}

function destroy() {
  handle?.destroy()
  handle = null
}

const api: ExportFrameApi = { ready: true, setup, renderAt, styleText, destroy }
;(window as unknown as { __crsExport: ExportFrameApi }).__crsExport = api
window.parent?.postMessage({ type: 'crs-export-ready' }, '*')
