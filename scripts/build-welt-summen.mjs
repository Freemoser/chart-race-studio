/*
 * Ergänzt den Weltdatensatz (data/raw/ds13-hund-katze-welt.json) um die Summenspalten
 * „Summe: Hunde (Mio.)“ und „Summe: Katzen (Mio.)“ – die Mini-Linie im Kartenpanel.
 *
 *   node scripts/build-welt-summen.mjs && node scripts/build-samples.mjs
 *
 * Quelle der absoluten Zahlen: data/raw/ds13-weltsummen-quelle.csv (Auszug aus
 * cats_vs_dogs_2000_2026_combined.csv: Jahr, Land, Hunde und Katzen in Mio.).
 *
 * China und Brasilien werden hier genauso korrigiert wie die Anteile im Datensatz, sonst
 * widersprächen Karte und Summe einander (siehe docs/DATASETS.md, 3g):
 * - China: bis 2019 die Quelle; 2024 gemessen 52,58 Mio. Hunde und 71,53 Mio. Katzen (PetData,
 *   White Paper 2025). Dazwischen läuft die Summe beider Arten linear, die Aufteilung folgt dem
 *   korrigierten Anteil. 2025/26 wächst die Summe wie in der Quelle.
 * - Brasilien: Hundezahlen der Quelle (IBGE und Instituto Pet Brasil), Katzen aus dem korrigierten
 *   Hundeanteil zurückgerechnet – die Katzenzahlen der Quelle stammten aus einem Aggregator.
 */
import fs from 'node:fs'

const DS = 'data/raw/ds13-hund-katze-welt.json'
const ds = JSON.parse(fs.readFileSync(DS, 'utf8'))
// Ländernamen wie „Korea, Republic of“ stehen in Anführungszeichen – ein naives split(',') zerlegt sie.
const felder = (z) => [...z.matchAll(/("([^"]*(?:""[^"]*)*)"|[^,]*)(,|$)/g)].slice(0, -1).map((m) => m[2] != null ? m[2].replace(/""/g, '"') : m[1])
const [kopf, ...zeilen] = fs.readFileSync('data/raw/ds13-weltsummen-quelle.csv', 'utf8').trim().split(/\r?\n/).map(felder)
const I = Object.fromEntries(kopf.map((k, i) => [k, i]))
const quelle = new Map() // "Jahr|Land" -> [hunde, katzen]
for (const z of zeilen) quelle.set(`${z[I.year]}|${z[I.country]}`, [Number(z[I.dogs_m]), Number(z[I.cats_m])])

const SUMMEN = ['Summe: Hunde (Mio.)', 'Summe: Katzen (Mio.)']
const basis = ds.headers.filter((h) => !SUMMEN.includes(h))
const laender = basis.slice(1)
const anteil = (jahr, land) => {
  const z = ds.rows.find((r) => String(r[0]) === String(jahr))
  const v = z?.[ds.headers.indexOf(land)]
  return v == null ? null : Number(v) / 100
}
const q = (j, l) => quelle.get(`${j}|${l}`) ?? [0, 0]

const CN19 = q(2019, 'China'), CN24 = [52.58, 71.53]
const summe19 = CN19[0] + CN19[1], summe24 = CN24[0] + CN24[1]
function tiere(jahr, land) {
  const [h, k] = q(jahr, land)
  const s = anteil(jahr, land)
  if (land === 'China' && jahr >= 2020 && s != null) {
    const gesamt = jahr <= 2024
      ? summe19 + (summe24 - summe19) * (jahr - 2019) / 5
      : summe24 * (q(jahr, 'China')[0] + q(jahr, 'China')[1]) / (q(2024, 'China')[0] + q(2024, 'China')[1])
    return [gesamt * s, gesamt * (1 - s)]
  }
  if (land === 'Brazil' && s) return [h, h * (1 - s) / s]
  return [h, k]
}

let fehlend = 0
const rows = ds.rows.map((r) => {
  const jahr = Number(r[0])
  let hunde = 0, katzen = 0
  for (const l of laender) {
    if (!quelle.has(`${jahr}|${l}`)) { fehlend++; continue }
    const [h, k] = tiere(jahr, l)
    if (!Number.isFinite(h) || !Number.isFinite(k)) throw new Error(`${l} ${jahr}: kein gültiger Wert`)
    hunde += h; katzen += k
  }
  const alt = basis.map((h) => r[ds.headers.indexOf(h)])
  return [...alt, Math.round(hunde * 10) / 10, Math.round(katzen * 10) / 10]
})
if (fehlend) throw new Error(`${fehlend} Land-Jahr-Kombinationen fehlen in der Quelle – Ländernamen prüfen`)
fs.writeFileSync(DS, JSON.stringify({ headers: [...basis, ...SUMMEN], rows }))
for (const j of [2000, 2010, 2018, 2024, 2026]) {
  const z = rows.find((r) => Number(r[0]) === j)
  console.log(j, 'Hunde', z.at(-2), 'Katzen', z.at(-1))
}
