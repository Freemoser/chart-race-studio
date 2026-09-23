# Beispiel-Datensätze

Alle mitgelieferten Datensätze (`src/samples/data.ts`, erzeugt mit `node scripts/build-samples.mjs` aus den Rohdaten in `data/raw/`) enthalten **ausschließlich recherchierte, reale Zahlen** aus den unten genannten Quellen. Nichts wurde geschätzt oder aufgefüllt; fehlende Werte sind `null` und werden in der App per „Datenlücken auffüllen“ interpoliert. Die ausführliche Rechercheliste mit allen Einzelquellen, PDF-Links und Qualitätsnotizen steht in [`DATASETS-RESEARCH.md`](./DATASETS-RESEARCH.md).

## 1. Tierarztpraxen im Wandel: Inhaber vs. Angestellte (1991–2025)

- **Quelle:** Bundestierärztekammer (BTK), „Statistik: Tierärzteschaft in der Bundesrepublik Deutschland“, jährlich im Deutschen Tierärzteblatt, Stand 31.12. – <https://www.bundestieraerztekammer.de/btk/statistik/>. Für 1991–1995: Zusammenstellung derselben Jahresstatistiken in Maure, S. (1998), Dissertation FU Berlin, sowie Schöne & Ulrich (1992) für 1991; Details in [`DATASETS-RESEARCH-1990.md`](./DATASETS-RESEARCH-1990.md).
- **Reihen:** Niedergelassene Tierärzt:innen (Praxisinhaber), Angestellte Tierärzt:innen in Praxen, Tätig außerhalb von Praxen, Tierärztlich Tätige gesamt (ab 2002), sowie auf der rechten Achse Hunde und Katzen in Mio. (IVH/ZZF, ab 2004).
- **Warum die Praxiszahlen nicht die Gesamtzahl ergeben:** „Tierärztlich Tätige“ zählt **alle Tätigkeitsbereiche**, nicht nur Praxen. Neben der Praxis sind das vor allem öffentliches Veterinärwesen (Veterinärämter, Fleischhygiene), Industrie und freie Wirtschaft, Hochschulen, Forschungsanstalten, Bundeswehr, Auslandstätigkeit und sonstige veterinärmedizinische Tätigkeiten. Rund ein Drittel der tierärztlich Tätigen arbeitet außerhalb von Praxen, und dieser Anteil ist seit Jahren stabil. Die Reihe **„Tätig außerhalb von Praxen“ ist von uns berechnet** als Tätige minus Niedergelassene minus Angestellte; sie enthält damit auch die wenigen Praxisvertreter:innen (1991: 170 Personen). Die vollständige Aufgliederung für 1991 (Schöne & Ulrich 1992) summiert sich exakt auf die publizierte Zahl der Tätigen und ist in [`DATASETS-RESEARCH-1990.md`](./DATASETS-RESEARCH-1990.md) dokumentiert.
- **Was gezählt wird – und was nicht:** Die BTK-Statistik erfasst ausschließlich **approbierte Tierärztinnen und Tierärzte** als Kammermitglieder, und zwar als **Personen, nicht als Vollzeitäquivalente**. Die Kategorie hieß in der Statistik lange „Praxisassistenten“ und meint **angestellte Tierärzt:innen**; die BTK selbst schreibt seit 2024 „Angestellte“. **Tiermedizinische Fachangestellte (TFA) sind darin nicht enthalten** – sie sind keine Kammermitglieder und tauchen in keiner BTK-Statistik auf. Zum Vergleich: Die Bundesagentur für Arbeit zählte zum 31.12.2022 rund 25 800 TFA (davon 7 467 Auszubildende), der bpt nennt für 2024 rund 22 800 sozialversicherungspflichtig beschäftigte TFA. Eine Klinik mit 8 Tierärzt:innen und 25 TFA erscheint in diesem Datensatz also nur mit den 8 Personen.
- **Abdeckung und Lücken je Reihe:**
  - *Angestellte Tierärzt:innen*: **lückenlos 1991–2025**. 1991–2001 aus Friedrich (2007, Dissertation TiHo Hannover, Tab. 6, nach den DTBl-Statistiken); diese Reihe weist die Assistent:innen ohne Praxisvertreter:innen aus, also so abgegrenzt wie die heutige BTK-Statistik. Ab 2003 BTK direkt, 2002 interpoliert.
  - *Niedergelassene*: **lückenlos 1991–2025**, seit 1994–2001 aus dem Agrarstatistischen Jahrbuch 2001 (Tab. 166) ergänzt werden konnten. In den Überschneidungsjahren 1994, 1995 und 1998 stimmt diese Reihe exakt mit den anderen Quellen überein.
  - *Tierärztlich Tätige* und damit auch *Tätig außerhalb von Praxen*: 1991, 1994–2000 und ab 2002. Es fehlen 1992, 1993 und 2001, die interpoliert werden. Der berechnete Wert für 1991 (6 759) stimmt exakt mit der Summe der publizierten Einzelbereiche überein: öffentliches Veterinärwesen 3 701, akademische Bildungsstätten 1 201, Industrie und freie Wirtschaft 879, sonstige veterinärmedizinische Tätigkeiten 530, Praxisvertretung 170, Auslandstätigkeit 139, Bundeswehr 71, Forschungsanstalten 68.
  - 1990 wurde weggelassen, weil der Wert nur die alten Bundesländer umfasst.
