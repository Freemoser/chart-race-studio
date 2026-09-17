import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColumnMapping, Dataset, RawTable, SampleDataset } from '@/lib/data/types'
import { detectMapping } from '@/lib/data/detect'
import { buildDataset, effectivePeriodCount } from '@/lib/data/transform'
import { DEFAULT_ANIMATION_SEC, DEFAULT_HOLD_END, DEFAULT_SETTINGS, stepDurationForAnimation, type ChartSettings } from '@/lib/settings'
import type { BrandId } from '@/lib/fonts'
import { defaultTemplateFor } from '@/lib/data/dates'
import { formatById } from '@/lib/formats'

export interface AppState {
  brand: BrandId
  setBrand: (b: BrandId) => void

  table: RawTable | null
  mapping: ColumnMapping | null
  dataset: Dataset | null
  loadedSampleId: string | null

  settings: ChartSettings
  updateSettings: (patch: Partial<ChartSettings>) => void
  setCategoryStyle: (name: string, patch: { color?: string; image?: string | null }) => void
  toggleSecondaryAxis: (name: string) => void
  resetCategoryStyles: () => void

  setTable: (table: RawTable, opts?: { keepSettings?: boolean }) => void
  setMapping: (mapping: ColumnMapping) => void
  loadSample: (sample: SampleDataset) => void
  updateCell: (row: number, col: number, value: string | null) => void
  addRow: () => void
  removeRow: (row: number) => void
  addColumn: () => void
  removeColumn: (col: number) => void
  renameColumn: (col: number, name: string) => void
  clearData: () => void

  previewPlaying: boolean
  setPreviewPlaying: (p: boolean) => void
  previewIndex: number
  setPreviewIndex: (i: number) => void
}

