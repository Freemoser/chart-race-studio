import { describe, expect, it } from 'vitest'
import { animationDurationSec, stepDurationForAnimation, totalDurationSec, DEFAULT_ANIMATION_SEC, DEFAULT_SETTINGS } from '@/lib/settings'

describe('Zeitrechnung', () => {
  it('Animationsdauer und Schrittdauer sind zueinander invers', () => {
    const periods = 26 // 25 Schritte
    const step = stepDurationForAnimation(20, periods)
    expect(step).toBe(800)
    expect(animationDurationSec({ stepDuration: step }, periods)).toBe(20)
    expect(totalDurationSec({ ...DEFAULT_SETTINGS, stepDuration: step, holdStart: 1, holdEnd: 3 }, periods)).toBe(24)
  })
  it('klemmt zu kurze Schritte', () => {
    expect(stepDurationForAnimation(0.1, 100)).toBe(40)
  })
})

describe('Voreinstellungen', () => {
  it('sind 30 s Animation und 15 s Standbild am Ende', () => {
    expect(DEFAULT_ANIMATION_SEC).toBe(30)
    expect(DEFAULT_SETTINGS.holdEnd).toBe(15)
    expect(DEFAULT_SETTINGS.holdStart).toBe(1)
    // 35 Perioden = 34 Schritte -> 30 s Animation, 46 s Gesamtlänge
    const step = stepDurationForAnimation(DEFAULT_ANIMATION_SEC, 35)
    expect(animationDurationSec({ stepDuration: step }, 35)).toBeCloseTo(30, 1)
    expect(totalDurationSec({ ...DEFAULT_SETTINGS, stepDuration: step }, 35)).toBeCloseTo(46, 1)
  })
})
