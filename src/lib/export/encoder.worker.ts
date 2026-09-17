/// <reference lib="webworker" />
/**
 * MP4-Encoder im Web Worker: WebCodecs VideoEncoder (H.264) + mp4-muxer.
 * Nachrichten: init -> ready|unsupported, frame -> ack, finish -> done, cancel.
 */
import { Muxer, ArrayBufferTarget } from 'mp4-muxer'

let encoder: VideoEncoder | null = null
let muxer: Muxer<ArrayBufferTarget> | null = null
let frameIndex = 0
let fps = 30
let cancelled = false

const CODECS = ['avc1.640033', 'avc1.64002A', 'avc1.4D402A', 'avc1.42E02A', 'avc1.42E01F']

async function pickCodec(width: number, height: number, bitrate: number): Promise<VideoEncoderConfig | null> {
  if (typeof VideoEncoder === 'undefined') return null
  for (const codec of CODECS) {
    for (const hw of ['prefer-hardware', 'prefer-software'] as const) {
      const cfg: VideoEncoderConfig = { codec, width, height, bitrate, framerate: fps, hardwareAcceleration: hw, avc: { format: 'avc' }, latencyMode: 'quality' }
      try {
        const r = await VideoEncoder.isConfigSupported(cfg)
        if (r.supported) return cfg
      } catch { /* nächster */ }
    }
  }
  return null
}

self.onmessage = async (ev: MessageEvent) => {
  const msg = ev.data
  try {
    if (msg.type === 'init') {
      fps = msg.fps
      cancelled = false
      frameIndex = 0
      const bitrate = msg.bitrate ?? Math.round(msg.width * msg.height * fps * 0.14)
      const cfg = await pickCodec(msg.width, msg.height, bitrate)
      if (!cfg) { self.postMessage({ type: 'unsupported' }); return }
      muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: { codec: 'avc', width: msg.width, height: msg.height, frameRate: fps },
        fastStart: 'in-memory',
        firstTimestampBehavior: 'offset',
      })
      encoder = new VideoEncoder({
        output: (chunk, meta) => muxer!.addVideoChunk(chunk, meta),
        error: (e) => self.postMessage({ type: 'error', message: e.message }),
      })
      encoder.configure(cfg)
      self.postMessage({ type: 'ready', codec: cfg.codec })
    } else if (msg.type === 'frame') {
      if (!encoder || cancelled) { (msg.bitmap as ImageBitmap).close(); self.postMessage({ type: 'ack' }); return }
      const bitmap = msg.bitmap as ImageBitmap
      const timestamp = Math.round((frameIndex * 1_000_000) / fps)
      const frame = new VideoFrame(bitmap, { timestamp, duration: Math.round(1_000_000 / fps) })
      encoder.encode(frame, { keyFrame: frameIndex % (fps * 2) === 0 })
      frame.close()
      bitmap.close()
      frameIndex++
      // Rückstau begrenzen
      while (encoder.encodeQueueSize > 6) await new Promise((r) => setTimeout(r, 4))
      self.postMessage({ type: 'ack' })
    } else if (msg.type === 'finish') {
      if (!encoder || !muxer) return
      await encoder.flush()
      muxer.finalize()
      const buffer = muxer.target.buffer
      encoder.close()
      encoder = null
      muxer = null
      self.postMessage({ type: 'done', buffer }, { transfer: [buffer] })
    } else if (msg.type === 'cancel') {
      cancelled = true
      try { encoder?.close() } catch { /* ignorieren */ }
      encoder = null
      muxer = null
    }
  } catch (e) {
    self.postMessage({ type: 'error', message: e instanceof Error ? e.message : String(e) })
  }
}
