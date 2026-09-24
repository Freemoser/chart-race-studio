/*
 * Erzeugt src/assets/laendernamen.json: für jede Fläche der Weltkarte die Namen, unter denen sie
 * in einer Tabelle stehen darf – englisch, deutsch, ISO-Code und gängige Varianten.
 *
 *   node scripts/build-laendernamen.mjs
 *
 * Grund: Der Datenstandard (docs/DATENSTANDARD.md) verspricht, dass „Deutschland“, „Germany“ und
 * „DE“ dieselbe Fläche färben. Ohne diese Tabelle zählt nur die exakte englische Schreibweise der
 * Geometrie – so blieb die Demokratische Republik Kongo grau, weil der Datensatz „DR Congo“ sagt.
 *
 * Deutsche Namen und Codes kommen aus Intl.DisplayNames (ICU/CLDR), nicht aus einer Handliste.
 * Nur was CLDR anders schreibt als die Geometrie oder die Datensätze, steht unten als Zusatz.
 */
import fs from 'node:fs'

const welt = JSON.parse(fs.readFileSync('src/assets/welt.json', 'utf8'))
const en = new Intl.DisplayNames('en', { type: 'region' })
const de = new Intl.DisplayNames('de', { type: 'region' })

// Alle zweistelligen Codes durchprobieren; unbekannte gibt DisplayNames unverändert zurück.
const codes = []
for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
  const c = String.fromCharCode(a, b)
  const n = en.of(c)
  if (n && n !== c) codes.push(c)
}
export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim()

// Geometriename -> CLDR-Code, wo die englischen Namen nicht wörtlich übereinstimmen
const CODE_FUER = {
  'Bosnia and Herzegovina': 'BA', 'Czechia': 'CZ', 'Democratic Republic of the Congo': 'CD',
  'Republic of the Congo': 'CG', 'Ivory Coast': 'CI', 'Eswatini': 'SZ', 'North Macedonia': 'MK',
  'Myanmar': 'MM', 'Russian Federation': 'RU', 'South Korea': 'KR', 'North Korea': 'KP',
  'Timor-Leste': 'TL', 'Falkland Is.': 'FK', 'Fr. S. Antarctic Lands': 'TF', 'Palestine': 'PS',
  'Taiwan': 'TW', 'Turkey': 'TR', 'United States': 'US', 'Vietnam': 'VN', 'Laos': 'LA',
  'Syria': 'SY', 'Iran': 'IR', 'Bolivia': 'BO', 'Venezuela': 'VE', 'Tanzania': 'TZ', 'Moldova': 'MD',
  'Brunei': 'BN', 'Kosovo': 'XK', 'Western Sahara': 'EH', 'Puerto Rico': 'PR', 'Greenland': 'GL',
  'New Caledonia': 'NC', 'Solomon Islands': 'SB', 'South Sudan': 'SS', 'Central African Republic': 'CF',
  'Dominican Republic': 'DO', 'Equatorial Guinea': 'GQ', 'Bahamas': 'BS', 'Gambia': 'GM',
}
// Schreibweisen aus der Praxis, die weder Geometrie noch CLDR kennen
const ZUSATZ = {
  'Democratic Republic of the Congo': ['DR Congo', 'DRC', 'Congo-Kinshasa', 'Kongo (Kinshasa)', 'DR Kongo'],
  'Republic of the Congo': ['Congo', 'Congo-Brazzaville', 'Kongo (Brazzaville)', 'Kongo'],
  'Ivory Coast': ["Côte d'Ivoire", 'Cote d Ivoire', 'Elfenbeinküste'],
  'United States': ['USA', 'US', 'United States of America', 'Vereinigte Staaten von Amerika'],
  'United Kingdom': ['UK', 'Great Britain', 'Großbritannien', 'England'],
  'Russian Federation': ['Russia', 'Russland'],
  'Czechia': ['Czech Republic', 'Tschechische Republik'],
  'Turkey': ['Türkiye', 'Turkiye'],
  'South Korea': ['Korea, Republic of', 'Republic of Korea', 'Korea'],
  'North Korea': ["Korea, Democratic People's Republic of", 'Nordkorea'],
  'Eswatini': ['Swaziland', 'Swasiland'],
  'North Macedonia': ['Macedonia', 'Mazedonien'],
  'Myanmar': ['Burma', 'Birma'],
  'Timor-Leste': ['East Timor', 'Osttimor'],
  'Netherlands': ['Holland', 'Niederlande'],
  'N. Cyprus': ['Northern Cyprus', 'Nordzypern'],
}

const nachName = new Map(codes.map((c) => [norm(en.of(c)), c]))
const aus = {}
let ohneCode = []
for (const f of welt.features) {
  const g = f.properties.name
  const code = CODE_FUER[g] ?? nachName.get(norm(g))
  const namen = new Set([g, ...(ZUSATZ[g] ?? [])])
  if (code) { namen.add(code); namen.add(en.of(code)); namen.add(de.of(code)) } else ohneCode.push(g)
  aus[g] = [...namen]
}
fs.writeFileSync('src/assets/laendernamen.json', JSON.stringify(aus))
console.log(`${Object.keys(aus).length} Flächen, ${Object.values(aus).reduce((s, n) => s + n.length, 0)} Schreibweisen`)
if (ohneCode.length) console.log('Ohne ISO-Code (nur englischer Name):', ohneCode.join(', '))
