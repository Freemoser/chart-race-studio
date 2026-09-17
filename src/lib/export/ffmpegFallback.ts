/**
 * Fallback-Encoder mit ffmpeg.wasm (Single-Thread-Core, kein SharedArrayBuffer
 * nötig – wichtig für GitHub Pages ohne COOP/COEP-Header).
 * Frames werden als JPEG in das virtuelle Dateisystem geschrieben und am Ende
 * mit libx264 zu MP4 gemuxt.
 */
export interface FfmpegSession {
  addFrame: (canvas: HTMLCanvasElement, index: number) => Promise<void>
  finish: (fps: number, onLog?: (s: string) => void) => Promise<Uint8Array>
  cancel: () => void
}

const CORE_VERSION = '0.12.10'
const CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`

export async function createFfmpegSession(onProgress?: (ratio: number) => void): Promise<FfmpegSession> {
  const { FFmpeg } = await import('@ffmpeg/ffmpeg')
  const { toBlobURL } = await import('@ffmpeg/util')
  const ffmpeg = new FFmpeg()
  ffmpeg.on('progress', ({ progress }) => onProgress?.(progress))
  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
  })
  let cancelled = false
  const names: string[] = []
  return {
    addFrame: async (canvas, index) => {
      if (cancelled) return
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.93))
      if (!blob) throw new Error('Frame konnte nicht kodiert werden')
      const name = `f${String(index).padStart(6, '0')}.jpg`
      await ffmpeg.writeFile(name, new Uint8Array(await blob.arrayBuffer()))
      names.push(name)
    },
    finish: async (fps, onLog) => {
      if (onLog) ffmpeg.on('log', ({ message }) => onLog(message))
      await ffmpeg.exec(['-framerate', String(fps), '-i', 'f%06d.jpg', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'out.mp4'])
      const data = (await ffmpeg.readFile('out.mp4')) as Uint8Array
      for (const n of names) { try { await ffmpeg.deleteFile(n) } catch { /* egal */ } }
      ffmpeg.terminate()
      return data
    },
    cancel: () => { cancelled = true; try { ffmpeg.terminate() } catch { /* egal */ } },
  }
}