- **Vergleichsachse Hunde + Katzen:** IVH-Schätzungen bis 2011, IMR-Erhebung 2012, Skopos ab 2013. Der Sprung 2011→2012 ist ein Methodenwechsel, keine reale Verdopplung. Die Reihe wird bewusst als **eine durchgehende Linie** gezeichnet; der Hinweis auf den Methodenwechsel steht in der Quellenzeile des Datensatzes und wird so ins Video eingebrannt. Die Reihe beginnt 1991 und ist bis auf das Jahr 1992 lückenlos; 1992 überspringt die Verbandsreihe selbst und wird interpoliert. Ein **nationales Heimtierregister existiert nicht** – Hunde werden nur kommunal für die Hundesteuer erfasst, Katzen gar nicht, TASSO und FINDEFIX sind freiwillig. Alle Zahlen sind daher Umfrage-Hochrechnungen. Details in [`DATASETS-RESEARCH-GAPS.md`](./DATASETS-RESEARCH-GAPS.md).
- **Wichtig zur Einordnung „Anzahl Tierarztpraxen“:** Die BTK zählt **Personen, keine Praxen**. Die Zahl der Niedergelassenen (selbstständige Praxisinhaber:innen in Einzel-, Gemeinschafts- und Gruppenpraxen) ist der beste öffentlich verfügbare Näherungswert für die Praxenzahl. Eine amtliche Praxenstatistik gibt es in Deutschland nicht.
- **Geschichte in den Daten:** Niedergelassene 10 475 (2002) → Höchststand 12 019 (2019) → 11 216 (2025); Praxisassistent:innen 4 035 (2004) → 12 125 (2025). **2024 überholen die Angestellten erstmals die Inhaber.**
- **Datenqualität:** vollständig ab 2002; Praxisassistent:innen ab 2004 ausgewiesen. Bis 2011 hieß die Kategorie „Praktizierende Tierärzte“.
- **Attribution:** „Quelle: Bundestierärztekammer, Statistik Tierärzteschaft 2002–2025 (Deutsches Tierärzteblatt)“

## 1b. Angestellte überholen die Praxisinhaber (1991–2025)

- **Quelle:** wie Datensatz 1, Statistik der Deutschen Tierärzteschaft der Bundestierärztekammer.
- **Warum ein eigener Datensatz:** Zugespitzte Fassung mit genau zwei Reihen. Datensatz 1 enthält zusätzlich „Tierärztlich Tätige gesamt“ mit 34 476 – damit reicht die Y-Achse bis 35 000 und der Wechsel bei 11 000 zu 12 000 ist im Video nicht mehr zu erkennen. Ein `topN` hilft nicht, weil es die größten Reihen auswählt und die Gesamtreihe damit immer dabei wäre.
- **Kurze Reihennamen** („Praxisinhaber:innen“, „Angestellte in Praxen“), weil die Kopf-Labels im 1:1-Format sonst abgeschnitten werden.
- **Gegenprobe:** Der Tierärzte Atlas Deutschland 2024 schreibt für Ende 2023 „mit rd. 11 400 erstmals genauso viele angestellte wie selbstständige Tierärzt:innen“. Die Reihe zeigt 11 437 zu 11 429.
- **Die Aussage:** 1991 kamen auf jeden Angestellten viereinhalb Inhaber (8 510 zu 1 880). 2024 kippt es (11 264 zu 11 990), 2025 deutlicher (11 216 zu 12 125).

## 2. Tierärztinnen und Tierärzte je Bundesland (2002–2025)

