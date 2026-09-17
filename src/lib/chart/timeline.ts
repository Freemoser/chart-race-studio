export interface Timeline {
  fps: number
  periodCount: number
  tick: number // ms je Datum
  animMs: number
  holdStartFrames: number
  animFrames: number
  holdEndFrames: number
  totalFrames: number
}

export function buildTimeline(opts: { fps: number; periodCount: number; tick: number; holdStartSec: number; holdEndSec: number }): Timeline {
  const animMs = Math.max(0, opts.periodCount - 1) * opts.tick
  const holdStartFrames = Math.round(opts.holdStartSec * opts.fps)
  const holdEndFrames = Math.round(opts.holdEndSec * opts.fps)
  const animFrames = Math.ceil((animMs / 1000) * opts.fps)
  return {
    fps: opts.fps,
    periodCount: opts.periodCount,
    tick: opts.tick,
    animMs,
    holdStartFrames,
    animFrames,
    holdEndFrames,
    totalFrames: holdStartFrames + animFrames + holdEndFrames + 1,
  }
}

/** Zeitpunkt (ms innerhalb der Animation) für Frame k; Standbilder werden geklemmt. */
export function frameTime(tl: Timeline, frame: number): number {
  const t = ((frame - tl.holdStartFrames) / tl.fps) * 1000
  return Math.min(tl.animMs, Math.max(0, t))
}

/** Kontinuierlicher Datums-Index zu einem Zeitpunkt */
export function indexAt(tl: Timeline, timeMs: number): number {
  if (tl.tick <= 0) return 0
  return Math.min(tl.periodCount - 1, Math.max(0, timeMs / tl.tick))
}
