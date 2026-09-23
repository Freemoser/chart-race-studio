// Erzeugt src/samples/data.ts aus den recherchierten Rohdaten in data/raw/.
// Aufruf: node scripts/build-samples.mjs
import fs from 'node:fs'
import path from 'node:path'

const RAW = path.resolve('data/raw')
const load = (f) => (fs.existsSync(path.join(RAW, f)) ? JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8')) : { rows: [] })
const d1 = load('ds1-tieraerzte.json'), d1b = load('ds1b-tieraerzte-1990-2001.json'), d1c = load('ds1c-taetige-1992-2001.json')
const d2 = load('ds2-heimtiere.json'), d2b = load('ds2b-heimtiere-1990-2013.json'), d2d = load('ds2d-hunde-katzen-1991-1998.json')
// ds2c ist überholt: dessen „1999“-Werte sind laut Nachrecherche in Wahrheit die 1996er Zahlen
// (die IVH-Website zeigte 2001 noch den Stand von 1996). ds2d ersetzt sie durch die datierte ZZF/IVH-Reihe.
// Die 1992er Zeile aus ds2b (unbelegtes Wikipedia-Zitat) widerspricht dieser Reihe und bleibt ebenfalls draußen.
const d2bClean = { rows: d2b.rows.filter((r) => r.date !== '1992') }
const d3 = load('ds3-hunderassen.json'), d3b = load('ds3b-hunderassen-1990-2010.json'), d3c = load('ds3c-hunderassen-2011-2025.json')
const d4 = load('ds4-nutztiere.json'), d5 = load('ds5-tieraerzte-bundesland-1991-2005.json'), d7 = load('ds7-viehbestand-1991-2009.json')
const d8 = load('ds8-praxisarten-1996-2025.json'), d9 = load('ds9-fachtieraerzte.json'), d10 = load('ds10-kleintiere-bundesland.json')
const d12 = load('ds12-ketten-modell.json')
const d13 = load('ds13-hund-katze-welt.json')

/** long rows -> wide table (Jahr × names). Bei Dubletten gewinnt die zuerst genannte Quelle. */
function wide(rows, { names, from, to, rename = {} }) {
  const dates = [...new Set(rows.map((r) => r.date))].filter((d) => (!from || d >= from) && (!to || d <= to)).sort()
  const nm = names ?? [...new Set(rows.map((r) => r.name))]
  const out = dates.map((d) => [d, ...nm.map((n) => { const r = rows.find((x) => x.date === d && x.name === n); return r ? r.value : null })])
  // Zeilen ohne einen einzigen Wert verwerfen
  return { headers: ['Jahr', ...nm.map((n) => rename[n] ?? n)], rows: out.filter((r) => r.slice(1).some((v) => v != null)) }
}
const byMetric = (d, m) => d.rows.filter((r) => r.metric === m)

// Dubletten (Datum|Name) entfernen – die zuerst gelistete Quelle gewinnt.
const dedupe = (rows) => { const s = new Set(); return rows.filter((r) => { const k = r.date + '|' + r.name; return s.has(k) ? false : (s.add(k), true) }) }

// 1 Tierärzt:innen gesamt nach Bundesland. 2006–2025 aus ds1, 2002–2005 aus den archivierten
// BTK-Statistiken (ds5, nach Kammerbereich – Nordrhein und Westfalen-Lippe werden wie in ds1 zu
// Nordrhein-Westfalen addiert). Vor 2002 hat die BTK selbst keine Kammerdaten.
const NRW = ['Nordrhein', 'Westfalen-Lippe']
const kammerRows = byMetric(d5, 'Tierärzte gesamt (Kammermitglieder) nach Kammerbereich').filter((r) => r.name !== 'Deutschland')
const kammerJahre = [...new Set(kammerRows.map((r) => r.date))].filter((y) => new Set(kammerRows.filter((r) => r.date === y).map((r) => r.name)).size >= 16)
const bundeslandAus2005 = kammerJahre.flatMap((date) => {
  const jahr = kammerRows.filter((r) => r.date === date)
  const nrw = jahr.filter((r) => NRW.includes(r.name)).reduce((sum, r) => sum + r.value, 0)
  return [
    ...jahr.filter((r) => !NRW.includes(r.name)),
    ...(nrw > 0 ? [{ date, name: 'Nordrhein-Westfalen', value: nrw }] : []),
  ]
})
const w1 = wide(dedupe([...byMetric(d1, 'Tierärzt:innen gesamt nach Bundesland'), ...bundeslandAus2005]), {})


// 2 National: Niedergelassene, Praxisassistent:innen, Tätige (BTK) + Hunde & Katzen (IVH/ZZF) auf der rechten Achse.
//   1990–1995 aus Maure (1998): Praxisinhaber berechnet (Bereich Praxis − Assistenz/Vertretung), 1991 exakt (Schöne & Ulrich).
// Die BTK zählt ausschließlich approbierte Kammermitglieder. „Praxisassistent:innen“ (so der historische
// Begriff der Statistik, seit 2024 „Angestellte“) sind angestellte TIERÄRZT:INNEN – nicht Tiermedizinische
// Fachangestellte (TFA), die in keiner BTK-Statistik auftauchen.
const NIED = 'Niedergelassene Tierärzt:innen (Praxisinhaber)', ASSI = 'Angestellte Tierärzt:innen (in Praxen)', TAET = 'Tierärztlich Tätige gesamt'
const natMap = {
  'Niedergelassene/praktizierende Tierärzt:innen (Praxisinhaber)': NIED,
  'Praktizierende Tierärzt:innen (Praxisinhaber)': NIED,
  'Praktizierende Tierärzt:innen (Praxisinhaber) – berechnet': NIED,
  'Praxisassistent:innen (angestellt in Praxis)': ASSI,
  'Praxisassistent:innen (ohne Praxisvertreter:innen)': ASSI,
  'Praxisassistent:innen': ASSI,
  'Praxisassistent:innen inkl. Praxisvertreter:innen': ASSI,
  'Tierärztlich Tätige (Summe)': TAET,
  'Tierärztlich Tätige (Inland)': TAET,
  'Tierärztlich Tätige (In- und Ausland; BTK-Definition wie 2002)': TAET,
  // bereits umbenannte Reihen (z.B. aus dem Agrarstatistischen Jahrbuch) unverändert durchlassen
  [NIED]: NIED, [ASSI]: ASSI, [TAET]: TAET,
}
const d1cDe = d1c.rows.filter((r) => r.metric === 'Deutschland')
// Reihenfolge = Priorität (erster Treffer je Jahr gewinnt): BTK direkt, dann publizierte Sekundärquellen,
// zuletzt aus publizierten Aggregaten berechnete Werte. Friedrich (2007) hat vor Maure (1998) Vorrang,
// weil er die Assistent:innen ohne Praxisvertreter:innen ausweist – so wie die heutige BTK-Statistik.
// Agrarstatistisches Jahrbuch 2001 (Tab. 166): geschlossene nationale Reihe 1994–2001. In den
// Überschneidungsjahren 1994/1995 und 1998 stimmt sie exakt mit den anderen Quellen überein,
// deshalb hat sie für 1994–2001 Vorrang vor Einzelwerten aus Pressemitteilungen.
const jahrbuch = [
  ...byMetric(d5, 'Deutschland: Tierärztlich Tätige').map((r) => ({ ...r, name: TAET })),
  ...byMetric(d5, 'Deutschland: Praktizierende Tierärzte').map((r) => ({ ...r, name: NIED })),
]
const natRows = dedupe([
  ...byMetric(d1, 'Deutschland'),
  ...jahrbuch,
  ...d1cDe.filter((r) => r.quality === 'publiziert'),
  ...d1b.rows.filter((r) => r.name === 'Praktizierende Tierärzt:innen (Praxisinhaber)' || r.name === 'Praxisassistent:innen' || r.name === 'Tierärztlich Tätige (Inland)'),
  ...d1b.rows.filter((r) => r.name === 'Praktizierende Tierärzt:innen (Praxisinhaber) – berechnet' || r.name === 'Praxisassistent:innen inkl. Praxisvertreter:innen'),
  ...d1cDe.filter((r) => r.quality === 'berechnet'),
].filter((r) => natMap[r.name]).map((r) => ({ ...r, name: natMap[r.name] })))
// Vergleichsachse als EINE durchgehende Reihe (so gewünscht). Der Anstieg 2011→2012 ist überwiegend ein
// Methodenwechsel: bis 2011 IVH-Schätzung, ab 2012 repräsentative Erhebung (IMR, ab Ende 2013 Skopos).
// Der Hinweis steht in der Quellenzeile des Datensatzes und in docs/DATASETS.md.
const PETS = 'Hunde und Katzen (Mio.)'
// 1999 und 2001 aus archivierten IVH-Angaben; der 2000er-Wert stützt sich nur auf eine Presseangabe
// mit Statista-Bezug und bleibt draußen (die App interpoliert das Jahr).
const petAxis = dedupe([
  ...d2d.rows.filter((r) => r.metric === 'Vergleichsachse'),
  ...d2bClean.rows.filter((r) => r.metric === 'Vergleichsachse'),
].map((r) => ({ ...r, name: PETS })))
// ab 1991: der Wert 1990 umfasst nur die alten Bundesländer
// „Tierärztlich Tätige“ umfasst ALLE Bereiche, nicht nur Praxen. Damit die Zahlen im Diagramm aufgehen,
// wird die Differenz als eigene (berechnete) Reihe ausgewiesen:
//   Tätige = Niedergelassene + Angestellte + Tätig außerhalb von Praxen (Amt, Industrie, Hochschule, Forschung …)
// Die Restgröße enthält auch die wenigen Praxisvertreter:innen (1991: 170 Personen).
const REST = 'Tätig außerhalb von Praxen'
const byDateName = new Map(natRows.map((r) => [r.date + '|' + r.name, r.value]))
const restRows = [...new Set(natRows.map((r) => r.date))].flatMap((date) => {
  const t = byDateName.get(`${date}|${TAET}`), n = byDateName.get(`${date}|${NIED}`), a = byDateName.get(`${date}|${ASSI}`)
  return t != null && n != null && a != null ? [{ date, name: REST, value: t - n - a }] : []
})
// In diesem Datensatz sind alle Werte publiziert, liegen vor 2002 aber nur als Stützjahre vor
// (Tätige 1991 und 1998, Heimtiere 1992/1999/2001). Sie werden alle behalten, damit jede Reihe
// wirklich 1991 beginnt; die Zwischenjahre interpoliert die App und weist sie in der Datenprüfung aus.
const w2 = wide([...natRows, ...restRows, ...petAxis], { names: [NIED, ASSI, REST, TAET, PETS], from: '1991' })

// 2b Zugespitzte Fassung für die Aussage „Angestellte überholen die Inhaber“: nur die beiden Reihen,
// um die es geht. Im vollen Datensatz steht „Tierärztlich Tätige gesamt“ mit 34.476 daneben – die
// Y-Achse reicht dann bis 35.000 und der Wechsel bei 11.000 zu 12.000 ist im Video nicht mehr zu sehen.
// Kurze Namen, weil die Kopf-Labels im 1:1-Format sonst abgeschnitten werden.
const w2b = wide([...natRows], {
  names: [NIED, ASSI], from: '1991',
  rename: { [NIED]: 'Praxisinhaber:innen', [ASSI]: 'Angestellte in Praxen' },
})

// 3 Heimtiere nach Tierart, ab 1991. 1991–2003 aus der datierten ZZF/IVH-Jahresreihe (ds2d),
// danach die IVH/ZZF-Datenblätter. Einzig 1992 fehlt, das überspringt die Verbandsreihe selbst.
const petNames = ['Katzen', 'Hunde', 'Kleintiere (Kleinsäuger)', 'Ziervögel', 'Aquarien', 'Terrarien']
const petRowsU = dedupe([
  ...d2d.rows.filter((r) => r.metric === 'Bestand'),
  ...byMetric(d2, 'Bestand'),
  ...d2bClean.rows.filter((r) => r.metric === 'Bestand'),
])
const w3 = wide(petRowsU, { names: petNames, from: '1991' })

// 4 Hunderassen: ohne Summenzeile, 1992–2025 (1990/1991 nirgends online verfügbar)
// ds3 deckt nur die 23 Rassen ab, die 2011–2025 einmal in den Top 15 waren. ds3c ergänzt die
// übrigen Rassen aus derselben VDH-Tabelle, damit keine Reihe 2010 abbricht.
const breedRename = { Collie: 'Collie (Langhaar)' }
const breedRowsU = dedupe([...d3.rows, ...d3c.rows, ...d3b.rows]
  .filter((r) => !/^Alle VDH-Rassen|gesamt|Summe/i.test(r.name))
  .map((r) => ({ ...r, name: breedRename[r.name] ?? r.name })))
// Rassen sortiert nach Gesamtsumme (die wichtigsten zuerst)
const sums = {}
for (const r of breedRowsU) sums[r.name] = (sums[r.name] ?? 0) + r.value
const breedNames = Object.keys(sums).sort((a, b) => sums[b] - sums[a])
const w4 = wide(breedRowsU, { names: breedNames, from: '1990' })

// 5 Rinder nach Bundesland (Flächenländer), 1991–2025. 1991–2010 aus der Eurostat-Regionaltabelle
// mit Destatis-Daten (ds7), ab 2010 aus der BMEL-Aufbereitung (ds4); die 2010er Werte beider
// Quellen sind identisch. Achtung: Der Erhebungsstichtag wechselt (Dezember bis 1997, November 1998,
// ab 1999 überwiegend Mai) – siehe docs/DATASETS.md.
const ohneStadtstaaten = (r) => !['Deutschland', 'Berlin', 'Bremen', 'Hamburg'].includes(r.name)
const w5 = wide(dedupe([
  ...byMetric(d4, 'Rinder nach Bundesland (November)').filter(ohneStadtstaaten),
  ...byMetric(d7, 'Rinder nach Bundesland').filter(ohneStadtstaaten),
]), { from: '1991' })

// 6 Heimtiermarkt: Umsatz nach Segment. Die Futter- und Bedarfsartikel-Zahlen sind stationärer Handel,
// „Online-Handel“ ist die Schätzung über alle Segmente hinweg und damit bewusst eine eigene Größe.
// Der Wert für 2008 bleibt draußen: 2009 und 2010 fehlen, sonst entstünde eine Dreijahresbrücke.
const marktNamen = ['Katzenfutter', 'Hundefutter', 'Bedarfsartikel und Zubehör (stationär)', 'Online-Handel (Schätzung)', 'Futter für Kleintiere', 'Ziervogelfutter', 'Zierfischfutter']
const w6 = wide(byMetric(d2, 'Umsatz Heimtiermarkt').filter((r) => marktNamen.includes(r.name)), {
  names: marktNamen,
  from: '2011',
  rename: { 'Bedarfsartikel und Zubehör (stationär)': 'Bedarfsartikel und Zubehör', 'Online-Handel (Schätzung)': 'Online-Handel (alle Segmente)' },
})

// 7 Praxisschwerpunkte 1990–2018. Die Kategorien heißen über die Jahre unterschiedlich, meinen aber
// dasselbe Dreieck aus reiner Kleintierpraxis, gemischter Praxis und reiner Nutz-/Großtierpraxis.
// Ende 2018, weil die BTK ab 2019 die Pferde als eigene Kategorie führt und selbst schreibt, dass
// eine Vergleichbarkeit mit den Jahren davor ausgeschlossen ist. 2006 fällt raus: In dem Jahr hat
// Baden-Württemberg für „Kleintiere“ null gemeldet, die Berichtigung der BTK korrigiert die Tabelle nicht.
const KLEIN = 'Nur Kleintiere', GEMISCHT = 'Gemischt (Nutz- und Kleintiere)', NUTZ = 'Nur Nutz- und Großtiere'
const praxisMap = {
  Kleintierpraxis: KLEIN, 'Praxis für überwiegend Kleintiere': KLEIN, Kleintiere: KLEIN,
  Gemischtpraxis: GEMISCHT, 'Praxis für Groß- und Kleintiere': GEMISCHT, 'Nutztiere und Kleintiere': GEMISCHT,
  Großtierpraxis: NUTZ, 'Praxis für überwiegend Großtiere': NUTZ, Nutztiere: NUTZ,
}
// Ab 2019 zählt die BTK Pferde als eigene Kategorie. Die drei Reihen laufen trotzdem durch, weil sich
// die neuen Kategorien definitorisch auf die alte Dreiteilung abbilden lassen – die BTK selbst schreibt,
// dass Pferde bis 2019 „zu den Nutztieren gezählt und unter der Rubrik Großtiere erhoben" wurden
// (Deutsches Tierärzteblatt 8/2024, S. 990):
//   Nur Kleintiere = Kleintiere
//   Nur Nutz- und Großtiere = Nutztiere + Pferde + „Nutztiere und Pferde"
//   Gemischt = „Nutztiere und Kleintiere" + „Kleintiere und Pferde" + „Nutztiere, Pferde und Kleintiere"
//
// Es wird NICHTS geschätzt oder umgerechnet; alle Werte sind Summen publizierter Kategorien.
// Gegenprobe an der einzigen Verteilung, die die BTK selbst nennt (2023: „mehr als 50 Prozent betreiben
// Kleintierpraxen, gut ein Viertel sind Gemischtpraxen"): Diese Zuordnung ergibt 53,9 % Kleintiere und
// 28,8 % gemischt – passt. Eine frühere, trendbasierte Schätzung hätte 37,8 % gemischt ergeben und der
// Quelle widersprochen; sie wurde deshalb verworfen.
//
// Der sichtbare Versatz 2018→2019 (gemischt 4.554 → 3.381, Nutz-Gruppe 971 → 1.713) ist die Folge der
// neuen Abfrage: Wer vorher „Nutztiere und Kleintiere" ankreuzte, wählt heute differenzierter. Die BTK
// zeigt deshalb selbst keinen Verlauf, sondern nur die aktuelle Verteilung. Der Versatz steht in der
// Quellenzeile und in der Dateninfo des Datensatzes.
const praxisRows = byMetric(d8, 'Praxisart').filter((r) => r.date !== '2006')
const praxisNeu = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'].flatMap((date) => {
  const v = (n) => { const r = praxisRows.find((x) => x.date === date && x.name === n); return r ? r.value : 0 }
  return [
    { date, name: NUTZ, value: v('Nutztiere') + v('Pferde') + v('Nutztiere und Pferde') },
    { date, name: GEMISCHT, value: v('Nutztiere und Kleintiere') + v('Kleintiere und Pferde') + v('Nutztiere, Pferde und Kleintiere') },
  ]
})
// Praxisketten: Standorte je Gruppe. Einzige mehrjährige Quelle ist das Ranking von gesundheitsmarkt.de,
// das pro Jahrgang nur die FÜNF größten Betreiber ausweist – wer aus den Top 5 fällt, hat in dem Jahr
// keinen Wert, nicht den Wert null. 2025 ist kein Ranking erschienen und wird interpoliert.
// Alles andere aus dieser Rohdatei (Bundeskartellamt, zm-online, Eigenangaben) sind datierte Einzelbelege
// mit abweichender Zählweise; sie stehen in der Dateninfo, nicht in der Reihe.
// Modellreihe 2015–2026 nach der Vorgabe vom 17.09.2026: lückenlos, jeder Wert mit Marker
// (B belegt, B~ rund, B≥ Untergrenze, B/P Praxenzahl als Näherung, S geschätzt, 0 existierte nicht).
// Die Marker stehen in data/raw/ds12-ketten-modell.json je Zelle; die Tabelle hier trägt nur die Zahlen.
// TOTAL ist die Modellschätzung des Gesamtmarkts, verankert am Tierärzte Atlas (August 2024, rund 450).
const MODELL_NAMEN = ['TOTAL Deutschland', 'IVC Evidensia', 'Tierarzt Plus Partner', 'AniCura', 'VetPartners',
  'VetGruppen (Vetopia)', 'Altano (Pferde)', 'TeamVet', 'Veternicum Nesto', 'SmartVet → Medivet', 'Rex', 'filu',
  'Cadomo Vets', 'Wolf & Tiger', 'activet (bis 2022)', 'Weitere Gruppen (Long Tail)']
