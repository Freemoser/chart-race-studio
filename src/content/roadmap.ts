/**
 * Redaktionsplan: Posts in Visiten zu je 30, die aufeinander aufbauen.
 *
 * Jeder Post nennt den Datensatz, aus dem das Video kommt, und die Zahlen, die im Text stehen sollen.
 * Alle Zahlen hier stammen aus den Datensätzen in src/samples/ bzw. aus den in docs/DATASETS.md
 * belegten Quellen – nichts ist geschätzt. Wo die Datenlage dünn ist, sagt `dataStatus` das offen.
 *
 * `linkedInUrl` wird nach Veröffentlichung eingetragen; die Oberfläche verlinkt dann darauf.
 */

export type PostStatus = 'veroeffentlicht' | 'naechster' | 'geplant'
/** belegt = Datensatz liegt vor · teilweise = Einzelwerte belegt, Reihe fehlt · offen = muss recherchiert werden */
export type DataStatus = 'belegt' | 'teilweise' | 'offen'

/**
 * Eine Visite umfasst immer 30 Posts – wie ein Rundgang über die Station, Bett für Bett.
 * Die Nummern laufen über alle Visiten durch (Visite 2 beginnt mit Post 31), damit Verweise
 * wie „siehe Post 3“ eindeutig bleiben. Zu welcher Visite ein Post gehört, folgt aus der Nummer.
 */
export const POSTS_JE_VISITE = 30

export interface Visite {
  nr: number
  titel: string
  /** Die eine Frage, die sich durch alle 30 Posts zieht. */
  leitfrage: string
  status: 'laeuft' | 'in-vorbereitung'
}

export const VISITEN: Visite[] = [
  { nr: 1, titel: 'Wie sich die Tiermedizin in Deutschland gedreht hat', leitfrage: 'Mehr Katzen, weniger Inhaber, neue Käufer: Was hat sich in 35 Jahren verschoben?', status: 'laeuft' },
  { nr: 2, titel: 'In Vorbereitung', leitfrage: 'Die Themen werden gerade gesammelt.', status: 'in-vorbereitung' },
]

export const visiteVon = (postNr: number) => Math.ceil(postNr / POSTS_JE_VISITE)

export interface RoadmapArc {
  id: string
  label: string
  claim: string
}

export interface RoadmapPost {
  nr: number
  arc: string
  title: string
  /** Der Aufhänger, ein bis zwei Sätze. */
  hook: string
  /** Die Zahlen, die im Post stehen sollen. */
  figures: string[]
  /** Datensatz-ID aus src/samples/index.ts, falls das Video daraus kommt. */
  sampleId?: string
  chart?: 'line' | 'bar' | 'map'
  dataStatus: DataStatus
  /** Was noch fehlt oder worauf zu achten ist. */
  dataNote?: string
  /** Nummern anderer Posts, auf die dieser Bezug nimmt. */
  refs?: number[]
  status: PostStatus
  publishedOn?: string
  linkedInUrl?: string
  /** Artikel schon vor dem Post online lassen – etwa weil er bereits veröffentlicht war oder für sich allein gesucht wird. */
  vorabOnline?: boolean
}

export const ARCS: RoadmapArc[] = [
  { id: 'tiere', label: 'Die Tiere', claim: 'Was in den Wohnungen lebt, hat sich in einer Generation komplett gedreht.' },
  { id: 'praxis', label: 'Die Praxis', claim: 'Der Beruf wächst, die Selbstständigkeit schrumpft.' },
  { id: 'ketten', label: 'Die Käufer', claim: 'Ein Markt, den es 2015 nicht gab, hat heute über 400 Standorte.' },
  { id: 'fach', label: 'Die Spezialisierung', claim: 'Die Tiermedizin teilt sich in Kleintier-Spezialgebiete und schrumpfende Nutztierfächer.' },
  { id: 'karte', label: 'Die Landkarte', claim: 'Versorgung ist keine Bundeszahl, sie ist regional sehr ungleich.' },
  { id: 'markt', label: 'Markt & Menschen', claim: 'Wer zahlt, wer arbeitet, und was die Statistik nicht sagt.' },
]

