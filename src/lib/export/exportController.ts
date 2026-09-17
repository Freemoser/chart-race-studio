import type { Dataset } from '../data/types'
import type { ChartSettings } from '../settings'
import { formatById } from '../formats'
import { computeLayout, createMeasurer } from '../layout'
import { prepareChartInput } from '../chart/prepare'
import { buildTimeline, frameTime, indexAt } from '../chart/timeline'
import { embeddedFontMap, fontFaceCss, BRAND_FONTS, type BrandId } from '../fonts'
import { formatPeriod, periodForLabel } from '../data/dates'
import { serializeSvg, svgToImage } from './svgSerialize'
import { drawChrome } from './compose'
import { stageColors } from '../stageColors'
import type { ExportFrameApi } from '@/export-frame/main'

export type ExportKind = 'mp4' | 'gif' | 'png'
export type ExportPhase = 'prepare' | 'render' | 'encode' | 'finalize'

export interface ExportProgress { phase: ExportPhase; frame: number; total: number; ratio: number; note?: string }

export interface ExportOptions {
  dataset: Dataset
  settings: ChartSettings
  brand: BrandId
  kind: ExportKind
  fps?: number
  /** Für PNG: Datums-Index, der gerendert werden soll */
  pngIndex?: number
  signal?: AbortSignal
  onProgress?: (p: ExportProgress) => void
  /** Testhilfe: ffmpeg.wasm erzwingen (auch per URL-Parameter ?encoder=ffmpeg) */
  forceFfmpeg?: boolean
}

export interface ExportResult { blob: Blob; filename: string; encoder: 'webcodecs' | 'ffmpeg' | 'gifenc' | 'png' }

class Aborted extends Error { constructor() { super('Export abgebrochen') } }

function throwIfAborted(signal?: AbortSignal) { if (signal?.aborted) throw new Aborted() }

async function loadIframe(width: number, height: number, signal?: AbortSignal): Promise<{ frame: HTMLIFrameElement; api: ExportFrameApi }> {
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  frame.style.cssText = `position:fixed;left:-${width + 100}px;top:0;width:${width}px;height:${height}px;border:0;opacity:0;pointer-events:none;`
  frame.src = `${import.meta.env.BASE_URL}export.html`
  document.body.appendChild(frame)
  const api = await new Promise<ExportFrameApi>((resolve, reject) => {
    const t0 = performance.now()
    const poll = () => {
      if (signal?.aborted) return reject(new Aborted())
      const w = frame.contentWindow as (Window & { __crsExport?: ExportFrameApi }) | null
      if (w?.__crsExport?.ready) return resolve(w.__crsExport)
      if (performance.now() - t0 > 20000) return reject(new Error('Export-Renderer konnte nicht geladen werden'))
      setTimeout(poll, 30)
    }
    poll()
  })
  return { frame, api }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image()
  img.src = src
  await img.decode()
  return img
}

