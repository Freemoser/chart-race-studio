export interface Palette { id: string; label: string; colors: string[] }

export const PALETTES: Palette[] = [
  { id: 'freimoser', label: 'Freimoser', colors: ['#0F4C5C', '#E36414', '#5F9EA0', '#9A031E', '#FB8B24', '#2E6F95', '#B5838D', '#6D597A', '#3A7D44', '#C9A227', '#7B2CBF', '#495057'] },
  { id: 'nordic', label: 'Nordisch', colors: ['#2B3A55', '#5C7AEA', '#A5D7E8', '#E8AA42', '#CE7777', '#6B8E23', '#8E7DBE', '#3F979B', '#F2BE22', '#B04759', '#6C757D', '#19A7CE'] },
  { id: 'warm', label: 'Warm', colors: ['#B23A48', '#FCB9B2', '#FED0BB', '#8C2F39', '#461220', '#E07A5F', '#F2CC8F', '#81B29A', '#3D405B', '#F4F1DE', '#9C6644', '#DDB892'] },
  { id: 'clinic', label: 'Klinik', colors: ['#00778B', '#5CC8FF', '#004E64', '#9FFFCB', '#25A18E', '#7AE582', '#F26419', '#F6AE2D', '#33658A', '#86BBD8', '#2F4858', '#E63946'] },
  { id: 'mono', label: 'Monochrom', colors: ['#111827', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#1F2937', '#111827', '#374151', '#4B5563', '#6B7280', '#9CA3AF'] },
  { id: 'vivid', label: 'Kräftig', colors: ['#E63946', '#F4A261', '#2A9D8F', '#264653', '#E9C46A', '#8338EC', '#3A86FF', '#FF006E', '#FB5607', '#06D6A0', '#118AB2', '#073B4C'] },
]

export function paletteColor(paletteId: string, index: number): string {
  const p = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0]
  return p.colors[index % p.colors.length]
}
