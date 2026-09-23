import { type ReactNode, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SITE } from '@/content/site'

export function Section({ title, children, defaultOpen = true, hint }: { title: string; children: ReactNode; defaultOpen?: boolean; hint?: string }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border-b border-line last:border-b-0">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-4 py-3 text-left" aria-expanded={open}>
        <span className="text-sm font-semibold text-ink">{title}</span>
        <span className="flex items-center gap-2">
          {hint && <span className="text-xs text-ink-faint">{hint}</span>}
          <ChevronDown size={16} className={`text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open && <div className="flex flex-col gap-3 px-4 pb-4">{children}</div>}
    </section>
  )
}

export function Field({ label, children, inline }: { label: string; children: ReactNode; inline?: boolean }) {
  return inline ? (
    <label className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-ink-muted">{label}</span>
      {children}
    </label>
  ) : (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Segmented<T extends string>({ value, onChange, options, ariaLabel }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode; title?: string }[]; ariaLabel?: string }) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} title={o.title} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  const id = useId()
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 text-[13px]">
      <span className="text-ink-muted">{label}</span>
      <span className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-line'}`}>
        <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </span>
    </label>
  )
}

export function Slider({ label, value, min, max, step = 1, onChange, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  return (
    <label className="field">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="font-mono text-ink tabular-nums">{format ? format(value) : value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </label>
  )
}

export function NumberInput({ value, onChange, min, max, step = 1, suffix, className }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string; className?: string }) {
  return (
    <span className={`relative inline-flex items-center ${className ?? ''}`}>
      <input type="number" className="input pr-8 text-right tabular-nums" value={Number.isFinite(value) ? value : ''} min={min} max={max} step={step}
        onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v)) onChange(min !== undefined && v < min ? min : max !== undefined && v > max ? max : v) }} />
      {suffix && <span className="pointer-events-none absolute right-2 text-xs text-ink-faint">{suffix}</span>}
    </span>
  )
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill="var(--brand-primary)" />
        <rect x="6" y="7" width="16" height="3.2" rx="1.6" fill="#fff" />
        <rect x="6" y="12.4" width="11" height="3.2" rx="1.6" fill="var(--brand-accent)" />
        <rect x="6" y="17.8" width="7" height="3.2" rx="1.6" fill="#fff" opacity=".75" />
      </svg>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight text-ink">{SITE.name}</span>
          <span className="block text-[11px] font-medium tracking-wide text-ink-faint uppercase">Thomas Freimoser</span>
        </span>
      )}
    </span>
  )
}
