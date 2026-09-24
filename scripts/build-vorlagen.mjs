/*
 * Erzeugt die Vorlagen zum Datenstandard (docs/DATENSTANDARD.md) in public/vorlagen/, je als
 * Excel und CSV. Die Inhalte sind echte Auszüge unserer Datensätze, keine Fantasiewerte – wer eine
 * Vorlage lädt, sieht im Studio sofort ein funktionierendes Ergebnis.
 *
 *   node scripts/build-vorlagen.mjs
 */
import fs from 'node:fs'
import * as XLSX from 'xlsx'
import { HUND_KATZE_WELT, INHABER_ANGESTELLTE, TIERAERZTE_BUNDESLAND } from '../src/samples/data.ts'

const ZIEL = 'public/vorlagen'
fs.mkdirSync(ZIEL, { recursive: true })

// Weltkarte: bewusst gemischte Schreibweisen, um zu zeigen, dass Deutsch, Englisch und ISO-Code gelten.
const LAENDER = { Germany: 'Deutschland', France: 'Frankreich', Japan: 'Japan', 'United States': 'USA', Brazil: 'Brasilien', China: 'CN' }
const welt = {
  headers: ['Jahr', ...Object.values(LAENDER), 'Summe: Hunde (Mio.)', 'Summe: Katzen (Mio.)'],
  rows: HUND_KATZE_WELT.rows.map((r) => [r[0], ...Object.keys(LAENDER).map((l) => r[HUND_KATZE_WELT.headers.indexOf(l)]),
    r[HUND_KATZE_WELT.headers.indexOf('Summe: Hunde (Mio.)')], r[HUND_KATZE_WELT.headers.indexOf('Summe: Katzen (Mio.)')]]),
}
const VORLAGEN = {
  'vorlage-weltkarte': { daten: welt, hinweis: 'Hundeanteil an Hunden und Katzen in Prozent, Kipppunkt 50. Quelle: Tiermedizin in Zahlen, Datensatz „Hund oder Katze“ (Modell, siehe Dateninfo).' },
  'vorlage-bundeslaender': { daten: TIERAERZTE_BUNDESLAND, hinweis: 'Tierärztinnen und Tierärzte je Landestierärztekammer. Quelle: Bundestierärztekammer.' },
  'vorlage-zeitreihe': { daten: INHABER_ANGESTELLTE, hinweis: 'Für Line und Bar Race. Quelle: Statistik der Deutschen Tierärzteschaft, Bundestierärztekammer.' },
}
const zelle = (v) => v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v)
for (const [name, { daten, hinweis }] of Object.entries(VORLAGEN)) {
  const zeilen = [daten.headers, ...daten.rows]
  fs.writeFileSync(`${ZIEL}/${name}.csv`, zeilen.map((r) => r.map(zelle).join(',')).join('\n') + '\n')
  const wb = XLSX.utils.book_new()
  const blatt = XLSX.utils.aoa_to_sheet(zeilen.map((r, i) => i === 0 ? r : r.map((v, k) => k === 0 ? String(v) : v)))
  blatt['!cols'] = daten.headers.map((h) => ({ wch: Math.max(10, String(h).length + 2) }))
  XLSX.utils.book_append_sheet(wb, blatt, 'Daten')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Hinweis'], [hinweis], [''], ['Das Studio liest nur das erste Blatt. Datenstandard: siehe Anleitung auf der Seite.']]), 'Hinweis')
  // Das ESM-Paket hat keinen Dateizugriff; als Puffer schreiben.
  fs.writeFileSync(`${ZIEL}/${name}.xlsx`, XLSX.write(wb, { type: "buffer", bookType: "xlsx" }))
}
console.log(fs.readdirSync(ZIEL).join(', '))
