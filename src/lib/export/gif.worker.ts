/// <reference lib="webworker" />
import { GIFEncoder, quantize, applyPalette } from 'gifenc'

let gif: ReturnType<typeof GIFEncoder> | null = null

self.onmessage = (ev: MessageEvent) => {
  const msg = ev.data
  if (msg.type === 'init') {
    gif = GIFEncoder()
    self.postMessage({ type: 'ready' })
  } else if (msg.type === 'frame') {
    if (!gif) return
    const { data, width, height, delay } = msg as { data: Uint8ClampedArray; width: number; height: number; delay: number }
    const palette = quantize(data, 256, { format: 'rgb444' })
    const index = applyPalette(data, palette, 'rgb444')
    gif.writeFrame(index, width, height, { palette, delay })
    self.postMessage({ type: 'ack' })
  } else if (msg.type === 'finish') {
    if (!gif) return
    gif.finish()
    const bytes = gif.bytes()
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
    gif = null
    self.postMessage({ type: 'done', buffer }, { transfer: [buffer] })
  } else if (msg.type === 'cancel') {
    gif = null
  }
}
