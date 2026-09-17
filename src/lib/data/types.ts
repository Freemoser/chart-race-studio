/**
 * Zentrale Datentypen der Datenpipeline.
 *
 * Intern arbeiten wir immer im "long"-Format: eine Zeile je (Periode, Kategorie).
 * Perioden werden auf ein sortierbares ISO-Datum abgebildet, behalten aber ihr
 * ursprüngliches Label (z.B. "2019", "Q3 2021", "März 2020").
 */

export interface Period {
  /** ISO-Datum (YYYY-MM-DD), sortierbar und von racing-bars verstanden */
  iso: string
  /** Original-Label aus den Daten, z.B. "2019" oder "Q1 2020" */
  label: string
  /** Erkannte Granularität */
  kind: 'year' | 'quarter' | 'month' | 'day' | 'ordinal'
  /** Echte Periode (true) oder von uns eingefügter Zwischenschritt (false) */
  real: boolean
  /** Für Zwischenschritte: Fortschritt 0..1 zwischen der echten Periode und der nächsten */
  fraction: number
}

export interface LongRow {
  date: string // ISO-Datum (Period.iso)
  name: string
  value: number
}

export type RawTable = {
  headers: string[]
  rows: (string | number | null)[][]
  /** Quelle, nur zur Anzeige */
  sourceName?: string
}

export type DataShape = 'wide' | 'long'

export interface ColumnMapping {
  shape: DataShape
  /** long: Spalte mit der Periode; wide: Spalte mit der Periode (Zeilen = Perioden) */
  timeColumn: number
  /** long: Spalte mit dem Kategorienamen */
  categoryColumn?: number
  /** long: Spalte mit dem Wert */
  valueColumn?: number
  /** wide: Spalten, die Kategorien sind (alle außer timeColumn) */
  categoryColumns?: number[]
  /** wide, transponiert: erste Spalte = Kategorien, Header = Perioden */
  transposed?: boolean
}

export type GapFill = 'none' | 'last' | 'interpolate'

export interface DataIssue {
  level: 'error' | 'warning'
  message: string
  /** 0-basierte Zeile im Rohdatensatz, falls zutreffend */
  row?: number
}

export interface Dataset {
  periods: Period[] // sortiert, nur echte Perioden
  names: string[] // alle Kategorien in Reihenfolge des ersten Auftretens
  rows: LongRow[]
  issues: DataIssue[]
}

/** Rubriken, nach denen die Beispiele in der Oberfläche gruppiert werden. */
export const SAMPLE_CATEGORIES = [
  { id: 'praxis', label: 'Tierarztpraxen & Beruf' },
  { id: 'heimtiere', label: 'Heimtiere & Markt' },
  { id: 'nutztiere', label: 'Nutztiere' },
] as const

export type SampleCategory = (typeof SAMPLE_CATEGORIES)[number]['id']

export interface SampleDataset {
  id: string
  category: SampleCategory
  title: string
  subtitle: string
  source: string
  sourceUrl: string
  unit: string
  /** Ein Satz für die Karte in der Oberfläche – bewusst kurz */
  description: string
  /**
   * Ausführliche Datenkunde: Abgrenzung, Lücken, Methodenbrüche, Schätzungen.
   * Wird in der Oberfläche erst auf Klick gezeigt, damit die Kacheln kurz bleiben.
   */
  dataInfo?: string[]
  /**
   * Wann der Datensatz recherchiert und wann er zuletzt gegen die Quelle geprüft wurde (ISO).
   * Grundlage für den jährlichen Aktualisierungslauf: Was länger als ein Jahr ungeprüft ist,
   * wird vor der Wiederverwendung noch einmal gegen die Quelle gehalten.
   */
  erstellt?: string
  geprueft?: string
  /** true, wenn Zahlen nicht belastbar recherchiert werden konnten */
  isExample?: boolean
  headers: string[]
  rows: (string | number | null)[][]
  /** Empfohlene Voreinstellungen */
  suggested?: {
    topN?: number
    decimals?: number
    suffix?: string
    chartType?: 'bar' | 'line'
    labelsPosition?: 'inside' | 'outside'
    dateFormat?: string
    /** Line Race: Kategorien auf der rechten Achse */
    secondaryAxis?: string[]
    secondaryDecimals?: number
    secondarySuffix?: string
    primaryAxisLabel?: string
    secondaryAxisLabel?: string
    /** Gewünschte Animationsdauer in Sekunden */
    animationSec?: number
  }
}
