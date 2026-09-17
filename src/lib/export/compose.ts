import type { StageLayout } from '../layout'
import type { ChartSettings } from '../settings'

export interface StageColors { bg: string; fg: string; muted: string; accent: string }

/** Zeichnet Hintergrund, Texte und Wasserzeichen – exakt wie die DOM-Vorschau. */
export function drawChrome(
  ctx: CanvasRenderingContext2D,
  layout: StageLayout,
  s: ChartSettings,
  colors: StageColors,
  family: string,
  dateLabel: string,
  logo: HTMLImageElement | ImageBitmap | null,
) {
  const { width: W, height: H } = layout
  ctx.save()
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'alphabetic'

  if (layout.title) {
    ctx.fillStyle = colors.fg
    ctx.font = `700 ${layout.title.size}px ${family}`
    ctx.textAlign = layout.title.align
    layout.title.lines.forEach((line, i) => ctx.fillText(line, layout.title!.x, layout.title!.y + layout.title!.size * 0.92 + i * layout.title!.lineHeight))
  }
  if (layout.subtitle) {
    ctx.fillStyle = colors.muted
    ctx.font = `400 ${layout.subtitle.size}px ${family}`
    ctx.textAlign = layout.subtitle.align
    layout.subtitle.lines.forEach((line, i) => ctx.fillText(line, layout.subtitle!.x, layout.subtitle!.y + layout.subtitle!.size * 0.95 + i * layout.subtitle!.lineHeight))
  }
  if (layout.date && s.showDate) {
    ctx.fillStyle = colors.fg
    ctx.globalAlpha = 0.85
    ctx.font = `700 ${layout.date.size}px ${family}`
    ctx.textAlign = 'right'
    ctx.fillText(dateLabel, layout.date.x, layout.date.y)
    ctx.globalAlpha = 1
  }
  if (layout.caption) {
    ctx.fillStyle = colors.muted
    ctx.font = `400 ${layout.caption.size}px ${family}`
    ctx.textAlign = 'left'
    layout.caption.lines.forEach((line, i) => ctx.fillText(line, layout.caption!.x, layout.caption!.y + i * layout.caption!.lineHeight))
  }
  if (layout.watermark && s.watermarkEnabled) {
    const wm = layout.watermark
    ctx.globalAlpha = s.watermarkOpacity
    ctx.fillStyle = colors.fg
    ctx.font = `600 ${wm.size}px ${family}`
    ctx.textAlign = wm.anchor === 'end' ? 'right' : 'left'
    const baselineY = wm.baseline === 'bottom' ? wm.y : wm.y + wm.size * 0.9
    const textW = ctx.measureText(s.watermarkText).width
    let textX = wm.x
    if (logo) {
      const ls = wm.logoSize
      const logoY = wm.baseline === 'bottom' ? wm.y - ls * 0.85 : wm.y - ls * 0.05
      const gap = wm.size * 0.5
      if (wm.anchor === 'end') {
        // Logo links vom Text
        ctx.drawImage(logo, wm.x - textW - gap - ls, logoY, ls, ls)
      } else {
        ctx.drawImage(logo, wm.x, logoY, ls, ls)
        textX = wm.x + ls + gap
      }
    }
    if (s.watermarkText) ctx.fillText(s.watermarkText, textX, baselineY)
    ctx.globalAlpha = 1
  }
  ctx.restore()
}
