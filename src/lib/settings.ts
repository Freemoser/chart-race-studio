import type { FormatId } from './formats'
import type { GapFill } from './data/types'

export type ChartType = 'bar' | 'line'
export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type TitleAlign = 'left' | 'center'

export interface CategoryStyle {
  color?: string
  /** Data-URL eines hochgeladenen Bildes oder Flaggen-Code (z.B. "flag:de") */
  image?: string
}

export interface ChartSettings {
  chartType: ChartType
  format: FormatId
  theme: 'light' | 'dark'

  // Zeit
  /** Dauer je Zeitschritt in ms (echte Periode) */
  stepDuration: number
  /** Zwischenschritte je Periode (1 = keine) */
  subSteps: number
  holdStart: number // Sekunden
  holdEnd: number // Sekunden
  loopPreview: boolean

  // Daten
  gapFill: GapFill
  topN: number
  fixedScale: boolean

  // Texte
  title: string
  subtitle: string
  source: string
  titleAlign: TitleAlign
  showDate: boolean
  dateTemplate: string

  // Darstellung
  paletteId: string
  categories: Record<string, CategoryStyle>
  labelsPosition: 'inside' | 'outside'
  showImages: boolean
  imageScale: number // 0.5 .. 1.5
  barRounding: number // 0..1 (nur Wrapper-CSS)

  // Line Race: Kategorien auf der rechten (zweiten) Y-Achse
  secondaryAxis: string[]
  primaryAxisLabel: string
  secondaryAxisLabel: string
  secondaryDecimals: number
  secondarySuffix: string

  // Zahlen
  decimals: number
  thousands: boolean
  prefix: string
  suffix: string
  compact: boolean

  // Wasserzeichen
  watermarkEnabled: boolean
  watermarkText: string
  watermarkLogo?: string
  watermarkPosition: Corner
  watermarkOpacity: number // 0..1
  watermarkScale: number // 0.6..1.6
}

/** Voreinstellungen für die Videolänge: 30 s Animation, 1 s Standbild am Anfang, 15 s am Ende. */
export const DEFAULT_ANIMATION_SEC = 30
export const DEFAULT_HOLD_START = 1
export const DEFAULT_HOLD_END = 15

export const DEFAULT_SETTINGS: ChartSettings = {
  chartType: 'bar',
  format: '16:9',
  theme: 'light',
  stepDuration: 1000,
  subSteps: 2,
  holdStart: DEFAULT_HOLD_START,
  holdEnd: DEFAULT_HOLD_END,
  loopPreview: true,
  gapFill: 'interpolate',
  topN: 10,
  fixedScale: false,
  title: '',
  subtitle: '',
  source: '',
  titleAlign: 'left',
  showDate: true,
  dateTemplate: 'YYYY',
  paletteId: 'freimoser',
  categories: {},
  labelsPosition: 'outside',
  showImages: false,
  imageScale: 1,
  barRounding: 0.15,
  secondaryAxis: [],
  primaryAxisLabel: '',
  secondaryAxisLabel: '',
  secondaryDecimals: 1,
  secondarySuffix: '',
  decimals: 0,
  thousands: true,
  prefix: '',
  suffix: '',
  compact: false,
  watermarkEnabled: true,
  watermarkText: 'Thomas Freimoser',
  watermarkPosition: 'bottom-right',
  watermarkOpacity: 0.7,
  watermarkScale: 1,
}

/** Reine Animationsdauer in Sekunden (ohne Standbilder) */
export function animationDurationSec(s: Pick<ChartSettings, 'stepDuration'>, realPeriodCount: number): number {
  return (Math.max(0, realPeriodCount - 1) * s.stepDuration) / 1000
}

/** Dauer je Zeitschritt für eine gewünschte Animationsdauer */
export function stepDurationForAnimation(animSec: number, realPeriodCount: number): number {
  const steps = Math.max(1, realPeriodCount - 1)
  return Math.max(40, Math.round((Math.max(0.5, animSec) * 1000) / steps))
}

/** Gesamtlänge des Videos in Sekunden inkl. Standbilder */
export function totalDurationSec(s: Pick<ChartSettings, 'stepDuration' | 'subSteps' | 'holdStart' | 'holdEnd'>, realPeriodCount: number): number {
  const steps = Math.max(0, realPeriodCount - 1)
  return s.holdStart + (steps * s.stepDuration) / 1000 + s.holdEnd
}

/** Gegenrichtung: gewünschte Gesamtlänge -> Dauer je Zeitschritt */
export function stepDurationForTotal(totalSec: number, s: Pick<ChartSettings, 'holdStart' | 'holdEnd'>, realPeriodCount: number): number {
  const steps = Math.max(1, realPeriodCount - 1)
  const anim = Math.max(0.5, totalSec - s.holdStart - s.holdEnd)
  return Math.max(40, Math.round((anim * 1000) / steps))
}