export const POSTS: RoadmapPost[] = [
  {
    nr: 1, arc: 'tiere', status: 'veroeffentlicht', publishedOn: '2026-09-15',
    linkedInUrl: 'https://lnkd.in/p/eCD-uXDE',
    title: 'Heimtiere in Deutschland seit 1991',
    hook: 'Der Ziervogel war 1991 das häufigste Haustier in Deutschland. Heute ist er ein Randthema, die Katze führt mit großem Abstand.',
    figures: ['1991: Ziervögel 6,8 Mio., Katzen 5,3 Mio., Hunde 4,6 Mio.', '2025: Katzen 15,7 Mio., Hunde 10,0 Mio., Ziervögel 3,3 Mio.', 'Der Tierärzte Atlas beziffert den Zuwachs über 20 Jahre auf plus 50 Prozent auf über 34 Mio. Heimtiere'],
    sampleId: 'heimtiere', chart: 'line', dataStatus: 'belegt',
  },
  {
    nr: 2, arc: 'praxis', status: 'veroeffentlicht', publishedOn: '2026-09-17',
    linkedInUrl: 'https://lnkd.in/p/eQD4vrf8',
    title: 'Die Kleintierpraxis wird zum Normalfall',
    hook: 'Die logische Folgefrage zu Post 1: Was hat der Wandel bei den Tieren mit den Praxen gemacht? 1991 war die gemischte Praxis der Regelfall.',
    figures: ['1991: 4.086 gemischt, 2.298 nur Kleintiere, 1.859 nur Großtiere', '2002 Gleichstand auf die Person genau: 4.419 zu 4.419', '2025: 5.930 Kleintierpraxen, 52,9 Prozent aller Praxisinhaber (54,4 Prozent derer mit Schwerpunktangabe)'],
    sampleId: 'praxisschwerpunkte', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Versatz 2019 durch getrennte Pferde-Abfrage – im Post erklären, nicht verstecken.',
    refs: [1],
  },
  {
    nr: 3, arc: 'tiere', status: 'naechster',
    title: 'Hund oder Katze – die Welt',
    hook: 'Weltweit gibt es mehr Hunde als Katzen. Noch. In 84 von 197 Ländern verschiebt sich das Verhältnis seit 2000, fast immer zur Katze.',
    figures: ['Weltweit 2026 (Modell): 521 Mio. Hunde, 443 Mio. Katzen; Euromonitor 2018: 471 zu 373 Mio.', 'Japan: Hundeanteil 57 auf 41 Prozent, China 2024: 71,5 Mio. Katzen gegen 52,6 Mio. Hunde', 'Deutschland: 15,7 Mio. Katzen, 10,0 Mio. Hunde (2025)', 'Die Zahl der Länder mit Hundemehrheit bleibt fast gleich (130 auf 133) – der Abstand schrumpft'],
    sampleId: 'hund-katze-welt', chart: 'map', dataStatus: 'teilweise',
    dataNote: 'Für die meisten Länder modelliert, als Beispieldaten markiert; im Post offen sagen und die Methode in den Kommentar. Format 1:1 oder 4:5. Ersetzt den früheren Post „Hund und Katze allein“.',
    refs: [1],
  },
  {
    nr: 4, arc: 'praxis', status: 'geplant', vorabOnline: true,
    title: 'Angestellte überholen die Praxisinhaber',
    hook: '2024 ist etwas passiert, das es in der deutschen Tiermedizin noch nie gab. Der Beruf wächst, die Selbstständigkeit nicht.',
    figures: ['1991: 8.510 Inhaber zu 1.880 Angestellten', '2024 kippt es: 11.264 zu 11.990', '2025: 11.216 zu 12.125', 'Höchststand der Inhaber war 2019 mit 12.019'],
    sampleId: 'inhaber-angestellte', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Eigener, zugespitzter Datensatz mit nur zwei Reihen. Der volle Datensatz „Tierarztpraxen im Wandel“ enthält auch „Tierärztlich Tätige gesamt“ mit 34.476 – damit reicht die Y-Achse bis 35.000 und der Wechsel ist nicht mehr zu sehen.',
    refs: [2],
  },
  {
    nr: 5, arc: 'praxis', status: 'geplant',
    title: 'Die Nachfrage wächst, die Zahl der Praxen nicht',
    hook: 'Dasselbe Bild mit zweiter Achse: Hunde und Katzen gegen Praxisinhaber. Zwei Kurven, die auseinanderlaufen.',
    figures: ['2012: rechnerisch 1.655 Hunde und Katzen je Praxisinhaber', '2025: 2.291', 'Hunde und Katzen zusammen: 9,9 Mio. (1991) auf 25,7 Mio. (2025)'],
    sampleId: 'tieraerzteschaft-deutschland', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Heimtierzahlen haben 2012 einen Methodenbruch (ZZF/IVH). Den Vergleich erst ab 2012 beschriften.',
    refs: [4, 1],
  },
  {
    nr: 6, arc: 'ketten', status: 'geplant',
    title: 'Wer die Tierarztpraxen kauft',
    hook: 'Die Antwort auf die offene Frage aus Post 4: Wenn immer weniger Menschen eine eigene Praxis führen, wem gehören die Praxen dann?',
    figures: ['Tierärzte Atlas, August 2024: rund 450 Standorte von 16 Praxisketten – die einzige belastbare Gesamtzahl', '2026: IVC Evidensia über 120 Standorte, Tierarzt Plus Partner über 110, AniCura 78', 'Bei rund 10.000 Praxen sind das etwa 4,5 Prozent der Standorte, aber ein deutlich höherer Umsatzanteil'],
    sampleId: 'ketten', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Keine amtliche Statistik; der Tierärzte Atlas im Deutschen Tierärzteblatt 2/2025 sagt das selbst. Die Langfassung steht als Artikel auf der Seite und gehört in den ersten Kommentar.',
    refs: [4],
  },
  {
    nr: 7, arc: 'ketten', status: 'geplant',
    title: '2015 gab es diesen Markt noch nicht',
    hook: 'Die Konsolidierung ist keine alte Entwicklung. AniCura hatte im Februar 2016 acht Standorte in Deutschland.',
    figures: ['AniCura: 8 Standorte (02/2016), 30 (06/2018), 78 (2026)', 'Evidensia Deutschland GmbH: gegründet Anfang 2016', 'Tierarzt Plus: 2018 gegründet, 2026 bei 106'],
    sampleId: 'ketten', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Bei IVC Evidensia sind nur 2016, 2018 und 2021 belegt, für 2019 und 2020 gibt es bei keiner Gruppe einen Beleg. Die Linie dazwischen ist eine Annahme – im Post erwähnen.',
    refs: [6],
  },
  {
    nr: 8, arc: 'ketten', status: 'geplant',
    title: 'Nicht jede Gruppe gehört einem Fonds',
    hook: 'In der Debatte klingt Kette immer nach Private Equity. TeamVet und Cadomo Vets zeigen, dass es auch anders geht.',
    figures: ['TeamVet: 27 Standorte, Gesellschafterstruktur ausdrücklich ohne Investmentfonds', 'Cadomo Vets: von Tierärzten gegründet und geführt, 4 Praxen', 'Dagegen: IVC Evidensia (EQT, Silver Lake), AniCura (Mars), Tierarzt Plus (Inflexion)'],
    sampleId: 'ketten', chart: 'bar', dataStatus: 'belegt',
    refs: [6, 7],
  },
  {
    nr: 9, arc: 'ketten', status: 'geplant',
    title: '1.300 Praxen, die niemandem gehören',
    hook: 'VetFamily wird oft in einem Atemzug mit den Ketten genannt und ist doch das Gegenteil: eine Einkaufsgemeinschaft selbstständiger Praxen.',
    figures: ['Über 1.300 Mitgliedspraxen in Deutschland, über 5.000 weltweit', '2000 in Dänemark von 13 selbstständigen Tierärzten gegründet', 'Besitzt keine einzige Praxis', 'Ebenso: Smartemis rund 90 Partner, vezzgroup rund 14, OneVet als Einkaufsnetzwerk'],
    dataStatus: 'teilweise',
    dataNote: 'Nur der aktuelle Mitgliederstand ist belegt, keine Zeitreihe. Für ein Video müsste die Mitgliederentwicklung recherchiert werden – sonst als Text-Post mit einem Vergleichsbalken.',
    refs: [6, 8, 10],
  },
  {
    nr: 10, arc: 'ketten', status: 'geplant',
    title: 'Gründen statt kaufen',
    hook: 'Zwei Start-ups gehen den umgekehrten Weg: filu und Rex kaufen keine Praxen auf, sie eröffnen neue.',
    figures: ['filu: 11 Standorte', 'Rex: 13 Praxen', 'Wolf & Tiger: 3 Standorte in Berlin, Stuttgart und Dresden, von Tierärzt:innen gegründet', 'Belegt ist bei allen drei nur der Stand 2026, keine Zeitreihe'],
    dataStatus: 'teilweise',
    dataNote: 'Standortzahlen sind Eigenangaben ohne Zeitreihe. Eröffnungsdaten je Standort wären recherchierbar und ergäben ein echtes Rennen.',
    refs: [6, 8, 9],
  },
  {
    nr: 11, arc: 'praxis', status: 'geplant',
    title: 'Die stille dritte Gruppe',
    hook: 'Neben Inhabern und Angestellten wächst eine dritte Gruppe, über die niemand spricht: Tierärztinnen und Tierärzte außerhalb von Praxen.',
    figures: ['1991: 6.759', '2025: 11.135', 'Veterinärämter, Überwachung, Industrie, Forschung, Lehre'],
    sampleId: 'tieraerzteschaft-deutschland', chart: 'line', dataStatus: 'belegt',
    refs: [4],
  },
  {
    nr: 12, arc: 'fach', status: 'geplant',
    title: 'Worauf sich Tierärztinnen und Tierärzte spezialisieren',
    hook: 'Die Fachtierarzt-Titel zeigen dieselbe Drehung wie die Praxen, nur schärfer.',
    figures: ['Kleintiere: 919 (2007) auf 1.410 (2025)', 'Rinder: 860 auf 596', 'Öffentliches Veterinärwesen bleibt mit 1.950 die größte Gruppe'],
    sampleId: 'fachtieraerzte', chart: 'bar', dataStatus: 'belegt',
    dataNote: '2015 bis 2017 und 2020 hat die BTK nicht veröffentlicht, diese Jahre sind interpoliert.',
    refs: [2],
  },
  {
    nr: 13, arc: 'fach', status: 'geplant',
    title: 'Die Gebiete, die es vorher nicht gab',
    hook: 'Kleintierchirurgie und Innere Medizin der Kleintiere sind praktisch neu – und wachsen schneller als alles andere.',
    figures: ['Kleintierchirurgie: 4 Titelträger 2007, 194 im Jahr 2025', 'Innere Medizin der Kleintiere: 54 (2018) auf 165', 'Zum Vergleich: Geflügel 305 auf 254'],
    sampleId: 'fachtieraerzte', chart: 'line', dataStatus: 'belegt',
    refs: [12],
  },
  {
    nr: 14, arc: 'fach', status: 'geplant',
    title: 'Was verschwindet: Rind, Schwein, Lebensmittel',
    hook: 'Die Gegenbewegung zu Post 13. Drei Fächer, die seit 2007 deutlich schrumpfen und nie mehr an ihren Ausgangswert herankommen.',
    figures: ['Rinder: 860 auf 596', 'Schweine: 667 auf 561', 'Lebensmittelhygiene: 634 auf 419'],
    sampleId: 'fachtieraerzte', chart: 'line', dataStatus: 'belegt',
    refs: [13, 23],
  },
  {
    nr: 15, arc: 'fach', status: 'geplant',
    title: 'Der größte Arbeitgeber heißt Amt',
    hook: 'Die größte Fachtierarztgruppe arbeitet nicht in der Praxis, sondern im Öffentlichen Veterinärwesen.',
    figures: ['1.398 (2007) auf 1.950 (2025)', 'Größer als Kleintiere (1.410)', 'Passt zur dritten Gruppe aus Post 11'],
    sampleId: 'fachtieraerzte', chart: 'bar', dataStatus: 'belegt',
    refs: [11, 12],
  },
  {
    nr: 16, arc: 'fach', status: 'geplant',
    title: 'Warum das Pferd 2019 aus der Statistik fiel',
    hook: 'Ein Methodik-Post, der Vertrauen schafft: Wie eine geänderte Fragebogenzeile einen ganzen Verlauf unvergleichbar macht.',
    figures: ['Bis 2019 wurden Pferde „zu den Nutztieren gezählt und unter der Rubrik Großtiere erhoben“ (BTK)', 'Versatz 2018 auf 2019: gemischt 4.554 auf 3.381', 'Gegenprobe 2023: 53,9 Prozent Kleintiere passt zur BTK-Angabe „mehr als 50 Prozent“'],
    sampleId: 'praxisschwerpunkte', chart: 'line', dataStatus: 'belegt',
    refs: [2],
  },
  {
    nr: 17, arc: 'tiere', status: 'geplant',
    title: 'Der Absturz des Deutschen Schäferhunds',
    hook: 'Der leichte Post für Reichweite, und trotzdem eine echte Geschichte über 30 Jahre Geschmackswandel.',
    figures: ['1992: 28.000 Welpen im VDH-Zuchtbuch', '2025: 6.374', 'Der Teckel fällt von 14.208 auf 4.508'],
    sampleId: 'hunderassen', chart: 'bar', dataStatus: 'belegt',
    refs: [1],
  },
  {
    nr: 18, arc: 'tiere', status: 'geplant',
    title: 'Die neuen Lieblinge',
    hook: 'Wer den Platz eingenommen hat: Retriever und Hütehunde statt Wachhunde.',
    figures: ['Labrador: 685 (1992) auf 2.401', 'Golden Retriever: 943 auf 2.007', 'Australian Shepherd: 7 (1996) auf 493', 'Malinois: von null auf 884'],
    sampleId: 'hunderassen', chart: 'bar', dataStatus: 'belegt',
    refs: [17],
  },
  {
    nr: 19, arc: 'tiere', status: 'geplant',
    title: 'Die beliebteste Rasse fehlt in der Statistik',
    hook: 'Ein zweiter Methodik-Post, diesmal an einem Beispiel, das jeder kennt: Die Französische Bulldogge taucht im VDH-Zuchtbuch kaum auf.',
    figures: ['Französische Bulldogge im VDH: Höchststand 325 Welpen (2010), 2025 nur noch 43', 'Der VDH registriert nur Würfe seiner Mitgliedsvereine', 'Was daran für die Praxis relevant ist: Zucht außerhalb der Verbandsstrukturen'],
    sampleId: 'hunderassen', chart: 'line', dataStatus: 'belegt',
    dataNote: 'Hier wäre eine zweite Quelle stark: Zahlen aus Tierversicherungs- oder Heimtierregisterdaten. Bisher nicht recherchiert.',
    refs: [18],
  },
  {
    nr: 20, arc: 'karte', status: 'geplant',
    title: 'Tierärztinnen und Tierärzte je Bundesland',
    hook: 'Der Einstieg in die Regionalserie. 17 Kammern in 16 Ländern, 24 Jahre, und ein sehr ungleiches Wachstum.',
    figures: ['Bayern: 6.070 (2002) auf 8.938 (2025)', 'Nordrhein-Westfalen: 4.626 auf 7.432', 'Hamburg: 398 auf 654'],
    sampleId: 'tieraerzte-bundesland', chart: 'map', dataStatus: 'belegt',
    refs: [4],
  },
  {
    nr: 21, arc: 'karte', status: 'geplant',
    title: 'Wo die Kleintiermedizin wächst',
    hook: 'Dieselbe Karte, nur auf den Schwerpunkt Kleintiere gefiltert – und plötzlich holen ganz andere Länder auf.',
    figures: ['Nordrhein-Westfalen und Bayern führen durchgehend', 'Am stärksten wachsen Brandenburg (128 auf 229) und Rheinland-Pfalz (158 auf 281)', 'Reihe endet 2018, danach ändert die BTK die Kategorien'],
    sampleId: 'kleintiere-bundesland', chart: 'map', dataStatus: 'belegt',
    refs: [20, 2],
  },
  {
    nr: 22, arc: 'karte', status: 'geplant',
    title: 'Versorgung je Einwohner statt in absoluten Zahlen',
    hook: 'Absolute Zahlen bevorzugen große Länder. Interessant wird es erst pro Kopf – oder pro Hund und Katze.',
    figures: ['Zu berechnen: Tierärzt:innen je 100.000 Einwohner je Bundesland', 'Erwartung: Stadtstaaten vorn, Flächenländer im Osten hinten', 'Bevölkerungszahlen von Destatis'],
    dataStatus: 'offen',
    dataNote: 'Braucht eine Bevölkerungsreihe je Bundesland 2002–2025 von Destatis. Danach ist es eine reine Division auf den vorhandenen Kammerdaten.',
    refs: [20, 21],
  },
  {
    nr: 23, arc: 'karte', status: 'geplant',
    title: 'Vier von zehn Rindern sind verschwunden',
    hook: 'Warum die Nutztierpraxis schrumpft, sieht man am besten an den Tieren selbst.',
    figures: ['Bayern: 4,65 Mio. (1991) auf 2,71 Mio. (2025)', 'Niedersachsen: 3,13 Mio. auf 2,24 Mio.', 'Sachsen-Anhalt: 499.000 auf 255.000'],
    sampleId: 'rinder-bundesland', chart: 'bar', dataStatus: 'belegt',
    dataNote: 'Stichtag der Zählung wechselt (Dezember bis 1997, ab 1999 überwiegend Mai). Steht im Untertitel.',
    refs: [14, 24],
  },
  {
    nr: 24, arc: 'praxis', status: 'geplant',
    title: 'Was aus der Nutztierpraxis geworden ist',
    hook: 'Die unbequeme Reihe des Schwerpunkte-Datensatzes: die reine Nutztierpraxis. Und warum die Zahl ab 2019 wieder steigt, ohne dass es mehr Nutztierpraxen gibt.',
    figures: ['1991: 1.859 (erster gesamtdeutscher Wert)', '2018: Tiefpunkt bei 971', '2019 springt sie auf 1.713 – wegen der neuen Pferde-Kategorie, nicht wegen neuer Praxen'],
    sampleId: 'praxisschwerpunkte', chart: 'line', dataStatus: 'belegt',
    refs: [16, 23],
  },
  {
    nr: 25, arc: 'markt', status: 'geplant',
    title: 'Wofür Herrchen und Frauchen ihr Geld ausgeben',
    hook: 'Der Wechsel auf die Ausgabenseite. Relevant für jede Praxis, die noch Zubehör verkauft.',
    figures: ['Katzenfutter: 1.486 Mio. Euro (2011) auf 2.315 Mio. (2025)', 'Hundefutter: 1.146 auf 1.753', 'Bedarfsartikel im Laden: 916 auf nur 1.063'],
    sampleId: 'heimtiermarkt', chart: 'bar', dataStatus: 'belegt',
    refs: [1, 3],
  },
  {
    nr: 26, arc: 'markt', status: 'geplant',
    title: 'Der Online-Handel überholt den Laden',
    hook: 'Die Zuspitzung von Post 25, mit einem klaren Jahr als Wendepunkt.',
    figures: ['Online-Handel: rund 400 Mio. Euro (2013) auf 1.521 Mio. (2025)', '2022 überholt er die Bedarfsartikel im stationären Handel', 'Bedarfsartikel wachsen im selben Zeitraum kaum'],
    sampleId: 'heimtiermarkt', chart: 'line', dataStatus: 'belegt',
    refs: [25],
  },
  {
    nr: 27, arc: 'markt', status: 'geplant',
    title: 'Der Tiergesundheitsmarkt',
    hook: 'Was in Deutschland mit Tierarzneimitteln umgesetzt wird, nicht mit Futter – und wie groß das Kleintiersegment daran ist.',
    figures: ['2025: 1.098 Mio. Euro, plus 4,7 Prozent', 'Heimtiere stehen für 60,6 Prozent des Umsatzes', 'Zum Vergleich der ganze Markt: 5,1 Mrd. Euro Umsatz aller veterinärmedizinischen Unternehmen 2022 (Destatis, zitiert im Tierärzte Atlas)', 'Auf rund 1.000 Praxen entfällt die Hälfte des Branchenumsatzes'],
    dataStatus: 'teilweise',
    dataNote: 'Der Wert für 2025 stammt aus der Jahresmeldung des Bundesverbands für Tiergesundheit, die Umsatzverteilung aus dem Tierärzte Atlas 2024. Für ein Video fehlt die Reihe der Vorjahre, die der BfT jährlich veröffentlicht.',
    refs: [25, 26, 6],
  },
  {
    nr: 28, arc: 'markt', status: 'geplant',
    title: 'Die Tiermedizin wird weiblich',
    hook: 'Die vielleicht größte Veränderung des Berufs steht in keiner der bisherigen Kurven.',
    figures: ['2025: 66,8 Prozent der Kammermitglieder und 71,7 Prozent der tierärztlich Tätigen sind Frauen', 'Der Tierärzte Atlas schlüsselt auf: 58 Prozent der Selbstständigen, aber 82 Prozent der angestellten Tierärzt:innen sind weiblich', 'Bei den unter 40-Jährigen sind es 82 Prozent, unter den Studierenden 87', 'Höchster Frauenanteil im Öffentlichen Dienst mit 74 Prozent', 'In den nächsten 15 Jahren scheiden fast zwei Drittel der noch tätigen Männer aus – besonders unter den Praxisinhabern'],
    dataStatus: 'teilweise',
    dataNote: 'Alle Einzelwerte sind belegt (BTK-Meldung 2025, Tierärzte Atlas 2024). Für ein Video fehlt die Reihe seit 1991; sie steht in den Jahrgängen der Statistik und muss noch ausgelesen werden – dieselbe Quelle wie Datensatz 1.',
    refs: [4, 15],
  },
  {
    nr: 29, arc: 'markt', status: 'geplant',
    title: 'Was die Statistik nicht sagt',
    hook: 'Der ehrliche Post zum Schluss der Reihe: Jede dieser Kurven hat Grenzen, und die gehören dazu.',
    figures: ['Die BTK zählt Personen, keine Vollzeitstellen', 'Ketten erhebt sie gar nicht', 'Ab 2019 antworten nur noch 91 bis 96 Prozent der Niedergelassenen auf die Schwerpunktfrage'],
    dataStatus: 'belegt',
    dataNote: 'Kein eigenes Video nötig, eher ein Karussell oder ein Textpost mit Standbildern aus der Reihe.',
    refs: [16, 19, 6, 22, 27, 28],
  },
  {
    nr: 30, arc: 'markt', status: 'geplant',
    title: 'Das Werkzeug hinter der Reihe geht online',
    hook: 'Auflösung des Teasers: Alle Videos dieser Reihe sind mit demselben selbstgebauten Tool entstanden, und ab jetzt kann es jeder benutzen.',
    figures: ['Läuft komplett im Browser, keine Daten verlassen das Gerät', 'Alle Beispieldatensätze mit Quelle und Dateninfo enthalten', 'Kostenlos und Open Source unter MIT'],
    dataStatus: 'belegt',
    dataNote: 'Setzt voraus, dass die Seite bis dahin wirklich online ist.',
    refs: [1, 29],
  },
]
