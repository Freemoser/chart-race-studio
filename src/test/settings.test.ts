import { describe, expect, it } from 'vitest'
import { animationDurationSec, stepDurationForAnimation, totalDurationSec, DEFAULT_ANIMATION_SEC, DEFAULT_SETTINGS } from '@/lib/settings'
import { effectivePeriodCount } from '@/lib/data/transform'
import { parsePeriods } from '@/lib/data/dates'

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

describe('Dauer bei Jahreslücken', () => {
  it('leitet die Schrittdauer aus den tatsächlich abgespielten Perioden ab', () => {
    // Datensatz mit Lücke: 1991–1995 und 2001, also 6 Zeilen, aber 11 abgespielte Jahre.
    const { periods } = parsePeriods(['1991', '1992', '1993', '1994', '1995', '2001'])
    expect(periods.length).toBe(6)
    expect(effectivePeriodCount(periods, 'interpolate')).toBe(11)
    expect(effectivePeriodCount(periods, 'none')).toBe(6)

    // 30 s Animation über 11 Perioden = 10 Schritte
    const step = stepDurationForAnimation(30, effectivePeriodCount(periods, 'interpolate'))
    const s = { ...DEFAULT_SETTINGS, stepDuration: step, subSteps: 1, holdStart: 1, holdEnd: 15 }
    expect(totalDurationSec(s, effectivePeriodCount(periods, 'interpolate'))).toBeCloseTo(46, 1)

    // Aus der Zeilenzahl gerechnet wäre die Datei länger als angezeigt – der Fehler von vorher.
    const falsch = stepDurationForAnimation(30, periods.length)
    const sFalsch = { ...s, stepDuration: falsch }
    expect(totalDurationSec(sFalsch, effectivePeriodCount(periods, 'interpolate'))).toBeGreaterThan(50)
  })
})
