import { useEffect, useState } from 'react'
import { Database, Map, Palette, Share2 } from 'lucide-react'
import { useApp } from '@/state/store'
import { Stage } from '@/components/Stage'
import { Transport } from '@/components/Transport'
import { DataPanel } from '@/components/DataPanel'
import { DesignPanel } from '@/components/DesignPanel'
import { ExportPanel } from '@/components/ExportPanel'
import { Roadmap } from '@/components/Roadmap'
import { Consent } from '@/components/Consent'
import { FEATURES } from '@/content/site'
import { Wordmark } from '@/components/ui'
import type { BrandId } from '@/lib/fonts'

type Tab = 'data' | 'design' | 'export'
type View = 'studio' | 'roadmap'

/** Ansicht steht im Hash, damit Redaktionsplan und Rechtstexte verlinkbar sind. */
function viewFromHash(): View {
  const h = window.location.hash
  if (h.startsWith('#redaktionsplan')) return 'roadmap'
  return 'studio'
}
const HASH: Record<View, string> = { studio: '', roadmap: '#redaktionsplan' }

export default function App() {
  const brand = useApp((s) => s.brand)
  const setBrand = useApp((s) => s.setBrand)
  const [tab, setTab] = useState<Tab>('data')
  const [view, setView] = useState<View>(viewFromHash)

  useEffect(() => { document.documentElement.dataset.brand = brand }, [brand])
  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function zeige(v: View) {
    setView(v)
    window.location.hash = HASH[v]
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
        <Wordmark />
        <div className="flex items-center gap-2">
          <div className="seg" role="group" aria-label="Ansicht">
            <button type="button" aria-pressed={view === 'studio'} onClick={() => zeige('studio')}>Studio</button>
            <button type="button" aria-pressed={view === 'roadmap'} onClick={() => zeige('roadmap')} className="whitespace-nowrap">
              <Map size={14} aria-hidden /> Redaktionsplan
            </button>
          </div>
          <label className="hidden items-center gap-2 text-xs text-ink-muted sm:flex">
            Design-Richtung
            <select className="input !w-auto !py-1" value={brand} onChange={(e) => setBrand(e.target.value as BrandId)} aria-label="Design-Richtung">
              <option value="klar">Klar (Inter)</option>
              <option value="editorial">Editorial (IBM Plex)</option>
              <option value="signal">Signal (Manrope)</option>
            </select>
          </label>
        </div>
      </header>

      {view === 'roadmap' ? (
        <main className="min-h-0 flex-1 overflow-y-auto bg-surface-2/40">
          <Roadmap onOpenStudio={() => zeige('studio')} />
        </main>
      ) : (
      <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
        <section className="flex min-h-[46vh] flex-col gap-3 p-3 lg:min-h-0 lg:p-5">
          <div className="min-h-0 flex-1 rounded-[var(--radius-brand)] bg-surface-2/60 p-3 lg:p-5">
            <Stage />
          </div>
          <Transport />
        </section>

        <aside className="flex min-h-0 flex-col border-t border-line bg-surface lg:border-l lg:border-t-0">
          <nav className="grid grid-cols-3 border-b border-line" aria-label="Bereiche">
            {([
              ['data', 'Daten', Database],
              ['design', 'Gestaltung', Palette],
              ['export', 'Export', Share2],
            ] as const).map(([id, label, Icon]) => (
              <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={`flex min-h-12 items-center justify-center gap-2 text-sm font-medium transition-colors ${tab === id ? 'border-b-2 border-primary text-primary' : 'text-ink-muted hover:text-ink'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === 'data' && <DataPanel />}
            {tab === 'design' && <DesignPanel />}
            {tab === 'export' && <ExportPanel />}
          </div>
          <footer className="border-t border-line px-4 py-2 text-[11px] leading-snug text-ink-faint">
            Läuft komplett im Browser, keine Daten verlassen das Gerät. Diagramm-Animation mit{' '}
            <a className="underline hover:text-ink" href="https://github.com/hatemhosny/racing-bars" target="_blank" rel="noreferrer">racing-bars</a> (MIT). Open Source unter MIT.
            <br />
            <a className="underline hover:text-ink" href="#redaktionsplan">Redaktionsplan</a>
            {' · '}
            <a className="underline hover:text-ink" href="artikel/tierarztketten-deutschland.html">Tierarztketten</a>
            {' · '}
            <a className="underline hover:text-ink" href="artikel/datenherkunft.html">Datenherkunft</a>
            {' · '}
            <a className="underline hover:text-ink" href="impressum.html">Impressum</a>
            {' · '}
            <a className="underline hover:text-ink" href="datenschutz.html">Datenschutz</a>
            {FEATURES.gaId && <>{' · '}<button type="button" data-consent-reset className="underline hover:text-ink">Cookie-Auswahl</button></>}
          </footer>
        </aside>
      </main>
      )}
      <Consent />
    </div>
  )
}