- **Quelle:** BTK-Statistik (siehe oben), Mitglieder je Landestierärztekammer. Nordrhein und Westfalen-Lippe wurden zu Nordrhein-Westfalen summiert.
- **Reihen:** 16 Bundesländer, Kammermitglieder zum 31.12. (inkl. Ruhestand).
- **Datenqualität:** vollständig 2002–2025. Die Jahre 2002–2005 stammen aus den im Internet Archive erhaltenen BTK-Statistik-PDFs und sind doppelt belegt (Jahrestabelle plus die Rückschau-Tabelle der Ausgabe 2005); alle Kammersummen stimmen mit den publizierten Bundeswerten überein. Zwei quelleninterne Summenabweichungen (2017: 18 Personen, 2018: 10) sind in der Recherche dokumentiert.
- **Warum nicht ab 1991:** Für die Zeit vor 2002 gibt es keine Kammerdaten im Netz, und die BTK selbst weist in ihren Dokumenten mehrfach darauf hin, dass sie über keine älteren Kammerzahlen verfügt. Auffindbar war lediglich ein Einzelwert (Sachsen 1991: 1 035). Die älteren Tabellen existieren nur gedruckt im Deutschen Tierärzteblatt.
- **Zweck in der App:** Test für lange Kategorienamen („Mecklenburg-Vorpommern“, „Baden-Württemberg“) mit Labels außerhalb der Balken.

## 3. Heimtiere in Deutschland (1991–2025)

- **Quelle:** Industrieverband Heimtierbedarf (IVH) e.V. / Zentralverband Zoologischer Fachbetriebe (ZZF) e.V., Datenblatt „Der Deutsche Heimtiermarkt“, Populationszahlen aus der repräsentativen Haushaltsbefragung (Skopos) – <https://www.ivh-online.de/der-verband/daten-fakten/anzahl-der-heimtiere-in-deutschland.html>
- **Reihen:** Katzen, Hunde, Kleintiere, Ziervögel, Aquarien, Terrarien, Gartenteiche mit Zierfischen – in Millionen.
- **Datenqualität:** jährlich vollständig **1991–2025 mit Ausnahme von 1992**, das die Verbandsreihe selbst überspringt. 1991–2003 stammen aus den im Internet Archive erhaltenen ZZF-Jahresberichten „Der deutsche Heimtiermarkt – Struktur & Umsatzdaten“, 2004–2009 aus archivierten IVH-Datenblättern, ab 2010 aus den laufenden IVH/ZZF-Veröffentlichungen. Für 1997–2003 summieren sich die Einzelarten exakt auf die jeweils publizierte Gesamtzahl, was die Extraktion bestätigt.
- **Methodenwechsel, die als Sprünge sichtbar sind:** 1994 neue Berechnungsgrundlage für Ziervögel, 1999 Wechsel der Quelle auf den BBE-Branchenreport (der ZZF weist selbst darauf hin, dass 1995–1998 damit nicht vergleichbar sind), 2000 „neue Erhebungsmethoden“, 2002 Aufteilung der Aquarien in Aquarien, Gartenteiche und Terrarien (deshalb der Rückgang von 3,0 auf 1,9), 2012 erste repräsentative Erhebung (IMR) und 2013 Umstellung auf Skopos.
- **Korrekturen gegenüber früheren Ständen:** Die zunächst als 1999 geführten Werte stammten tatsächlich aus 1996 (die IVH-Website zeigte 2001 noch den alten Stand). Die aus Wikipedia übernommene Schätzung für 1992 widerspricht der zeitgenössischen Verbandsreihe und wurde entfernt. Katzen 2003 sind 7,3 Mio., nicht 7,5 Mio. (das ist der Wert für 2004). Details in [`DATASETS-RESEARCH-PETS.md`](./DATASETS-RESEARCH-PETS.md).
- **Attribution:** „Quelle: IVH/ZZF, ‚Der Deutsche Heimtiermarkt‘ (Datenblätter 2014–2025), Erhebung Skopos“

## 3b. Heimtiermarkt: Umsatz nach Segment (2011–2025)

