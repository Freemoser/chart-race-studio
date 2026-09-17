import { useRef } from 'react'
import { BarChart3, ImagePlus, LineChart, Moon, Sun, X } from 'lucide-react'
import { useApp } from '@/state/store'
import { FORMATS, formatById } from '@/lib/formats'
import { PALETTES } from '@/lib/palettes'
import { DATE_TEMPLATES } from '@/lib/data/dates'
import { animationDurationSec, stepDurationForAnimation, totalDurationSec } from '@/lib/settings'
import { CategoryList } from './CategoryList'
import { Field, NumberInput, Section, Segmented, Slider, Toggle } from './ui'

export function DesignPanel() {
  const settings = useApp((s) => s.settings)
  const dataset = useApp((s) => s.dataset)
  const update = useApp((s) => s.updateSettings)
  const logoRef = useRef<HTMLInputElement>(null)
  const periods = dataset?.periods.length ?? 0
  const total = totalDurationSec(settings, periods)
  const anim = animationDurationSec(settings, periods)
  const kind = dataset?.periods[0]?.kind ?? 'year'
  const templates = DATE_TEMPLATES.filter((t) => t.forKinds.includes(kind))

  return (
    <div>
      <Section title="Format & Diagrammtyp">
        <div className="grid grid-cols-4 gap-1.5">
          {FORMATS.map((f) => (
            <button key={f.id} type="button" aria-pressed={settings.format === f.id} onClick={() => update({ format: f.id, topN: f.preset.topN })} className={`card flex flex-col items-center gap-1 px-1 py-2 text-xs transition-colors hover:border-primary ${settings.format === f.id ? '!border-primary bg-accent-soft/40' : ''}`}>
              <span className="flex h-8 items-center"><span className="block rounded-[2px] border-2 border-current" style={{ width: (f.width / f.height) * 20 > 30 ? 30 : Math.max(11, (f.width / f.height) * 20), height: (f.width / f.height) * 20 > 30 ? 30 / (f.width / f.height) : 20 }} /></span>
              <b>{f.label}</b>
              <span className="text-[10px] leading-tight text-ink-faint">{f.hint}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Segmented value={settings.chartType} onChange={(chartType) => update({ chartType })} ariaLabel="Diagrammtyp" options={[
            { value: 'bar', label: <span className="inline-flex items-center gap-1.5"><BarChart3 size={15} /> Bar Race</span> },
            { value: 'line', label: <span className="inline-flex items-center gap-1.5"><LineChart size={15} /> Line Race</span> },
          ]} />
          <Segmented value={settings.theme} onChange={(theme) => update({ theme })} ariaLabel="Farbschema" options={[
            { value: 'light', label: <Sun size={15} />, title: 'Hell' },
            { value: 'dark', label: <Moon size={15} />, title: 'Dunkel' },
          ]} />
        </div>
      </Section>

      <Section title="Zeit & Ablauf" hint={`${total.toFixed(1)} s gesamt`}>
        <Slider label="Animationsdauer" value={Math.round(anim * 2) / 2} min={2} max={120} step={0.5} onChange={(v) => update({ stepDuration: stepDurationForAnimation(v, periods) })} format={(v) => `${v.toFixed(1)} s`} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Animationsdauer (s)">
            <NumberInput value={Math.round(anim * 10) / 10} min={1} max={900} step={0.5} suffix="s" onChange={(v) => update({ stepDuration: stepDurationForAnimation(v, periods) })} />
          </Field>
          <Field label="Dauer je Zeitschritt">
            <NumberInput value={settings.stepDuration} min={40} max={20000} step={50} suffix="ms" onChange={(stepDuration) => update({ stepDuration })} />
          </Field>
          <Field label="Standbild Anfang">
            <NumberInput value={settings.holdStart} min={0} max={30} step={0.5} suffix="s" onChange={(holdStart) => update({ holdStart })} />
          </Field>
          <Field label="Standbild Ende">
            <NumberInput value={settings.holdEnd} min={0} max={60} step={0.5} suffix="s" onChange={(holdEnd) => update({ holdEnd })} />
          </Field>
        </div>
        {settings.chartType === 'bar' && (
          <Slider label="Zwischenschritte je Periode" value={settings.subSteps} min={1} max={8} onChange={(subSteps) => update({ subSteps })} format={(v) => (v === 1 ? 'keine' : `${v}×`)} />
        )}
        <Toggle label="Vorschau in Schleife" checked={settings.loopPreview} onChange={(loopPreview) => update({ loopPreview })} />
        <p className="text-[12px] text-ink-muted tabular-nums">
          Video gesamt: <b className="text-ink">{total.toFixed(1)} s</b> = {settings.holdStart.toFixed(1)} s Standbild + {anim.toFixed(1)} s Animation ({Math.max(0, periods - 1)} Zeitschritte) + {settings.holdEnd.toFixed(1)} s Standbild
        </p>
        <p className="text-[11px] leading-snug text-ink-faint">Die Standbilder sind Teil der Videodatei und in der Gesamtlänge enthalten. Zwischenschritte lassen Platzwechsel genau dann passieren, wenn sich die Werte tatsächlich kreuzen.</p>
      </Section>

      <Section title="Texte">
        <Field label="Titel"><input className="input" value={settings.title} onChange={(e) => update({ title: e.target.value })} /></Field>
        <Field label="Untertitel"><input className="input" value={settings.subtitle} onChange={(e) => update({ subtitle: e.target.value })} /></Field>
        <Field label="Quellenangabe"><input className="input" value={settings.source} onChange={(e) => update({ source: e.target.value })} placeholder="Quelle: …" /></Field>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Field label="Ausrichtung" inline>
            <Segmented value={settings.titleAlign} onChange={(titleAlign) => update({ titleAlign })} options={[{ value: 'left', label: 'Links' }, { value: 'center', label: 'Zentriert' }]} />
          </Field>
        </div>
        <Toggle label="Periode anzeigen (Datumszähler)" checked={settings.showDate} onChange={(showDate) => update({ showDate })} />
        {settings.showDate && (
          <Field label="Datumsformat">
            <select className="input" value={settings.dateTemplate} onChange={(e) => update({ dateTemplate: e.target.value })}>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              {!templates.find((t) => t.id === settings.dateTemplate) && <option value={settings.dateTemplate}>{settings.dateTemplate}</option>}
            </select>
          </Field>
        )}
      </Section>

      <Section title="Balken & Beschriftung">
        <Slider label={settings.chartType === 'bar' ? 'Sichtbare Balken (Top N)' : 'Hervorgehobene Linien (Top N)'} value={settings.topN} min={1} max={Math.max(3, Math.min(30, dataset?.names.length ?? 12))} onChange={(topN) => update({ topN })} />
        {settings.chartType === 'bar' && (
          <Field label="Kategorie-Labels" inline>
            <Segmented value={settings.labelsPosition} onChange={(labelsPosition) => update({ labelsPosition })} options={[{ value: 'outside', label: 'Außerhalb links' }, { value: 'inside', label: 'Im Balken' }]} />
          </Field>
        )}
        {settings.chartType === 'bar' && <Slider label="Eckenrundung" value={settings.barRounding} min={0} max={1} step={0.05} onChange={(barRounding) => update({ barRounding })} format={(v) => `${Math.round(v * 100)} %`} />}
        {settings.chartType === 'bar' ? (
          <Toggle label="Feste Achse (kein Mitwachsen)" checked={settings.fixedScale} onChange={(fixedScale) => update({ fixedScale })} />
        ) : (
          <p className="text-[11px] text-ink-faint">Die Y-Achsen des Line Race sind über den gesamten Zeitraum fest, damit die Skala nicht springt.</p>
        )}
        {settings.chartType === 'line' && (
          <div className="flex flex-col gap-2 rounded-md border border-line p-2.5">
            <p className="text-xs text-ink-muted">Zweite Y-Achse: Kategorien unter „Farben & Bilder“ mit <b>Y2</b> auf die rechte Achse legen (gestrichelt). Praktisch für Vergleiche mit anderer Einheit.</p>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Titel linke Achse"><input className="input" value={settings.primaryAxisLabel} onChange={(e) => update({ primaryAxisLabel: e.target.value })} placeholder="z.B. Personen" /></Field>
              <Field label="Titel rechte Achse"><input className="input" value={settings.secondaryAxisLabel} onChange={(e) => update({ secondaryAxisLabel: e.target.value })} placeholder="z.B. Heimtiere in Mio." /></Field>
              <Field label="Dezimalstellen rechts"><NumberInput value={settings.secondaryDecimals} min={0} max={4} onChange={(secondaryDecimals) => update({ secondaryDecimals })} /></Field>
              <Field label="Suffix rechts"><input className="input" value={settings.secondarySuffix} onChange={(e) => update({ secondarySuffix: e.target.value })} placeholder=" Mio." /></Field>
            </div>
            <p className="text-[11px] text-ink-faint">{settings.secondaryAxis.length} Kategorie(n) auf der rechten Achse.</p>
          </div>
        )}
        <Field label="Datenlücken auffüllen">
          <Segmented value={settings.gapFill} onChange={(gapFill) => update({ gapFill })} options={[{ value: 'interpolate', label: 'Interpolieren' }, { value: 'last', label: 'Letzten Wert' }, { value: 'none', label: 'Nicht' }]} />
        </Field>
      </Section>

      <Section title="Farben & Bilder">
        <Field label="Palette">
          <div className="grid grid-cols-3 gap-1.5">
            {PALETTES.map((p) => (
              <button key={p.id} type="button" aria-pressed={settings.paletteId === p.id} onClick={() => update({ paletteId: p.id })} className={`card flex flex-col gap-1 p-1.5 text-left text-[11px] hover:border-primary ${settings.paletteId === p.id ? '!border-primary' : ''}`}>
                <span className="flex h-3 overflow-hidden rounded-sm">{p.colors.slice(0, 8).map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </Field>
        <Toggle label="Bilder/Flaggen anzeigen" checked={settings.showImages} onChange={(showImages) => update({ showImages })} />
        {settings.showImages && <Slider label="Bildgröße" value={settings.imageScale} min={0.5} max={1.5} step={0.05} onChange={(imageScale) => update({ imageScale })} format={(v) => `${Math.round(v * 100)} %`} />}
        <CategoryList />
      </Section>

      <Section title="Zahlenformat" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dezimalstellen"><NumberInput value={settings.decimals} min={0} max={4} onChange={(decimals) => update({ decimals })} /></Field>
          <Field label="Präfix"><input className="input" value={settings.prefix} onChange={(e) => update({ prefix: e.target.value })} placeholder="z.B. € " /></Field>
          <Field label="Suffix / Einheit"><input className="input" value={settings.suffix} onChange={(e) => update({ suffix: e.target.value })} placeholder="z.B.  Mio." /></Field>
        </div>
        <Toggle label="Tausendertrennzeichen" checked={settings.thousands} onChange={(thousands) => update({ thousands })} />
        <Toggle label="Kompakt (1,2 Mio.)" checked={settings.compact} onChange={(compact) => update({ compact })} />
      </Section>

      <Section title="Wasserzeichen" hint={settings.watermarkEnabled ? 'aktiv' : 'aus'}>
        <Toggle label="Wasserzeichen einbrennen" checked={settings.watermarkEnabled} onChange={(watermarkEnabled) => update({ watermarkEnabled })} />
        {settings.watermarkEnabled && (
          <>
            <Field label="Name / Handle"><input className="input" value={settings.watermarkText} onChange={(e) => update({ watermarkText: e.target.value })} /></Field>
            <Field label="Logo">
              <div className="flex items-center gap-2">
                {settings.watermarkLogo ? (
                  <>
                    <img src={settings.watermarkLogo} alt="" className="h-9 w-9 rounded object-contain ring-1 ring-line" />
                    <button type="button" className="btn-ghost !min-h-9" onClick={() => update({ watermarkLogo: undefined })}><X size={14} /> Entfernen</button>
                  </>
                ) : (
                  <button type="button" className="btn-ghost !min-h-9" onClick={() => logoRef.current?.click()}><ImagePlus size={15} /> Logo hochladen</button>
                )}
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files?.[0]; if (!f) return
                  const bmp = await createImageBitmap(f); const c = document.createElement('canvas'); const sc = Math.min(1, 512 / Math.max(bmp.width, bmp.height))
                  c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc); c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
                  update({ watermarkLogo: c.toDataURL('image/png') }); e.target.value = ''
                }} />
              </div>
            </Field>
            <Field label="Position">
              <Segmented value={settings.watermarkPosition} onChange={(watermarkPosition) => update({ watermarkPosition })} options={[
                { value: 'top-left', label: '↖' }, { value: 'top-right', label: '↗' }, { value: 'bottom-left', label: '↙' }, { value: 'bottom-right', label: '↘' },
              ]} />
            </Field>
            <Slider label="Deckkraft" value={settings.watermarkOpacity} min={0.1} max={1} step={0.05} onChange={(watermarkOpacity) => update({ watermarkOpacity })} format={(v) => `${Math.round(v * 100)} %`} />
            <Slider label="Größe" value={settings.watermarkScale} min={0.6} max={1.8} step={0.05} onChange={(watermarkScale) => update({ watermarkScale })} format={(v) => `${Math.round(v * 100)} %`} />
          </>
        )}
      </Section>
      <div className="px-4 py-3 text-[11px] text-ink-faint">Format {formatById(settings.format).width}×{formatById(settings.format).height}, 30 fps, H.264 MP4.</div>
    </div>
  )
}
