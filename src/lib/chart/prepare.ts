import type { Dataset } from '../data/types'
import { fillAndInterpolate } from '../data/transform'
import type { ChartSettings } from '../settings'
import { paletteColor } from '../palettes'
import type { ChartInput } from './types'
import type { Rect } from '../layout'

/**
 * Baut aus Datensatz + Einstellungen die Eingabe für die Chart-Renderer.
 * Wird identisch für Vorschau und Export benutzt.
 */
export function prepareChartInput(ds: Dataset, s: ChartSettings, chart: Rect, labelSize: number, fontFamily: string): ChartInput {
  const { periods, rows } = fillAndInterpolate(ds, s.gapFill, s.chartType === 'bar' ? s.subSteps : 1, s.chartType === 'bar')
  const colors: Record<string, string> = {}
  const images: Record<string, string> = {}
  ds.names.forEach((n, i) => {
    colors[n] = s.categories[n]?.color ?? paletteColor(s.paletteId, i)
    const img = s.categories[n]?.image
    if (img) images[n] = img
  })
  return {
    periods,
    rows,
    names: ds.names,
    colors,
    images,
    showImages: s.showImages,
    imageScale: s.imageScale,
    width: Math.round(chart.w),
    height: Math.round(chart.h),
    topN: Math.max(1, Math.min(s.topN, ds.names.length)),
    fixedScale: s.fixedScale,
    labelsPosition: s.labelsPosition,
    labelSize,
    fontFamily,
    theme: s.theme,
    numberFormat: { decimals: s.decimals, thousands: s.thousands, prefix: s.prefix, suffix: s.suffix, locale: 'de-DE', compact: s.compact },
    secondaryAxis: s.chartType === 'line' ? s.secondaryAxis.filter((n) => ds.names.includes(n)) : [],
    secondaryFormat: { decimals: s.secondaryDecimals, thousands: s.thousands, prefix: '', suffix: s.secondarySuffix, locale: 'de-DE', compact: false },
    primaryAxisLabel: s.primaryAxisLabel,
    divergingAt: s.divergingAt,
    divergingLabels: s.divergingLabels,
    secondaryAxisLabel: s.secondaryAxisLabel,
    barRounding: s.barRounding,
    tickDuration: Math.max(1, Math.round(s.stepDuration / (s.chartType === 'bar' ? s.subSteps : 1))),
  }
}

/** Anzahl echter Perioden (für Videolänge) */
export const realPeriodCount = (ds: Dataset | null) => ds?.periods.length ?? 0