- **Quelle:** ZZF/IVH, „Der Deutsche Heimtiermarkt – Struktur & Umsatzdaten“ – <https://www.ivh-online.de/der-verband/daten-fakten/der-deutsche-heimtiermarkt.html>
- **Reihen:** Katzenfutter, Hundefutter, Bedarfsartikel und Zubehör, Online-Handel, Futter für Kleintiere, Ziervogelfutter, Zierfischfutter – in Millionen Euro zu Endverbraucherpreisen.
- **Wichtig zur Abgrenzung:** Futter und Bedarfsartikel sind **stationärer Handel**. Der Online-Handel ist eine Schätzung über **alle** Segmente hinweg und deshalb bewusst eine eigene Größe, keine Teilmenge der anderen Balken. Er wächst von 400 Mio. Euro (2013) auf über 1 500 Mio. Euro und überholt 2022 die Bedarfsartikel im Laden.
- **Datenqualität:** 2011–2025 durchgehend für Katzenfutter, Hundefutter und Bedarfsartikel; Online-Handel ab 2013; die kleineren Futtersegmente (Kleintiere, Ziervögel, Zierfische) werden erst ab 2018 getrennt ausgewiesen und starten deshalb später. 2009 und 2010 fehlen in der Quelle, der Einzelwert für 2008 wurde deshalb weggelassen. Für 2024 weist die Quelle eine veränderte Datenbasis aus, der Vergleich mit 2023 ist laut ZZF nur bedingt möglich.
- **Attribution:** „Quelle: ZZF/IVH, Der Deutsche Heimtiermarkt“

## 3c. Praxisschwerpunkte: Die Kleintierpraxis wird zum Normalfall (1990–2025)

- **Quelle:** Bundestierärztekammer, jährliche Statistik im Deutschen Tierärzteblatt; 1990–1995 zitiert nach Maure (1998). Details in [`DATASETS-RESEARCH-KLEINTIER.md`](./DATASETS-RESEARCH-KLEINTIER.md).
- **Reihen:** Praxisinhaber:innen mit ausschließlich Kleintieren, mit gemischter Praxis und mit ausschließlich Nutz- bzw. Großtieren.
- **Die Kategorien heißen über die Jahre unterschiedlich**, meinen aber dasselbe Dreieck: 1990–1995 „Kleintierpraxis / Gemischtpraxis / Großtierpraxis“, 2001–2004 „Praxis für überwiegend Kleintiere / Groß- und Kleintiere / überwiegend Großtiere“, 2006–2018 „Kleintiere / Nutztiere und Kleintiere / Nutztiere“.
- **Die Reihen laufen durch bis 2025, ohne Schätzung.** Ab 2019 fragt die BTK Pferde getrennt ab. Bis dahin wurden Pferde laut BTK „zu den Nutztieren gezählt und unter der Rubrik ‚Großtiere‘ erhoben“ (Deutsches Tierärzteblatt 8/2024, S. 990). Damit lassen sich die neuen Kategorien definitorisch auf die alte Dreiteilung abbilden:
  - *Nur Kleintiere* = Kleintiere
  - *Nur Nutz- und Großtiere* = Nutztiere + Pferde + „Nutztiere und Pferde“
  - *Gemischt* = „Nutztiere und Kleintiere“ + „Kleintiere und Pferde“ + „Nutztiere, Pferde und Kleintiere“
- **Der Versatz 2018→2019 ist echt** (gemischt 4 554 → 3 381, Nutz-Gruppe 971 → 1 713) und eine Folge der neuen Abfrage, nicht der Praxislandschaft: Wer vorher nur „Nutztiere und Kleintiere“ ankreuzen konnte, antwortet heute differenzierter. Die BTK zeigt deshalb selbst keinen Verlauf, sondern nur die aktuelle Verteilung.
- **Gegenprobe:** Die einzige Verteilung, die die BTK nennt (2023: „mehr als 50 Prozent betreiben Kleintierpraxen, gut ein Viertel sind Gemischtpraxen“), wird von dieser Zuordnung getroffen – sie ergibt 53,9 Prozent Kleintiere und 28,8 Prozent gemischt. Eine zuvor geprüfte, trendbasierte Schätzung hätte 37,8 Prozent gemischt ergeben und der Quelle widersprochen; sie wurde deshalb verworfen.
- **Antwortquote:** Bis 2018 antworten 97 bis 99 Prozent der Niedergelassenen auf diese Frage, ab 2019 nur noch 91 bis 96 Prozent. 2024 liegt die Summe über der Gesamtzahl, dort waren Mehrfachantworten möglich. Die absoluten Werte ab 2019 sind deshalb leicht untererfasst.
- **Vierte Reihe „Ketten (Standorte)“** – bewusst eine andere Einheit und eine andere Quelle: Standorte der fünf größten Praxisketten laut dem Ranking von gesundheitsmarkt.de (2023: 222, 2024: 270, 2026: 344). Der Wert 2025 (307) ist linear zwischen 2024 und 2026 interpoliert, weil kein Ranking für 2025 erschienen ist; es ist der einzige berechnete Wert des Datensatzes. **Die Reihe darf nicht mit den BTK-Reihen verrechnet werden:** Wer seine Praxis an eine Gruppe verkauft, verschwindet aus der Inhaberzahl und erscheint als angestellte:r Tierärzt:in wieder – ein Kettenstandort und ein fehlender Inhaber sind weder dasselbe noch gegeneinander aufrechenbar. Die Reihe zeigt ausschließlich die Größenordnung: rund 300 Kettenstandorte gegenüber gut 11 000 Praxisinhaber:innen. Details in Abschnitt 3f.
- **Die Aussage:** 2002 ziehen die reinen Kleintierpraxen mit den gemischten gleich (jeweils 4 419), danach übernehmen sie. Bis 2018 wachsen sie auf 6 142, während die reinen Nutztierpraxen auf 971 fallen.