const w10 = wide(byMetric(d12, 'Standorte je Gruppe'), { names: MODELL_NAMEN })

// Sammelreihe „Ketten“ für den Schwerpunkte-Chart: dieselbe TOTAL-Reihe wie im Ketten-Datensatz und im
// Artikel. Vorher stand hier ein eigener Fünf-Gruppen-Korb – das ergab für dasselbe Wort zwei verschiedene
// Zahlen im selben Produkt (320 hier gegen 514 dort). Es gibt jetzt nur noch eine Kettenzahl.
const KETTEN = 'Ketten (Standorte in Deutschland)'
const kettenSumme = byMetric(d12, 'Standorte je Gruppe')
  .filter((r) => r.name === 'TOTAL Deutschland')
  .map((r) => ({ date: r.date, name: KETTEN, value: r.value }))

const w7 = wide(
  [
    ...praxisRows.filter((r) => praxisMap[r.name] === KLEIN).map((r) => ({ ...r, name: KLEIN })),
    ...praxisRows.filter((r) => praxisMap[r.name] === GEMISCHT && +r.date <= 2018).map((r) => ({ ...r, name: GEMISCHT })),
    ...kettenSumme.filter((r) => +r.date <= 2025),
    ...praxisRows.filter((r) => praxisMap[r.name] === NUTZ && +r.date <= 2018).map((r) => ({ ...r, name: NUTZ })),
    ...praxisNeu,
  ],
  // Ab 1991. Die 1990er-Zeile aus Maure (1998) umfasst nur die alten Bundesländer: Ihre Summe ergibt
  // 5.900, die von 1991 dagegen 8.243 – passend zu den 8.510 Niedergelassenen der gesamtdeutschen
  // Reihe. Der Sprung 1990→1991 wäre also die Wiedervereinigung und keine Entwicklung der Praxen.
  { names: [KLEIN, GEMISCHT, NUTZ, KETTEN], from: '1991' },
)

