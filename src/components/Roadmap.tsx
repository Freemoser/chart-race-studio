import { useMemo, useState } from 'react'
import { ArrowUpRight, CheckCircle2, CircleDashed, Clock3, Link2, PlayCircle } from 'lucide-react'
import { ARCS, POSTS, type DataStatus, type RoadmapPost } from '@/content/roadmap'
import { SAMPLES } from '@/samples'
import { useApp } from '@/state/store'
import { LEGAL, SITE } from '@/content/site'

const DATA_LABEL: Record<DataStatus, string> = {
  belegt: 'Daten belegt',
  teilweise: 'Daten teilweise',
  offen: 'Daten offen',
}
const DATA_CLASS: Record<DataStatus, string> = {
  belegt: 'border-primary/30 bg-primary/10 text-primary',
  teilweise: 'border-accent/40 bg-accent/10 text-accent',
  offen: 'border-line bg-surface-2 text-ink-muted',
}

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${className}`}>{children}</span>
}

export function Roadmap({ onOpenStudio }: { onOpenStudio: () => void }) {
  const loadSample = useApp((s) => s.loadSample)
  const updateSettings = useApp((s) => s.updateSettings)
  const [arc, setArc] = useState<string | 'alle'>('alle')

  const zahlen = useMemo(() => ({
    veroeffentlicht: POSTS.filter((p) => p.status === 'veroeffentlicht').length,
    belegt: POSTS.filter((p) => p.dataStatus === 'belegt').length,
    offen: POSTS.filter((p) => p.dataStatus !== 'belegt').length,
  }), [])

  const sichtbar = arc === 'alle' ? POSTS : POSTS.filter((p) => p.arc === arc)

  function imStudioOeffnen(post: RoadmapPost) {
    const sample = SAMPLES.find((s) => s.id === post.sampleId)
    if (!sample) return
    loadSample(sample)
    if (post.chart) updateSettings({ chartType: post.chart })
    onOpenStudio()
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8 lg:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink lg:text-3xl">Redaktionsplan: 30 Posts</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
          Eine Reihe über den Wandel der Kleintiermedizin in Deutschland, erzählt in 30 aufeinander aufbauenden LinkedIn-Posts.
          Jeder Post nennt seinen Datensatz und die Zahlen, die im Text stehen sollen. Veröffentlichte Beiträge werden hier verlinkt.
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div><dt className="text-ink-faint">Veröffentlicht</dt><dd className="text-lg font-semibold text-ink">{zahlen.veroeffentlicht} von {POSTS.length}</dd></div>
          <div><dt className="text-ink-faint">Mit belegtem Datensatz</dt><dd className="text-lg font-semibold text-ink">{zahlen.belegt}</dd></div>
          <div><dt className="text-ink-faint">Recherche offen</dt><dd className="text-lg font-semibold text-ink">{zahlen.offen}</dd></div>
        </dl>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setArc('alle')} aria-pressed={arc === 'alle'}
          className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${arc === 'alle' ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-ink-muted hover:text-ink'}`}>
          Alle Kapitel
        </button>
        {ARCS.map((a) => (
          <button key={a.id} type="button" onClick={() => setArc(a.id)} aria-pressed={arc === a.id} title={a.claim}
            className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${arc === a.id ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-ink-muted hover:text-ink'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {arc !== 'alle' && (
        <p className="mb-6 border-l-2 border-primary pl-4 text-sm italic text-ink-muted">{ARCS.find((a) => a.id === arc)?.claim}</p>
      )}

      {(arc === 'alle' || arc === 'ketten') && (
        <a href="artikel/tierarztketten-deutschland.html" className="card mb-6 block p-4 transition-colors hover:border-primary">
          <span className="text-[11px] font-medium tracking-wide text-ink-faint uppercase">Artikel</span>
          <span className="mt-1 block text-base font-semibold text-ink">Wer betreibt die Tierarztpraxen in Deutschland?</span>
          <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">
            Die Langfassung zu den Posts 5 bis 9: 13 Gruppen mit belegten Standortzahlen, die einzige verfügbare
            Gesamtzahl aus dem Tierärzte Atlas und die Abgrenzung zu Einkaufsnetzwerken wie VetFamily.
          </span>
        </a>
      )}

      <ol className="flex flex-col gap-3">
        {sichtbar.map((post) => {
          const arcInfo = ARCS.find((a) => a.id === post.arc)
          return (
            <li key={post.nr} id={`post-${post.nr}`} className="card scroll-mt-20 p-4 lg:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[13px] font-semibold text-ink-muted tabular-nums">{post.nr}</span>
                <h2 className="mr-auto text-base font-semibold text-ink">{post.title}</h2>
                {post.status === 'veroeffentlicht' && <Badge className="border-primary/30 bg-primary/10 text-primary"><CheckCircle2 size={12} /> veröffentlicht</Badge>}
                {post.status === 'naechster' && <Badge className="border-accent/40 bg-accent/10 text-accent"><Clock3 size={12} /> als Nächstes</Badge>}
                {post.status === 'geplant' && <Badge className="border-line bg-surface-2 text-ink-faint"><CircleDashed size={12} /> geplant</Badge>}
                <Badge className={DATA_CLASS[post.dataStatus]}>{DATA_LABEL[post.dataStatus]}</Badge>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-ink">{post.hook}</p>

              <ul className="mt-3 flex flex-col gap-1">
                {post.figures.map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] leading-relaxed text-ink-muted">
                    <span aria-hidden className="text-ink-faint">·</span>{f}
                  </li>
                ))}
              </ul>

              {post.dataNote && (
                <p className="mt-3 rounded-md bg-surface-2 px-3 py-2 text-[12px] leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink">Zu beachten:</span> {post.dataNote}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-faint">
                <span>{arcInfo?.label}</span>
                {post.publishedOn && <span>{new Date(post.publishedOn).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>}
                {post.refs?.length ? (
                  <span className="inline-flex items-center gap-1">
                    <Link2 size={12} /> baut auf{' '}
                    {post.refs.map((r, i) => (
                      <span key={r}>
                        {i > 0 && ', '}
                        <a href={`#post-${r}`} className="underline hover:text-ink">Post {r}</a>
                      </span>
                    ))}
                  </span>
                ) : null}
                {post.sampleId && (
                  <button type="button" onClick={() => imStudioOeffnen(post)} className="inline-flex items-center gap-1 text-primary underline hover:text-primary-strong">
                    <PlayCircle size={13} /> Datensatz im Studio öffnen
                  </button>
                )}
                {post.linkedInUrl ? (
                  <a href={post.linkedInUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline hover:text-primary-strong">
                    <ArrowUpRight size={13} /> Beitrag auf LinkedIn
                  </a>
                ) : post.status === 'veroeffentlicht' ? (
                  <span>LinkedIn-Link wird ergänzt</span>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>

      <p className="mt-10 text-[12px] leading-relaxed text-ink-faint">
        Alle Zahlen stammen aus den Beispiel-Datensätzen dieser Seite und den dort genannten Quellen. Datenlage, Lücken und
        Methodenbrüche stehen je Datensatz unter „Dateninfo“ im Studio und ausführlich in <code>docs/DATASETS.md</code>.
      </p>

      <section id="ueber" className="mt-12 border-t border-line pt-8">
        <h2 className="text-lg font-semibold text-ink">Über diese Seite</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
          {SITE.name} ist ein Werkzeug von {LEGAL.operator}, mit dem aus einer Tabelle ein fertiges Video für den Feed wird.
          Es läuft vollständig im Browser, ist Open Source unter der MIT-Lizenz, und die Diagramm-Animation basiert auf{' '}
          <a className="underline hover:text-ink" href="https://github.com/hatemhosny/racing-bars" target="_blank" rel="noreferrer">racing-bars</a> (MIT).
        </p>
        <p className="mt-3 text-[13px] text-ink-muted">
          <a className="underline hover:text-ink" href="artikel/tierarztketten-deutschland.html">Artikel: Wer betreibt die Tierarztpraxen?</a>
          {' · '}
          <a className="underline hover:text-ink" href="artikel/datenherkunft.html">Datenherkunft</a>
          {' · '}
          <a className="underline hover:text-ink" href="#impressum">Impressum</a>
          {' · '}
          <a className="underline hover:text-ink" href="#datenschutz">Datenschutz</a>
        </p>
      </section>
    </div>
  )
}
