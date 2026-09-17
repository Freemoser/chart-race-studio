export type FormatId = '16:9' | '1:1' | '4:5' | '9:16'

export interface VideoFormat {
  id: FormatId
  label: string
  hint: string
  width: number
  height: number
  /** Typografie- und Layout-Preset für dieses Format */
  preset: FormatPreset
}

export interface FormatPreset {
  padding: number
  titleSize: number
  subtitleSize: number
  captionSize: number
  dateSize: number
  /** Basisschriftgröße der Balkenbeschriftung (Label/Wert) */
  labelSize: number
  topN: number
  watermarkSize: number
  /** Datumszähler oben rechts (true) oder unten rechts im Diagramm (false) */
  dateTopRight: boolean
}

export const FORMATS: VideoFormat[] = [
  {
    id: '16:9', label: '16:9', hint: 'YouTube, Desktop', width: 1920, height: 1080,
    preset: { padding: 72, titleSize: 52, subtitleSize: 28, captionSize: 20, dateSize: 92, labelSize: 26, topN: 10, watermarkSize: 22, dateTopRight: true },
  },
  {
    id: '1:1', label: '1:1', hint: 'Feed-Posts, sicher überall', width: 1080, height: 1080,
    preset: { padding: 56, titleSize: 44, subtitleSize: 24, captionSize: 18, dateSize: 80, labelSize: 22, topN: 10, watermarkSize: 20, dateTopRight: true },
  },
  {
    id: '4:5', label: '4:5', hint: 'LinkedIn & Instagram Feed', width: 1080, height: 1350,
    preset: { padding: 56, titleSize: 46, subtitleSize: 25, captionSize: 18, dateSize: 84, labelSize: 23, topN: 12, watermarkSize: 20, dateTopRight: true },
  },
  {
    id: '9:16', label: '9:16', hint: 'TikTok, Reels, Stories', width: 1080, height: 1920,
    preset: { padding: 64, titleSize: 54, subtitleSize: 28, captionSize: 20, dateSize: 96, labelSize: 26, topN: 12, watermarkSize: 22, dateTopRight: false },
  },
]

export const formatById = (id: FormatId) => FORMATS.find((f) => f.id === id) ?? FORMATS[0]