export async function runExport(opts: ExportOptions): Promise<ExportResult> {
  const { dataset, settings, brand, kind, signal } = opts
  const fps = kind === 'gif' ? Math.min(opts.fps ?? 15, 20) : opts.fps ?? 30
  const progress = (p: ExportProgress) => opts.onProgress?.(p)
  progress({ phase: 'prepare', frame: 0, total: 0, ratio: 0 })

  const format = formatById(settings.format)
  const family = BRAND_FONTS[brand].css
  const measure = createMeasurer()
  const layout = computeLayout(format, settings, measure, family)
  const input = prepareChartInput(dataset, settings, layout.chart, layout.labelSize, family)
  const tl = buildTimeline({ fps, periodCount: input.periods.length, tick: input.tickDuration, holdStartSec: settings.holdStart, holdEndSec: settings.holdEnd })
  const colors = stageColors(settings.theme)
  const fontMap = await embeddedFontMap(brand)
  const fontCss = fontFaceCss(brand, fontMap)
  const logo = settings.watermarkEnabled && settings.watermarkLogo ? await loadImage(settings.watermarkLogo) : null
  throwIfAborted(signal)

  const { frame, api } = await loadIframe(format.width, format.height, signal)
  const canvas = document.createElement('canvas')
  canvas.width = format.width
  canvas.height = format.height
  const ctx = canvas.getContext('2d', { alpha: false })!

  let lastSvg = ''
  let lastImg: HTMLImageElement | null = null
  const renderFrame = async (timeMs: number) => {
    const svgEl = await api.renderAt(timeMs)
    const str = serializeSvg(svgEl, fontCss, input.width, input.height)
    if (str !== lastSvg || !lastImg) {
      lastImg = await svgToImage(str)
      lastSvg = str
    }
    const idx = Math.min(input.periods.length - 1, Math.floor(indexAt(tl, timeMs) + 1e-6))
    const dateLabel = formatPeriod(periodForLabel(input.periods, idx), settings.dateTemplate)
    drawChrome(ctx, layout, settings, colors, family, dateLabel, logo)
    ctx.drawImage(lastImg, layout.chart.x, layout.chart.y, input.width, input.height)
  }

  const cleanup = () => { try { api.destroy() } catch { /* egal */ } frame.remove() }
  const stem = (settings.title || 'chart-race').toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60) || 'chart-race'

  try {
    await api.setup(input, settings.chartType, brand)
    throwIfAborted(signal)

    if (kind === 'png') {
      const idx = Math.max(0, Math.min(input.periods.length - 1, opts.pngIndex ?? input.periods.length - 1))
      await renderFrame(idx * input.tickDuration)
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) throw new Error('PNG konnte nicht erzeugt werden')
      return { blob, filename: `${stem}-${format.id.replace(':', 'x')}.png`, encoder: 'png' }
    }

    if (kind === 'gif') {
      const worker = new Worker(new URL('./gif.worker.ts', import.meta.url), { type: 'module' })
      const scale = Math.min(1, 720 / format.width, 720 / format.height)
      const gw = Math.round(format.width * scale), gh = Math.round(format.height * scale)
      const small = document.createElement('canvas')
      small.width = gw; small.height = gh
      const sctx = small.getContext('2d', { willReadFrequently: true })!
      const call = (msg: unknown, transfer: Transferable[] = []) => new Promise<MessageEvent>((res, rej) => {
        worker.onmessage = res
        worker.onerror = (e) => rej(new Error(e.message))
        worker.postMessage(msg, transfer)
      })
      try {
        await call({ type: 'init' })
        const delay = Math.round(1000 / fps)
        for (let k = 0; k < tl.totalFrames; k++) {
          throwIfAborted(signal)
          await renderFrame(frameTime(tl, k))
          sctx.drawImage(canvas, 0, 0, gw, gh)
          const data = sctx.getImageData(0, 0, gw, gh).data
          await call({ type: 'frame', data, width: gw, height: gh, delay }, [data.buffer])
          progress({ phase: 'render', frame: k + 1, total: tl.totalFrames, ratio: (k + 1) / tl.totalFrames })
        }
        progress({ phase: 'finalize', frame: tl.totalFrames, total: tl.totalFrames, ratio: 1 })
        const done = await call({ type: 'finish' })
        return { blob: new Blob([done.data.buffer], { type: 'image/gif' }), filename: `${stem}-${format.id.replace(':', 'x')}.gif`, encoder: 'gifenc' }
      } finally {
        worker.terminate()
      }
    }

    // MP4: WebCodecs im Worker, Fallback ffmpeg.wasm
    const worker = new Worker(new URL('./encoder.worker.ts', import.meta.url), { type: 'module' })
    const call = (msg: unknown, transfer: Transferable[] = []) => new Promise<MessageEvent>((res, rej) => {
      worker.onmessage = (e) => (e.data.type === 'error' ? rej(new Error(e.data.message)) : res(e))
      worker.onerror = (e) => rej(new Error(e.message))
      worker.postMessage(msg, transfer)
    })
    let useFfmpeg = opts.forceFfmpeg ?? new URLSearchParams(location.search).get('encoder') === 'ffmpeg'
    if (!useFfmpeg) {
      try {
        const init = await call({ type: 'init', width: format.width, height: format.height, fps })
        if (init.data.type === 'unsupported') useFfmpeg = true
      } catch { useFfmpeg = true }
    }

    if (!useFfmpeg) {
      try {
        for (let k = 0; k < tl.totalFrames; k++) {
          throwIfAborted(signal)
          await renderFrame(frameTime(tl, k))
          const bitmap = await createImageBitmap(canvas)
          await call({ type: 'frame', bitmap }, [bitmap])
          progress({ phase: 'render', frame: k + 1, total: tl.totalFrames, ratio: (k + 1) / tl.totalFrames })
        }
        progress({ phase: 'finalize', frame: tl.totalFrames, total: tl.totalFrames, ratio: 1 })
        const done = await call({ type: 'finish' })
        return { blob: new Blob([done.data.buffer], { type: 'video/mp4' }), filename: `${stem}-${format.id.replace(':', 'x')}.mp4`, encoder: 'webcodecs' }
      } catch (e) {
        if (e instanceof Aborted) throw e
        // WebCodecs ist zur Laufzeit gescheitert -> ffmpeg versuchen
        console.warn('WebCodecs fehlgeschlagen, Fallback auf ffmpeg.wasm', e)
        useFfmpeg = true
      } finally {
        worker.postMessage({ type: 'cancel' })
        worker.terminate()
      }
    } else {
      worker.terminate()
    }

    progress({ phase: 'prepare', frame: 0, total: tl.totalFrames, ratio: 0, note: 'ffmpeg.wasm wird geladen (ca. 30 MB, einmalig)…' })
    const { createFfmpegSession } = await import('./ffmpegFallback')
    const session = await createFfmpegSession((r) => progress({ phase: 'encode', frame: tl.totalFrames, total: tl.totalFrames, ratio: Math.min(1, r) }))
    signal?.addEventListener('abort', () => session.cancel(), { once: true })
    lastSvg = ''
    for (let k = 0; k < tl.totalFrames; k++) {
      throwIfAborted(signal)
      await renderFrame(frameTime(tl, k))
      await session.addFrame(canvas, k)
      progress({ phase: 'render', frame: k + 1, total: tl.totalFrames, ratio: (k + 1) / tl.totalFrames, note: 'Fallback: ffmpeg.wasm' })
    }
    progress({ phase: 'encode', frame: tl.totalFrames, total: tl.totalFrames, ratio: 0, note: 'ffmpeg kodiert…' })
    const data = await session.finish(fps)
    return { blob: new Blob([data.buffer as ArrayBuffer], { type: 'video/mp4' }), filename: `${stem}-${format.id.replace(':', 'x')}.mp4`, encoder: 'ffmpeg' }
  } finally {
    cleanup()
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

export const isAbortError = (e: unknown) => e instanceof Aborted