## 3d. Fachtierarzt-Gebiete (2007–2025)

- **Quelle:** Bundestierärztekammer, Statistik Tierärzteschaft 2007–2025 (Deutsches Tierärzteblatt), Tabellen zu den Gebietsbezeichnungen.
- **Reihen:** elf Gebiete, darunter Kleintiere, Kleintierchirurgie und Innere Medizin der Kleintiere sowie Rinder, Schweine, Pferde, Geflügel, Lebensmittel, Mikrobiologie, Pathologie und Öffentliches Veterinärwesen.
- **Zusammengeführte Bezeichnungen:** „Kleintiere, kleine Haustiere“ (bis 2004), „Klein- und Heimtiere“ (2005–2014) und „Kleintiere“ (ab 2018) sind laut BTK-Fußnote dasselbe Gebiet und bilden eine Reihe; ebenso „Lebensmittelhygiene“ und „Lebensmittel“.
- **Warum erst ab 2007:** 2005 zählt die Statistik nur Tierärzt:innen bis 65 Jahre und ist nicht vergleichbar, 2006 ist durch dieselbe Baden-Württemberg-Lücke verzerrt.
- **Lücken:** 2015–2017 und 2020 hat die BTK diese Tabellen nicht oder unvollständig veröffentlicht (die Seiten 4 bis 10 der PDF-Ausgabe 2020 sind leer), diese Jahre werden interpoliert.

## 3e. Wo die Kleintiermedizin wächst (2002–2018)

- **Quelle:** Bundestierärztekammer, Statistik Tierärzteschaft 2002–2018, Tabelle nach Kammerbereichen. Nordrhein und Westfalen-Lippe sind wie in den anderen Bundesland-Datensätzen zu Nordrhein-Westfalen addiert.
- **Reihen:** 16 Bundesländer, niedergelassene Tierärzt:innen mit Schwerpunkt Kleintiere.
- **Prüfung:** Die Summe der 17 Kammern wurde für jedes Jahr gegen den publizierten Bundeswert geprüft und stimmt in 21 von 23 Jahren. Die beiden Abweichungen liegen 2019 und 2024 und damit außerhalb des hier verwendeten Zeitraums; sie sind quelleninterne Fehler, nicht Lesefehler, und in [`DATASETS-RESEARCH-KLEINTIER-BL.md`](./DATASETS-RESEARCH-KLEINTIER-BL.md) dokumentiert.
- **Warum 2002 bis 2018:** Vor 2002 veröffentlicht die BTK keine Kammerdaten. Ab 2019 gilt derselbe Bruch wie beim nationalen Datensatz (Pferde als eigene Kategorie), und mehrere Kammern melden seither „k. A.“ – Bremen durchgehend, Mecklenburg-Vorpommern fünf Jahre, dazu Sachsen-Anhalt und Hamburg. In einem Balkenrennen würden diese Länder scheinbar verschwinden, deshalb endet die Reihe 2018.
- **Lücken:** 2005 enthält die Statistik eine gekürzte Tabelle ohne diese Zahlen, 2006 ist durch die Fehlmeldung aus Baden-Württemberg unbrauchbar. Beide Jahre werden interpoliert.

## 3f. Wer die Tierarztpraxen kauft (Praxisketten, 2015–2026)

