import type { LongRow, Period } from '../data/types'
import type { NumberFormatSettings } from '../data/numbers'

/** Alles, was ein Chart-Renderer braucht – unabhängig von React und Store. */
export interface ChartInput {
  periods: Period[] // inkl. Zwischenschritte, sortiert
  rows: LongRow[]
  names: string[]
  colors: Record<string, string>
  images: Record<string, string> // name -> Data-URL
  showImages: boolean
  imageScale: number
  width: number
  height: number
  topN: number
  fixedScale: boolean
  labelsPosition: 'inside' | 'outside'
  labelSize: number
  fontFamily: string
  theme: 'light' | 'dark'
  numberFormat: NumberFormatSettings
  /** Nur Line: Kategorien auf der rechten Achse + deren Format und Achsentitel */
  secondaryAxis: string[]
  secondaryFormat: NumberFormatSettings
  primaryAxisLabel: string
  secondaryAxisLabel: string
  barRounding: number
  /** Nur Map: Kipppunkt einer divergierenden Skala (z. B. 50 bei Anteilen in Prozent) */
  divergingAt?: number
  /** Dauer je Datum (Periode inkl. Zwischenschritt) in ms */
  tickDuration: number
}

export interface ChartHandle {
  /** Nur Bar (racing-bars): das Race-Objekt */
  kind: 'bar' | 'line' | 'map'
  /** Alle Datums-Strings in Reihenfolge */
  dates: string[]
  /** Zu einem Datum springen (Bar: mit Übergang, Line: sofort) */
  goTo: (index: number) => void
  /** Line und Map: kontinuierliche Position (Index mit Nachkommaanteil) */
  renderAt?: (t: number) => void
  play: () => void
  pause: () => void
  isRunning: () => boolean
  /** Aktueller Datums-Index */
  currentIndex: () => number
  onDateChange: (fn: (index: number, isLast: boolean) => void) => () => void
  svg: () => SVGSVGElement | null
  destroy: () => void
}