// 8 Fachtierarzt-Gebiete ab 2007. 2005 zählt nur Tierärzt:innen bis 65 Jahre und ist nicht
// vergleichbar, 2006 ist durch dieselbe Baden-Württemberg-Lücke verzerrt; beide bleiben draußen.
// 2015–2017 und 2020 hat die BTK nicht bzw. unvollständig veröffentlicht und wird interpoliert.
const fachMap = {
  'Fachtierarzt für Kleintiere, kleine Haustiere': 'Kleintiere', 'Fachtierarzt für Klein- und Heimtiere': 'Kleintiere', 'Fachtierarzt für Kleintiere': 'Kleintiere',
  'Fachtierarzt für Lebensmittelhygiene': 'Lebensmittel(hygiene)', 'Fachtierarzt für Lebensmittel': 'Lebensmittel(hygiene)',
  'Fachtierarzt für Öffentliches Veterinärwesen': 'Öffentliches Veterinärwesen',
  'Fachtierarzt für Rinder': 'Rinder', 'Fachtierarzt für Schweine': 'Schweine', 'Fachtierarzt für Pferde': 'Pferde',
  'Fachtierarzt für Geflügel': 'Geflügel', 'Fachtierarzt für Mikrobiologie': 'Mikrobiologie', 'Fachtierarzt für Pathologie': 'Pathologie',
  'Fachtierarzt für Kleintierchirurgie': 'Kleintierchirurgie', 'Fachtierarzt für Innere Medizin der Kleintiere': 'Innere Medizin der Kleintiere',
}
const fachRows = byMetric(d9, 'Fachtierarzt-Gebietsbezeichnung')
  .filter((r) => fachMap[r.name] && +r.date >= 2007)
  .map((r) => ({ ...r, name: fachMap[r.name] }))
