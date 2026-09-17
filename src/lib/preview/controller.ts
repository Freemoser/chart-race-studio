import { useSyncExternalStore } from 'react'
import type { ChartHandle } from '../chart/types'

export type PreviewState = 'idle' | 'holdStart' | 'playing' | 'holdEnd' | 'paused' | 'ended'

interface Snapshot { state: PreviewState; index: number; total: number; playing: boolean }

/**
 * Steuert die Live-Vorschau inkl. Standbild am Anfang/Ende und Loop.
 * Unabhängig vom Chart-Typ – arbeitet gegen ChartHandle.
 */
class PreviewController {
  private handle: ChartHandle | null = null
  private unsub: (() => void) | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private listeners = new Set<() => void>()
  private snap: Snapshot = { state: 'idle', index: 0, total: 0, playing: false }
  holdStart = 1
  holdEnd = 3
  loop = true

  attach(handle: ChartHandle, startIndex = 0, resumePlaying = false) {
    this.detach()
    this.handle = handle
    this.unsub = handle.onDateChange((i, last) => {
      this.set({ index: i })
      if (last && this.snap.state === 'playing') this.onEnd()
    })
    const idx = Math.min(startIndex, handle.dates.length - 1)
    if (idx > 0) handle.goTo(idx)
    this.set({ state: idx >= handle.dates.length - 1 ? 'ended' : 'paused', index: idx, total: handle.dates.length, playing: false })
    if (resumePlaying) this.play()
  }

  detach() {
    this.clearTimer()
    this.unsub?.()
    this.unsub = null
    this.handle?.pause()
    this.handle = null
  }

  private clearTimer() { if (this.timer) { clearTimeout(this.timer); this.timer = null } }

  private set(p: Partial<Snapshot>) {
    this.snap = { ...this.snap, ...p }
    this.snap.playing = this.snap.state === 'playing' || this.snap.state === 'holdStart' || this.snap.state === 'holdEnd'
    this.listeners.forEach((l) => l())
  }

  play() {
    const h = this.handle
    if (!h) return
    this.clearTimer()
    const atEnd = this.snap.index >= h.dates.length - 1
    if (atEnd || this.snap.state === 'idle' || this.snap.state === 'ended') {
      h.goTo(0)
      this.set({ state: 'holdStart', index: 0 })
      this.timer = setTimeout(() => this.startAnim(), this.holdStart * 1000)
    } else {
      this.startAnim()
    }
  }

  private startAnim() {
    const h = this.handle
    if (!h) return
    this.set({ state: 'playing' })
    h.play()
  }

  private onEnd() {
    const h = this.handle
    if (!h) return
    h.pause()
    this.set({ state: 'holdEnd' })
    this.timer = setTimeout(() => {
      if (this.loop) this.play()
      else this.set({ state: 'ended' })
    }, this.holdEnd * 1000)
  }

  pause() {
    this.clearTimer()
    this.handle?.pause()
    this.set({ state: 'paused' })
  }

  toggle() {
    if (this.snap.playing) this.pause()
    else this.play()
  }

  restart() {
    this.pause()
    this.handle?.goTo(0)
    this.set({ index: 0, state: 'paused' })
    this.play()
  }

  seek(i: number) {
    const h = this.handle
    if (!h) return
    this.clearTimer()
    h.pause()
    const idx = Math.max(0, Math.min(h.dates.length - 1, Math.round(i)))
    h.goTo(idx)
    this.set({ index: idx, state: idx >= h.dates.length - 1 ? 'ended' : 'paused' })
  }

  subscribe = (l: () => void) => { this.listeners.add(l); return () => { this.listeners.delete(l) } }
  getSnapshot = () => this.snap
}

export const preview = new PreviewController()

export function usePreview(): Snapshot {
  return useSyncExternalStore(preview.subscribe, preview.getSnapshot, preview.getSnapshot)
}
