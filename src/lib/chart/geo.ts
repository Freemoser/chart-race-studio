import geoDe from '../../assets/bundeslaender.json'
import geoWelt from '../../assets/welt.json'
import laendernamen from '../../assets/laendernamen.json'

/**
 * Zuordnung von Tabellenspalten zu Kartenflächen – die eine Stelle, an der der Datenstandard
 * (docs/DATENSTANDARD.md) für Karten umgesetzt ist. Renderer und Studio-Hinweis nutzen dieselbe
 * Funktion, damit die Warnung im Studio nie etwas anderes behauptet als die Karte zeigt.
 */
export type GeoFeature = { type: 'Feature'; properties: { name: string }; geometry: object }
export const KARTEN = {
  bundeslaender: (geoDe as { features: GeoFeature[] }).features,
  welt: (geoWelt as { features: GeoFeature[] }).features,
}

/** Spalten mit diesem Präfix sind Summen: nicht auf der Karte, sondern als Mini-Linie im Panel. */
export const SUMMEN_PRAEFIX = /^\s*(summe|gesamt|total)\s*:\s*/i
export const istSumme = (spalte: string) => SUMMEN_PRAEFIX.test(spalte)

/** „Summe: Hunde (Mio.)“ -> { name: 'Hunde', einheit: 'Mio.' } */
export function summenSpalte(spalte: string): { name: string; einheit: string } {
  const rest = spalte.replace(SUMMEN_PRAEFIX, '').trim()
  const m = rest.match(/^(.*?)\s*\(([^)]*)\)\s*$/)
  return m ? { name: m[1].trim(), einheit: m[2].trim() } : { name: rest, einheit: '' }
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/ß/g, 'ss').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim()

// Schreibweise -> Flächenname. Bundesländer zusätzlich ohne Bindestrich und in ASCII.
const WELT_INDEX = new Map<string, string>()
for (const [flaeche, namen] of Object.entries(laendernamen as Record<string, string[]>)) {
  for (const n of namen) if (!WELT_INDEX.has(norm(n))) WELT_INDEX.set(norm(n), flaeche)
}
const LAND_INDEX = new Map<string, string>(KARTEN.bundeslaender.map((f) => [norm(f.properties.name), f.properties.name]))

export interface Zuordnung {
  karte: 'welt' | 'bundeslaender'
  features: GeoFeature[]
  /** Flächenname -> Spaltenname in der Tabelle */
  spalteFuer: Map<string, string>
  /** Spalten, die weder Fläche noch Summe sind – im Studio als Hinweis */
  ohneFlaeche: string[]
  summen: string[]
}

export function ordneZu(spalten: string[]): Zuordnung {
  const summen = spalten.filter(istSumme)
  const flaechig = spalten.filter((s) => !istSumme(s))
  const treffer = (index: Map<string, string>) => flaechig.filter((s) => index.has(norm(s))).length
  // Wer mehr Bundesländer als Länder trifft, meint Deutschland.
  const karte = treffer(LAND_INDEX) >= treffer(WELT_INDEX) && treffer(LAND_INDEX) > 0 ? 'bundeslaender' : 'welt'
  const index = karte === 'bundeslaender' ? LAND_INDEX : WELT_INDEX
  const spalteFuer = new Map<string, string>()
  const ohneFlaeche: string[] = []
  for (const s of flaechig) {
    const f = index.get(norm(s))
    if (f && !spalteFuer.has(f)) spalteFuer.set(f, s)
    else ohneFlaeche.push(s)
  }
  return { karte, features: KARTEN[karte], spalteFuer, ohneFlaeche, summen }
}