const fachSummen = {}
for (const r of fachRows) fachSummen[r.name] = (fachSummen[r.name] ?? 0) + r.value
const w8 = wide(fachRows, { names: Object.keys(fachSummen).sort((a, b) => fachSummen[b] - fachSummen[a]) })

// 9 Kleintier-Tierärzt:innen je Bundesland, 2002–2018. Wie beim nationalen Datensatz endet die Reihe
// 2018: Ab 2019 führt die BTK die Pferde getrennt, außerdem melden mehrere Kammern „k. A.“ (Bremen
// durchgehend, Mecklenburg-Vorpommern fünf Jahre) – im Balkenrennen würden diese Länder scheinbar
// verschwinden. 2005 fehlt in der Quelle, 2006 ist unbrauchbar (Baden-Württemberg meldete null).
const kleintierBl = byMetric(d10, 'Kleintiere nach Kammerbereich')
  .filter((r) => r.value != null && +r.date <= 2018 && r.date !== '2006')
const kleintierJahre = [...new Set(kleintierBl.map((r) => r.date))]
const w9 = wide(
  kleintierJahre.flatMap((date) => {
    const jahr = kleintierBl.filter((r) => r.date === date)
    const nrw = jahr.filter((r) => NRW.includes(r.name)).reduce((sum, r) => sum + r.value, 0)
    return [...jahr.filter((r) => !NRW.includes(r.name)), ...(nrw > 0 ? [{ date, name: 'Nordrhein-Westfalen', value: nrw }] : [])]
  }),
  {},
)