- **Quelle:** gesundheitsmarkt.de, jährliches Ranking der größten Betreiber von Tierarztpraxen (2023, 2024, 2026, Stichtag 2026: 08.07.2026), ergänzt um datierte Einzelmeldungen, Eigenangaben und Gründungsjahre. Quelle je Einzelwert in [`data/raw/ds11-ketten.json`](../data/raw/ds11-ketten.json).
- **Es gibt zu diesem Thema keine amtliche Statistik.** Die Bundestierärztekammer erhebt Ketten nicht.
- **Einheit:** Standorte (Praxen und Kliniken), nicht Personen. Nicht mit BTK-Zahlen verrechenbar.
- **Neun Gruppen:** IVC Evidensia, Tierarzt Plus Partner, AniCura, VetPartners, VetGruppen (Vetopia), Veternicum Nesto, TeamVet, Medivet (vormals SmartVet), Cadomo Vets.
- **Drei Arten von Werten**, in der Rohdatei als eigene Metrik geführt:
  1. *Ranking* (2023, 2024, 2026) – eine Quelle, eine Methode, aber nur die Top 5 je Jahrgang. Fehlt eine Gruppe, heißt das „nicht unter den ersten fünf“, nicht null.
  2. *Einzelbeleg* – datierte Meldung oder Eigenangabe: AniCura 8 (02/2016) und 30 (06/2018), Tierarzt Plus Partner 26 (2021), SmartVet 18 (2021), IVC Evidensia 60 (Bundeskartellamt, 27.06.2022), VetPartners 17 (09/2024), für 2026 TeamVet 24, Veternicum Nesto 23 (eigene Standortliste gezählt), Medivet 20, Cadomo Vets 4.
  3. *Belegte Null* – die deutsche Gesellschaft existierte noch nicht: Evidensia Deutschland Anfang 2016, Tierarzt Plus 2018, Veternicum Ende 2019, VetGruppen Deutschland 2021. Nur deshalb reicht die Reihe bis 2015 zurück.
- **Zusammengefasste Namen, damit nichts doppelt gezählt wird:** SmartVet (2005 gegründet, 2021 noch 18 eigene Praxen) gehört seit 2021 mehrheitlich und seit Ende 2023 vollständig zu **Medivet**. **Vetopia** (Axcel, 2021 aus VetGruppen DK und EMPET NO, über 220 Kliniken in acht Ländern) ist die Muttergruppe von **VetGruppen Deutschland**. **Nesto** (BE/LU) hat sich mit **Veternicum** zusammengeschlossen. Die fünf **activet**-Praxen (Weiterstadt, Hannover, Duisburg, Krefeld, Potsdam) gehören seit 01.08.2023 zu **Tierarzt Plus** und stecken in dessen Standortzahl.
- **VetFamily ist bewusst nicht enthalten – es ist keine Kette.** VetFamily ist eine Einkaufsgemeinschaft rechtlich selbstständiger Praxen, 2000 in Dänemark gegründet, mit über 1 300 Mitgliedspraxen allein in Deutschland. Sie besitzt keine Praxis. Wer sie als Kette zählt, kommt auf ein Vielfaches der tatsächlichen Kettengröße.
- **TeamVet ist ein Sonderfall** und deshalb in der Dateninfo gekennzeichnet: ein Verbund mit Beteiligungen, ausdrücklich ohne Investmentfonds im Gesellschafterkreis. Eigenangabe 24 Standorte, die Partnerliste der Website führt 33 Einträge.
- **Alle übrigen Jahre sind leer und werden interpoliert.** Bei IVC Evidensia liegen zwischen der Null von 2015 und den 60 Standorten von 2022 sieben Jahre ohne Beleg – die gerade Linie dort ist eine Annahme, kein Verlauf. Für 2025 ist kein Ranking erschienen.
- **Zählweisen gehen deutlich auseinander.** Bundeskartellamt 06/2022: IVC Evidensia 60; zm-online 11/2022: „über 70“. Tierarzt Plus nennt für Mitte 2024 selbst 96, das Ranking 86. Das Bayerische Landwirtschaftliche Wochenblatt schreibt im Oktober 2023 „rund 75“ für alle drei großen Gruppen, wo das Ranking 65, 64 und 61 zählt. Diese Werte stehen in der Rohdatei unter *Kontext* und gehen **nicht** in die Reihe ein, damit ein Quellenwechsel nicht wie ein Rückgang aussieht.
- **Größenordnung:** zm-online, 11/2022 – „nicht mehr als 200 Praxen und Kliniken in Investoren- beziehungsweise Konzernhand“ bei rund 10 000 Praxen. Die hier gezeigten neun Gruppen kommen für 2026 zusammen auf rund 415 Standorte.
- **Nicht in der Reihe:** Altano Gruppe (Dülmen, 15 Kliniken und Praxen an 26 Standorten, Schwerpunkt Pferd); filu (8 Praxen) und Rex (9 Praxen) gründen neu, statt aufzukaufen.
- **Die Aussage:** 2015 gab es diesen Markt in Deutschland praktisch nicht. 2026 führt IVC Evidensia mit 115 Standorten vor Tierarzt Plus Partner mit 106, während AniCura seit 2023 nur von 65 auf 69 wächst.