function rebuild(table: RawTable, mapping: ColumnMapping): Dataset {
  return buildDataset(table, mapping)
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      brand: 'klar',
      setBrand: (brand) => set({ brand }),

      table: null,
      mapping: null,
      dataset: null,
      loadedSampleId: null,

      settings: DEFAULT_SETTINGS,
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      toggleSecondaryAxis: (name) =>
        set((s) => {
          const set_ = new Set(s.settings.secondaryAxis)
          if (set_.has(name)) set_.delete(name)
          else set_.add(name)
          return { settings: { ...s.settings, secondaryAxis: [...set_] } }
        }),
      setCategoryStyle: (name, patch) =>
        set((s) => {
          const cur = { ...(s.settings.categories[name] ?? {}) }
          if (patch.color !== undefined) cur.color = patch.color
          if (patch.image === null) delete cur.image
          else if (patch.image !== undefined) cur.image = patch.image
          return { settings: { ...s.settings, categories: { ...s.settings.categories, [name]: cur } } }
        }),
      resetCategoryStyles: () => set((s) => ({ settings: { ...s.settings, categories: {} } })),

      setTable: (table, opts) => {
        const mapping = detectMapping(table)
        const dataset = rebuild(table, mapping)
        const kind = dataset.periods[0]?.kind ?? 'year'
        set((s) => ({
          table,
          mapping,
          dataset,
          loadedSampleId: null,
          settings: opts?.keepSettings
            ? s.settings
            : { ...s.settings, categories: {}, secondaryAxis: [], dateTemplate: defaultTemplateFor(kind), topN: Math.min(s.settings.topN, Math.max(3, dataset.names.length)), stepDuration: stepDurationForAnimation(DEFAULT_ANIMATION_SEC, effectivePeriodCount(dataset.periods, s.settings.gapFill)) },
        }))
      },
      setMapping: (mapping) => {
        const { table } = get()
        if (!table) return
        const dataset = rebuild(table, mapping)
        set({ mapping, dataset })
      },
      loadSample: (sample) => {
        const table: RawTable = { headers: sample.headers, rows: sample.rows, sourceName: sample.title }
        const mapping = detectMapping(table)
        const dataset = rebuild(table, mapping)
        const kind = dataset.periods[0]?.kind ?? 'year'
        const sug = sample.suggested ?? {}
        set((s) => ({
          table,
          mapping,
          dataset,
          loadedSampleId: sample.id,
          settings: {
            ...s.settings,
            categories: {},
            title: sample.title,
            subtitle: sample.subtitle,
            source: sample.source,
            dateTemplate: sug.dateFormat ?? defaultTemplateFor(kind),
            topN: sug.topN ?? formatById(s.settings.format).preset.topN,
            decimals: sug.decimals ?? 0,
            suffix: sug.suffix ?? '',
            prefix: '',
            compact: false,
            chartType: sug.chartType ?? s.settings.chartType,
            labelsPosition: sug.labelsPosition ?? s.settings.labelsPosition,
            showImages: false,
            secondaryAxis: sug.secondaryAxis ?? [],
            secondaryDecimals: sug.secondaryDecimals ?? 1,
            secondarySuffix: sug.secondarySuffix ?? '',
            primaryAxisLabel: sug.primaryAxisLabel ?? '',
            secondaryAxisLabel: sug.secondaryAxisLabel ?? '',
            stepDuration: stepDurationForAnimation(sug.animationSec ?? DEFAULT_ANIMATION_SEC, effectivePeriodCount(dataset.periods, DEFAULT_SETTINGS.gapFill)),
          },
        }))
      },
      updateCell: (row, col, value) => {
        const { table, mapping } = get()
        if (!table || !mapping) return
        const rows = table.rows.map((r, i) => (i === row ? r.map((c, j) => (j === col ? value : c)) : r))
        const t = { ...table, rows }
        set({ table: t, dataset: rebuild(t, mapping), loadedSampleId: null })
      },
      addRow: () => {
        const { table, mapping } = get()
        if (!table || !mapping) return
        const t = { ...table, rows: [...table.rows, table.headers.map(() => null)] }
        set({ table: t, dataset: rebuild(t, mapping) })
      },
      removeRow: (row) => {
        const { table, mapping } = get()
        if (!table || !mapping) return
        const t = { ...table, rows: table.rows.filter((_, i) => i !== row) }
        set({ table: t, dataset: rebuild(t, mapping) })
      },
      addColumn: () => {
        const { table } = get()
        if (!table) return
        const t: RawTable = { ...table, headers: [...table.headers, `Spalte ${table.headers.length + 1}`], rows: table.rows.map((r) => [...r, null]) }
        const mapping = detectMapping(t)
        set({ table: t, mapping, dataset: rebuild(t, mapping) })
      },
      removeColumn: (col) => {
        const { table } = get()
        if (!table || table.headers.length <= 2) return
        const t: RawTable = { ...table, headers: table.headers.filter((_, i) => i !== col), rows: table.rows.map((r) => r.filter((_, i) => i !== col)) }
        const mapping = detectMapping(t)
        set({ table: t, mapping, dataset: rebuild(t, mapping) })
      },
      renameColumn: (col, name) => {
        const { table, mapping } = get()
        if (!table || !mapping) return
        const old = table.headers[col]
        const t: RawTable = { ...table, headers: table.headers.map((h, i) => (i === col ? name : h)) }
        set((s) => {
          const categories = { ...s.settings.categories }
          if (categories[old]) { categories[name] = categories[old]; delete categories[old] }
          return { table: t, dataset: rebuild(t, mapping), settings: { ...s.settings, categories } }
        })
      },
      clearData: () => set({ table: null, mapping: null, dataset: null, loadedSampleId: null }),

      previewPlaying: false,
      setPreviewPlaying: (previewPlaying) => set({ previewPlaying }),
      previewIndex: 0,
      setPreviewIndex: (previewIndex) => set({ previewIndex }),
    }),
    {
      name: 'chart-race-studio',
      version: 2,
      // v2: neue Voreinstellung für das Standbild am Ende; einmalig auf den neuen Wert setzen.
      migrate: (persisted, from) => {
        const p = persisted as { settings?: Partial<ChartSettings> } | undefined
        if (from < 2 && p?.settings) p.settings.holdEnd = DEFAULT_HOLD_END
        return p as never
      },
      // Nur Einstellungen und Brand persistieren, keine Daten (können groß sein)
      partialize: (s) => ({ brand: s.brand, settings: { ...s.settings, categories: {}, watermarkLogo: undefined } }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined
        return { ...current, brand: p?.brand ?? current.brand, settings: { ...current.settings, ...(p?.settings ?? {}) } }
      },
    },
  ),
)
