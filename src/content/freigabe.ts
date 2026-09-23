/**
 * Freigabe: was auf der Seite sichtbar ist, hängt am Redaktionsplan.
 *
 * Zwei Schalter in freigabe.json, beide vorbereitet und bewusst noch aus:
 *
 * - `beispieleErstNachVeroeffentlichung`: Ein Beispiel-Datensatz erscheint im Studio erst, wenn ein
 *   veröffentlichter Post ihn verwendet. Datensätze, die in keinem Post vorkommen, bleiben dann
 *   ebenfalls verborgen. Aus = alle Datensätze sichtbar wie bisher.
 * - `artikelLive`: Die Artikel unter src/content/artikel/ werden als eigene Seiten gebaut, sobald
 *   ihr Post veröffentlicht ist und der Entwurf `bereit: ja` trägt (scripts/build-artikel.mjs).
 *   Aus = kein einziger Artikel geht online, auch nicht für bereits veröffentlichte Posts.
 *
 * Verborgen heißt nur: nicht in der Oberfläche. Die Daten stehen weiter im öffentlichen Repository
 * und im Bundle. Für Rohdaten, die vorab niemand sehen darf, ist dieser Schalter nicht gedacht.
 */
import FREIGABE_JSON from './freigabe.json'
import ARTIKEL_JSON from './artikel-index.json'
import { POSTS } from './roadmap'
import { SAMPLES } from '@/samples'

export const FREIGABE: { beispieleErstNachVeroeffentlichung: boolean; artikelLive: boolean } = FREIGABE_JSON

const veroeffentlichteDatensaetze = new Set(
  POSTS.filter((p) => p.status === 'veroeffentlicht' && p.sampleId).map((p) => p.sampleId as string),
)

export function datensatzFreigegeben(id: string): boolean {
  return !FREIGABE.beispieleErstNachVeroeffentlichung || veroeffentlichteDatensaetze.has(id)
}

/** Die Datensätze, die das Studio anbietet. Alle Oberflächen lesen hier, nicht direkt SAMPLES. */
export const SICHTBARE_SAMPLES = SAMPLES.filter((s) => datensatzFreigegeben(s.id))

/** Artikel zur Post-Reihe, erzeugt von scripts/build-artikel.mjs aus src/content/artikel/*.md. */
export interface ArtikelEintrag { post: number; slug: string; titel: string; beschreibung: string; frage: string; bereit: boolean; live: boolean }
export const ARTIKEL: ArtikelEintrag[] = ARTIKEL_JSON as ArtikelEintrag[]