## 3g. Hund oder Katze – was ist wo häufiger? (Welt, 2020–2026)

- **Quelle:** FEDIAF für Europa, PetData (China Pet Industry White Paper 2025) und Abinpet (Censo Pet 2024) für China und Brasilien, World Population Review für weitere Länder. Vorlage war ein extern erstelltes Modellpaket.
- **Gezeigt wird** der Hundeanteil an der Summe aus Hunden und Katzen. 50 Prozent ist der Kipppunkt.
- **Überwiegend Modell, nicht Messung.** Berichtet sind 41 europäische Länder plus China und Brasilien. Für die übrigen rund 150 Länder stammt der Wert aus einer Regionsannahme — **je Weltregion ein einziger Hundeanteil für alle Länder dieser Region**. Daran erkennt man es auch: Alle 49 Länder südlich der Sahara tragen dieselbe Farbe, ebenso ganz Südamerika und ganz Nordafrika.
- **Die Animation bewegt nichts Gemessenes.** Zwischen 2020 und 2026 wechseln 21 von 197 Ländern die Stufe, alle 21 sind modelliert. Die Richtung ist systematisch, weil in der Vorlage Katzen in jeder Region schneller wachsen als Hunde. 2026 ist zu hundert Prozent Projektion.
- **Zwei Korrekturen gegen die Vorlage:** China war als Hundeland geführt (57 Mio. Hunde gegen 51 Mio. Katzen); gemessen sind es 52,58 Mio. Hunde und 71,53 Mio. Katzen, Katzen haben etwa 2021 überholt. Brasilien auf 63,7 Mio. Hunde. Damit kein Sprung entsteht, wurde die ganze Reihe des Landes um denselben Betrag verschoben; die Form des Verlaufs stammt weiter aus der Vorlage.
- **Gegenprobe Europa:** Die Summe des Datensatzes für 2024 entspricht der von FEDIAF veröffentlichten Europa-Gesamtzahl plus Russland, das FEDIAF seit 2022 nicht mehr führt.
- **Als `isExample` markiert**, weil der überwiegende Teil nicht belastbar recherchiert ist.

## 4. Beliebteste Hunderassen (VDH-Welpenstatistik, 1992–2025)

- **Quelle:** Verband für das Deutsche Hundewesen (VDH) e.V., Welpenstatistik der VDH-Mitgliedsvereine (Onlinetabelle) – <https://www.vdh.de/ueber-den-vdh/welpenstatistik/>
- **Reihen:** 47 Rassen (alle, die zwischen 1992 und 2025 mindestens einmal in den Top 20 waren), ohne Gesamtzahl.
- **Datenqualität:** vollständig 1992–2025, keine Reihe bricht zwischendurch ab. Die ursprüngliche Extraktion für 2011–2025 umfasste nur die damaligen Top-15-Rassen, wodurch 22 Rassen nach 2010 endeten – darunter Französische Bulldogge, Australian Shepherd, Mops und Chihuahua. Diese Lücke wurde aus derselben VDH-Tabelle nachgezogen und gegen die vorhandenen Werte geprüft: alle 360 bestehenden Zellen reproduzierten sich ohne Abweichung, die Spaltensummen stimmen mit der publizierten Gesamtzahl überein. Details in [`DATASETS-RESEARCH-HUNDERASSEN.md`](./DATASETS-RESEARCH-HUNDERASSEN.md). 1992–2010 stammen aus fünf archivierten Snapshots der alten VDH-Onlinetabelle (Internet Archive), gegen Wikipedia- und Presseangaben geprüft (z.B. Deutscher Schäferhund 1998 = 27 834). 1990 und 1991 sind nirgends online verfügbar. Nur Rassehunde mit VDH-Papieren.
- **Attribution:** „Quelle: VDH, Welpenstatistik der VDH-Mitgliedsvereine 2011–2025“

