/*
 * Erzeugt src/assets/bundeslaender.json (GeoJSON) aus data/geo/deu.topo.json.
 * Aufruf: node scripts/build-geo.mjs
 *
 * Warum vorab und nicht zur Laufzeit: Die Seite lädt nichts nach, weder Geometrie noch
 * eine TopoJSON-Bibliothek. Der Dekoder unten ist bewusst klein gehalten und deckt nur
 * das ab, was diese Datei enthält (Polygon und MultiPolygon mit quantisierten Arcs).
 *
 * Quelle: datamaps 0.5.10, src/js/data/deu.topo.json (MIT), 16 Bundesländer mit
 * deutschen Namen – die stimmen mit den Kategorienamen unserer Datensätze überein.
 */
import fs from 'node:fs'

const topo = JSON.parse(fs.readFileSync('data/geo/deu.topo.json', 'utf8'))
const { scale: [sx, sy], translate: [tx, ty] } = topo.transform

/** Delta-kodierte, quantisierte Arcs in echte Koordinaten zurückrechnen. */
const arcs = topo.arcs.map((arc) => {
  let x = 0, y = 0
  return arc.map(([dx, dy]) => {
    x += dx; y += dy
    return [x * sx + tx, y * sy + ty]
  })
})
/** Negativer Index heißt: diesen Arc rückwärts durchlaufen (~i ist der echte Index). */
const ring = (indizes) => {
  const punkte = []
  for (const i of indizes) {
    const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]
    // Der letzte Punkt eines Arcs ist der erste des nächsten – nicht doppelt aufnehmen.
    punkte.push(...(punkte.length ? a.slice(1) : a))
  }
  return punkte
}
const rund = (koord, stellen = 3) => {
  const f = 10 ** stellen
  return koord.map((r) => r.map(([x, y]) => [Math.round(x * f) / f, Math.round(y * f) / f]))
}

const features = topo.objects.deu.geometries.map((g) => ({
  type: 'Feature',
  properties: { name: g.properties.name },
  geometry: g.type === 'Polygon'
    ? { type: 'Polygon', coordinates: rund(g.arcs.map(ring)) }
    : { type: 'MultiPolygon', coordinates: g.arcs.map((poly) => rund(poly.map(ring))) },
}))

const out = { type: 'FeatureCollection', features }
fs.writeFileSync('src/assets/bundeslaender.json', JSON.stringify(out))
const kb = (fs.statSync('src/assets/bundeslaender.json').size / 1024).toFixed(0)
console.log(`${features.length} Bundesländer, ${kb} kB`)
console.log(features.map((f) => f.properties.name).sort().join(', '))