const lit = (v) => (v == null ? 'null' : typeof v === 'number' ? String(v) : JSON.stringify(v))
const emit = (name, w) => `export const ${name} = {\n  headers: ${JSON.stringify(w.headers)},\n  rows: [\n${w.rows.map((r) => '    [' + r.map(lit).join(', ') + '],').join('\n')}\n  ],\n}\n`
const out = `// Automatisch erzeugt von scripts/build-samples.mjs aus data/raw/*.json – nicht von Hand editieren.\n/* eslint-disable */\n` +
  [emit('TIERAERZTE_BUNDESLAND', w1), emit('TIERAERZTESCHAFT_DEUTSCHLAND', w2), emit('INHABER_ANGESTELLTE', w2b), emit('HEIMTIERE', w3), emit('HUNDERASSEN', w4), emit('RINDER_BUNDESLAND', w5), emit('HEIMTIERMARKT', w6), emit('PRAXISSCHWERPUNKTE', w7), emit('FACHTIERAERZTE', w8), emit('KLEINTIERE_BUNDESLAND', w9), emit('KETTEN', w10), emit('HUND_KATZE_WELT', { headers: d13.headers ?? ['Jahr'], rows: d13.rows ?? [] })].join('\n')
fs.writeFileSync('src/samples/data.ts', out)
for (const [n, w] of Object.entries({ w1, w2, w2b, w3, w4, w5, w6, w7, w8, w9, w10 })) console.log(n, w.headers.length - 1, 'Kategorien,', w.rows.length, 'Perioden', w.rows[0]?.[0], '–', w.rows.at(-1)?.[0])
