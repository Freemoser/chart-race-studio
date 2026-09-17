import type { StageColors } from './export/compose'

/** Liest die Bühnenfarben aus den Brand-Tokens (CSS-Variablen). */
export function stageColors(theme: 'light' | 'dark'): StageColors {
  const cs = getComputedStyle(document.documentElement)
  const v = (n: string, fb: string) => cs.getPropertyValue(n).trim() || fb
  return theme === 'dark'
    ? { bg: v('--stage-bg-dark', '#0f1418'), fg: v('--stage-fg-dark', '#f2f4f7'), muted: v('--stage-muted-dark', '#98a2ad'), accent: v('--brand-accent', '#e36414') }
    : { bg: v('--stage-bg-light', '#ffffff'), fg: v('--stage-fg-light', '#1c2229'), muted: v('--stage-muted-light', '#6b7680'), accent: v('--brand-accent', '#e36414') }
}

export function brandFontFamily(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--brand-font').trim() || 'system-ui, sans-serif'
}