## 5. Rinderbestand je Bundesland (1991–2025)

- **Quelle:** Statistisches Bundesamt (Destatis), Viehbestandserhebung (Stichtag 3. November), aufbereitet in den Tabellen der BMEL-Statistik – <https://www.bmel-statistik.de/landwirtschaft/tierhaltung/viehbestand>
- **Lizenz:** Datenlizenz Deutschland – Namensnennung – Version 2.0 (dl-de/by-2-0).
- **Reihen:** 13 Flächenländer in 1 000 Tieren (Stadtstaaten weggelassen).
- **Datenqualität:** vollständig 1991–2025. 1991–2010 stammen aus der Eurostat-Regionaltabelle mit den von Destatis gelieferten Länderdaten, ab 2010 aus der BMEL-Aufbereitung; die 2010er Werte beider Quellen sind identisch, die Reihen fügen sich also nahtlos. Die Summe der Länder stimmt in jedem Jahr auf 0,3 Tausend genau mit dem Bundeswert überein.
- **Wichtig zum Stichtag:** Der Erhebungstermin wechselt über die Jahre – bis 1997 der 3. Dezember, 1998 der 3. November, ab 1999 überwiegend der 3. Mai, dazwischen einzelne Novembererhebungen (2007, 2010). Rinderbestände schwanken saisonal, die Unterschiede liegen bei ein bis zwei Prozent und damit deutlich unter dem langfristigen Rückgang. Der Hinweis steht im Untertitel des Datensatzes.
- **Der Einbruch Anfang der 1990er** in den neuen Ländern ist real und spiegelt die Auflösung der LPG-Tierbestände, kein Gebietsstandsbruch: Bereits die Dezemberzählung 1990 umfasst Gesamtdeutschland.
- **Attribution:** „Quelle: Statistisches Bundesamt (Destatis), Viehbestandserhebung; BMEL-Statistik (dl-de/by-2-0)“

## Dateninfo je Datensatz

Jeder Beispiel-Datensatz hat zwei Ebenen der Erklärung:

- `description` – **ein Satz** für die Kachel in der Oberfläche. Nennt die Kernaussage, keine Methodik.
- `dataInfo` – ein Array von Absätzen, das in der Oberfläche erst auf Klick erscheint. Hier gehört alles hin, was man zum Einordnen braucht: Was genau gezählt wird, welche Lücken es gibt, welche Methodenbrüche sichtbar sind, was berechnet oder geschätzt ist.

Faustregel: Wenn ein Satz mit „weil“, „außer“ oder einer Jahreszahl als Einschränkung beginnt, gehört er in `dataInfo`, nicht in `description`. Die Kacheln bleiben so überschaubar, und die Sorgfalt geht trotzdem nicht verloren.

## Rubriken in der Oberfläche

Die Beispiele sind in der App nach Rubriken gruppiert (`SAMPLE_CATEGORIES` in `src/lib/data/types.ts`):

| Rubrik | Datensätze |
|---|---|
| Tierarztpraxen & Beruf | Inhaber vs. Angestellte, Angestellte überholen die Praxisinhaber, Praxisschwerpunkte, Fachtierarzt-Gebiete, Wo die Kleintiermedizin wächst, Tierärzt:innen je Bundesland, Wer die Tierarztpraxen kauft |
| Heimtiere & Markt | Hund oder Katze weltweit, Heimtiere nach Art, Heimtiermarkt-Umsatz, Beliebteste Hunderassen |
| Nutztiere | Rinderbestand je Bundesland |

Eine neue Rubrik anlegen: Eintrag in `SAMPLE_CATEGORIES` ergänzen, dann bei den Datensätzen in `src/samples/index.ts` das Feld `category` setzen. Die Reihenfolge der Rubriken in der Oberfläche entspricht der Reihenfolge im Array.

## Eigene Datensätze ergänzen

1. Rohdaten als Wide-Tabelle (`Jahr | Kategorie A | Kategorie B | …`) aufbereiten.
2. In `src/samples/data.ts` als `export const NAME = { headers, rows }` ablegen.
3. In `src/samples/index.ts` einen Eintrag mit `category`, Titel, Untertitel, Quelle, einsätziger `description`, `dataInfo` und `suggested`-Voreinstellungen anlegen. `isExample: true` setzen, wenn die Zahlen nicht belastbar sind – die App zeigt dann ein Badge „Beispieldaten“.
