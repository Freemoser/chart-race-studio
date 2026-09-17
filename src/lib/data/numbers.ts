/** Robustes Parsen von Zahlen in deutscher und englischer Schreibweise. */
export function parseNumber(v: string | number | null | undefined): number | null {
  if (v == null) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  let s = String(v).trim()
  if (!s) return null
  s = s.replace(/\s| |'/g, '') // Leerzeichen / Apostroph als Tausendertrenner
  s = s.replace(/[€$£%]|EUR|USD/gi, '')
  if (!s) return null
  const hasComma = s.includes(',')
  const hasDot = s.includes('.')
  if (hasComma && hasDot) {
    // Letztes Trennzeichen ist das Dezimaltrennzeichen
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.')
    else s = s.replace(/,/g, '')
  } else if (hasComma) {
    // "1,234" könnte Tausender sein, "1,5" Dezimal. Heuristik: genau 3 Nachkommastellen und mehrere Gruppen => Tausender
    const parts = s.split(',')
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && parts[0].length > 0 && /^\d+$/.test(parts[0]) && parts[0].length <= 3 && false)) s = parts.join('')
    else s = s.replace(',', '.')
  } else if (hasDot) {
    const parts = s.split('.')
    // "1.234.567" => Tausenderpunkte
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3 && /^\d{1,3}$/.test(parts[0]) && parts[0] !== '0')) s = parts.join('')
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export interface NumberFormatSettings {
  decimals: number
  thousands: boolean
  prefix: string
  suffix: string
  locale: string
  /** Große Zahlen kompakt (1,2 Mio.) */
  compact: boolean
}

export function formatValue(v: number, f: NumberFormatSettings): string {
  const opts: Intl.NumberFormatOptions = {
    minimumFractionDigits: f.decimals,
    maximumFractionDigits: f.decimals,
    useGrouping: f.thousands,
  }
  if (f.compact) {
    opts.notation = 'compact'
    opts.compactDisplay = 'short'
    opts.minimumFractionDigits = 0
    opts.maximumFractionDigits = Math.max(1, f.decimals)
  }
  const s = new Intl.NumberFormat(f.locale, opts).format(v)
  return `${f.prefix}${s}${f.suffix}`
}
