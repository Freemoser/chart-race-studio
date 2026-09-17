# Lückenschluss-Recherche: Tierärztlich Tätige 1992–2001 und Hunde/Katzen 1993–2003 (Stand 14.09.2026)

Ergänzt `research-1990.md`, `ds1b-tieraerzte-1990-2001.json`, `ds2b-heimtiere-1990-2013.json`. Nur publizierte Originalzahlen mit URL; nichts geschätzt/interpoliert. Als „berechnet“ gekennzeichnet sind ausschließlich einfache Differenzen/Summen aus publizierten Zahlen derselben Quelle (Rechenweg jeweils angegeben). Rohdateien: `gaps/` (BTK-Pressemitteilungen `gaps/btkpm/`, IVH-Snapshots 2001 `gaps/ivh2001/`, Dissertationen `gaps/friedrich_wb.pdf|.txt`, `gaps/osburg_wb2.pdf|osburg.txt`, PZ-Artikel `gaps/pz_50_2002.html`, FEDIAF `gaps/fediaf/`, Statistische Jahrbücher `gaps/statjb/`).

Neue Dateien: `ds1c-taetige-1992-2001.json` (77 Zeilen), `ds2c-hunde-katzen-1993-2003.json` (25 Zeilen).

---

## Gap 1 – Tierärzteschaft 1992–2001

### Was neu gefunden wurde (Kernquellen)

1. **BTK-Pressemitteilung 6/99** „Sorgen um den Nachwuchs: Zahl der Tierärzte erstmals über 20.000“ (Juli 1999, zur Statistik Stand 31.12.1998, DTBl 6/1999) – Wayback: https://web.archive.org/web/20020725232744/http://www.bundestieraerztekammer.de:80/aktuelles/pm/pm99_006.html
2. **BTK-Pressemitteilung 2/98** „Keine Reklame von Tierärzten“ (1998; „9.538 praktische Tierärztinnen und Tierärzte … Stand 1.1.1998“) – https://web.archive.org/web/20020720092646/http://www.bundestieraerztekammer.de:80/aktuelles/pm/pm98_002_b.html
3. **BTK-Pressemitteilung 5/01** „Tiermediziner jenseits der 30.000“ (Juni 2001, zur Statistik Stand 31.12.2000, DTBl 6/2001) – https://web.archive.org/web/20020707000723/http://www.bundestieraerztekammer.de:80/aktuelles/pm/pm01_005.html
4. **Friedrich, B. J. (2007)**, Diss. TiHo Hannover „Untersuchungen zur beruflichen und privaten Situation tierärztlicher Praxisassistentinnen und -assistenten in Deutschland“, **Tab. 6: Praxisassistent(inn)en 1991–2005** (alte BL / neue BL / Berlin / gesamt, nach Schöne u. Ulrich 1992–2003, DTBl) – https://elib.tiho-hannover.de/servlets/MCRFileNodeServlet/etd_derivate_00001819/friedrichb_ws07.pdf (TiHo-Server mit Bot-Schutz; funktionierende Kopie: https://web.archive.org/web/2id_/https://elib.tiho-hannover.de/servlets/MCRFileNodeServlet/etd_derivate_00001819/friedrichb_ws07.pdf)
5. **Osburg, A. (2010)**, Diss. TiHo „Die Weiterbildung zum Fachtierarzt“, Anhang **Tab. 6** (Gesamtzahl TÄ In- und Ausland ohne Ruhestand 1958–2009 mit DTBl-Seitenangaben) – https://elib.tiho-hannover.de/servlets/MCRFileNodeServlet/etd_derivate_00001157/osburga_ws10.pdf (intakte Kopie: https://web.archive.org/web/20220308101234id_/… – die früher gespeicherten Wayback-Kopien waren abgeschnitten; die vollständige Datei hat 8,0 MB/340 Seiten). Inhalt: Fachtierärzte; für „tierärztlich Tätige“ nichts.

### Tabelle Jahr × Kennzahl (neu; Werte aus ds1b in Klammern zur Einordnung)

| Jahr (31.12.) | Kammermitglieder gesamt inkl. Ruhestand | ohne Ruhestand (In-+Ausland) | Tierärztlich Tätige (In-+Ausland, BTK-Abgrenzung wie 2002) | Bereich Praxis (niedergel. + Assist.) | Praxisinhaber (praktizierende) | Praxisassistent:innen (ohne Vertreter) | Quelle |
|---|---|---|---|---|---|---|---|
| 1990 | (18.163, alte BL) | **15.619** (alte BL inkl. Ost-Berlin) | | | | | Osburg Tab. 6 (Schöne u. Ulrich 1991) |
| 1991 | (23.844) | **20.610** | (17.149 Inland) | (10.560 inkl. Vertreter) | (8.510) | **1.880** | Osburg Tab. 6; Friedrich Tab. 6 |
| 1992 | (24.558) | **21.072** | – | | (8.514 ber.) | **1.966** | Osburg Tab. 6; Friedrich Tab. 6 |
| 1993 | (25.389) | (21.691) | – | | (8.632 ber.) | **2.198** | Friedrich Tab. 6 |
| 1994 | (26.118) | (22.279) | – | | (8.834 ber.) | **2.483** | Friedrich Tab. 6 |
| 1995 | (26.932) | (22.985) | – | | (9.046 ber.) | **2.685** | Friedrich Tab. 6 |
| 1996 | – | (23.676) | – | | – | **2.885** | Friedrich Tab. 6 |
| 1997 | (28.463) | (24.186) | – | **12.643** (berechnet) | **9.538** | **3.040** | BTK PM 2/98; PM 6/99; Friedrich |
| 1998 | **29.088** | (24.690) | **19.879** | **12.907** (berechnet) | **9.806** (berechnet) | **3.101** | BTK PM 6/99; Friedrich |
| 30.07.1999 (Zwischenstand) | 29.354 | | 20.072 | 13.088 | | | BTK PM 6/99 |
| 1999 | – | (25.154) | – | | – | **3.266** | Friedrich Tab. 6 |
| 2000 | **30.282** | (25.671) | – | „gut 14.000“ (gerundet) | – | **3.493** | BTK PM 5/01; Friedrich |
| 2001 | (30.897) | (26.147) | – | | – | **3.615** | Friedrich Tab. 6 |
| 2002 (ds1) | (31.461) | (26.564) | (21.931) | (14.612 inkl. 325 Vertreter) | (10.475) | (3.784 – identisch bei Friedrich) | |

Weitere publizierte Werte 31.12.1998 (BTK PM 6/99): Öffentliches Veterinärwesen 2.812 (14 % der Berufstätigen; „47 weniger als 1997“ → 1997 = 2.859 berechnet), Hochschulen 1.178 (5,9 %), Industrie 1.107 (5,5 %), Forschungsanstalten 510 (2,6 %), Praxis = 65 % der Berufstätigen; nicht Tätige: Ruhestand 4.398, ohne Berufsausübung 1.854, Doktoranden 1.233, arbeitslos gemeldet 905, berufsfremd tätig 819; Staatsexamen 1998: 840, Studienanfänger 1998: 1.074, Berufsaustritte 1998: 274; Zuwachs Praxis 1998: +264. – 31.12.2000 (PM 5/01): „mehr als 4.700 (14 %) im arbeitsfähigen Alter nicht oder berufsfremd tätig“, „mehr als 6.500 Studierende“, Frauenanteil in der Praxis „weniger als 41 %“.

### Methodische Anmerkungen

- **Abgrenzung „tierärztlich Tätige“:** 1998 = 19.879 ergibt sich exakt als 29.088 − (4.398 + 1.854 + 1.233 + 905 + 819); der ds1-Wert 2002 (21.931) ist analog 26.564 (ohne Ruhestand) − 4.633 nicht Tätige (statistik_02.pdf, Abschnitt 1.7). Beide Werte enthalten damit die im Ausland Tätigen (2002: 370) – d. h. 1998 und 2002 sind vergleichbar; der 1991-Wert 17.149 (Schöne & Ulrich) ist als „Inland“ ausgewiesen (Ausland 1991: 139 separat).
- **Praxisassistent:innen** bei Friedrich (2007) ohne Praxisvertreter:innen (1991: 1.880 – dazu 170 Vertreter = 2.050 bei Maure/ds1b „inkl. Vertreter“). Anschluss geprüft: 2002 = 3.784 und 2003 = 4.035 stimmen mit ds1 überein.
- **Berechnete Werte:** Bereich Praxis 31.12.1998 = 13.088 (30.07.1999) − 181 (Zuwachs Jan.–Jul. 1999) = 12.907; 31.12.1997 = 12.907 − 264 = 12.643 (Plausibilität: 9.538 Inhaber + 3.040 Assistent:innen = 12.578; Differenz 65 = Vertreter/Rundung). Praxisinhaber 1998 = 12.907 − 3.101 = 9.806 (zwei Rechenschritte, entsprechend unsicher).
- **Osburg Tab. 6** liefert die BTK-Reihe „ohne Ruhestand“ auch für 1990 (15.619, alte BL) und 1991/1992 (20.610/21.072) mit DTBl-Seitenzitaten (Schöne u. Ulrich 1991, S. 577–578; 1992, S. 987–991; 1993, S. 383–387) – lückenloser Anschluss an ds1b (1993 = 21.691).
- BTK Statistik 2002 (statistik_02.pdf, Tab. 5) bestätigt Tierärztinnen 1992–2002 inkl. „davon nicht/nicht mehr im Beruf“ (1992: 7.438/2.569 … 2001: 13.070/3.979) – Frauen-Teilreihe zu den nicht Tätigen, in ds1b noch nicht enthalten (nicht übernommen, da nur Frauen).

### Weiterhin nicht gefunden (Gap 1)

- Tierärztlich Tätige 31.12.1992–1997 und 1999–2001 (nur Zwischenstand 30.07.1999 = 20.072).
- Praxisinhaber 1996, 1999–2001; Kammermitglieder gesamt 1996, 1999 (nur 30.07.1999 = 29.354).
- Vergeblich geprüft (≥ 10 Suchen/Abrufe): Wayback bundestieraerztekammer.de 2002–2009 (Statistik-PDFs erst ab 2002; PM-Archiv 1998–2002 nur teilweise gespiegelt: 20 PMs vorhanden, 22 weitere 404 – darunter vermutlich die Statistik-PM zu 1999), btk-berlin.de (gehört einer Berliner Ticketagentur, nicht der BTK), tieraerzteblatt.de und vetline.de (1998–2003 nicht archiviert), GBE-Bund (keine Tierärzte-Zeitreihe), Statistisches Jahrbuch 1997–2004 (PDFs auf statistischebibliothek.de vorhanden: `…/DEHeft_derivate_00055639…46/1997kpl.pdf…2004kpl.pdf`; 1999 und 2001 heruntergeladen – reine Bild-Scans ohne Textebene, kein OCR-Werkzeug installiert → nicht ausgewertet), Bundestagsdrucksachen (keine Treffer zu Tierärztezahlen 1998–2000), Dissertationen Osburg 2010 (nur Fachtierärzte), Hübner, Kersebohm, Hassenbürger (bereits in research-1990.md), Kostelnik 2010 (nicht online), DTBl 11/2007 Tab. 11 (nur gesamt/weiblich 1997, 2001, 2005, 2006).

---

## Gap 2 – Hunde und Katzen 1993–2003

### Neue Werte

| Jahr | Hunde (Mio.) | Katzen (Mio.) | weitere Arten | Haushalte | Quelle |
|---|---|---|---|---|---|
| 1992 (ds2b) | (4,1) | (6,0) | Kleintiere ca. 3, Aquarien 0,9 | | IVH zit. Wikipedia |
| **1999** | **5,1** (15 % HH) | **6,2** (16 % HH) | Kleintiere 4,0 (7 %), Ziervögel 5,1 (8 %), Aquarien 3,2 (6 %) | 12,3 Mio. HH mit Heimtieren | IVH-Website „Themen-Service“, Snapshots 22.02./08.03.2001; Marktdaten-Seite: „Stand 1999“ – https://web.archive.org/web/20010222051736/http://ivh-online.de:80/htm/presse/themen/hunde/hunde.htm, …/20010222052004/…/katzen/katzen.htm, …/20010222051209/…/kleintiere/kleintiere1.htm, …/20010222080425/…/voegel/voegel.htm, …/20010309123945/…/fische/fische.htm, …/20010308231739/…/heimtiere/allgemein.htm, …/20010308235022/http://ivh-online.de:80/htm/presse/wir/markt.htm |
| **2000** (sekundär) | 5,0 | 6,8 | | | t-online 24.08.2025 („Im Jahr 2000 lebten 6,8 Millionen Katzen und 5 Millionen Hunde in Deutschland“, Berufung auf Statista/ZZF-IVH) – https://www.t-online.de/leben/aktuelles/id_100871762/haustiere-so-viel-geben-deutsche-fuer-ihre-tiere-aus.html – **Primärquelle nicht eingesehen, in JSON als SEKUNDÄR markiert** |
| **2001** | **4,7** (13 % HH) | **6,9** (14 % HH) | Klein-/andere Heimtiere 5,7 (8 %); Heimtiere gesamt ohne Zierfische 22,2 | „mehr als 12 Mio.“ HH, „jedes dritte“ | IVH „Struktur des deutschen Heimtiermarktes in 2001“ zit. n. Pharmazeutische Zeitung 50/2002 – https://www.pharmazeutische-zeitung.de/titel-50-2002 |
| 2003 (ds2b) | – | (7,5 widersprüchlich) | Gesamt 22,8 | | IVH-PM 2005 |
| 2004 (ds2b) | (5,3) | (7,5) | | | IVH |

Konsistenz: Summe 1999 (5,1 + 6,2 + 4,0 + 5,1 = 20,4 Mio.) passt zur ZZF-Angabe „20 Millionen im Jahr 2000“ (https://www.zzf.de/marktdaten/entwicklung-des-heimtiermarktes); 2001: 22,2 → 2003: 22,8 → 2004: 23,1 ist eine stetige IVH-Reihe. **Warnung:** Die Hundezahl schwankt (5,1 → 5,0 → 4,7 → 5,3) – IVH-Populationszahlen vor 2004 waren Schätzungen aus „gesonderten Untersuchungen“ und wurden offenbar mehrfach neu basiert; die Reihe eignet sich nur mit Vorbehalt als Achse.

Vergleichsachse Hunde + Katzen (berechnet): 1999 = 11,3; 2000 = 11,8 (sekundär); 2001 = 11,6 (ds2b: 1992 = 10,1; 2004 = 12,8).

### Nicht gefunden (Gap 2)

- 1993–1998 (alle Arten), 2002, 2003 (Einzelarten).
- Vergeblich geprüft (≥ 12 Suchen/Abrufe): Wayback ivh-online.de 2002–2004 (nur Startseiten archiviert, 243 Captures, keine Inhaltsseiten), zzf.de 2000–2006 (nicht archiviert), IVH-Website 1999/2001 „Struktur“-Grafikseiten (struktur.htm und GIFs nicht archiviert), FEDIAF-Website 2003 (nur Europa-Summen: 47 Mio. Katzen, 41 Mio. Hunde), FEDIAF Facts & Figures 2010/2012/2014 (Wayback; Deutschland nur 2010er-Werte 5,3/8,2 – keine Historie), presseportal (IVH/ZZF erst ab ca. 2012 aktiv), Wikipedia „Hauskatze“/„Haushund“/„Heimtierbedarf“ (nur 1992, 2004, 2019/2023), Statista (Reihen ab 2008 bzw. 2015, kostenpflichtig; 553999/553984 sind Prognosen 2015–2025), Ohr & Zeddies 2006 („ca. 5 Mio. Hunde; 4,8 Mio. [VDH] bis 5,3 Mio. [IVH]“, ohne Jahr), Heimtierstudie 2014/2019, Tierschutzbund-Katzenschutzreport (ab 2008), animal-health-online 2005, wirtschaftswetter.de (ab 2007), fellakte.de, welt-der-katzen.de, hundund.de (ab 2008), Bundestagsdrucksachen zur Hundeverordnung 2000 (keine Hundezahl gefunden), Dissertationen (keine IVH-Jahresreihe der 1990er gefunden).

---

## Warum springen die IVH/ZZF-Zahlen 2011 → 2012 von 22 auf 31 Mio.?

**Es ist ein Methodenbruch, keine reale Bestandsveränderung – drei Erhebungsregime:**

1. **Bis 2011 – IVH-Schätzung:** Die Datenblätter „Der Deutsche Heimtiermarkt“ vermerken: „Die Marktdaten wurden von den IVH-Mitgliedsunternehmen zur Verfügung gestellt. Die Populationszahlen und das soziodemografische Profil der Haushalte mit Heimtieren wurden in einer gesonderten Untersuchung erhoben“ (IVH Archiv 2004, https://web.archive.org/web/20071025114328/http://www.ivh-online.de/de/home/der-verband/daten-fakten/archiv.html; gleichlautend Datenblatt 2011: „…wurden im Auftrag des IVH in einer gesonderten Untersuchung erhoben“, http://www.ivh-online.de/fileadmin/ivh/user_upload/Daten_und_Fakten/Der_Deutsche_Heimtiermarkt_2011_01.pdf; Basis 2007: 37,5 Mio. Haushalte). Ergebnis 2011: 22 Mio. (Katzen 8,2, Hunde 5,4). Das Datenblatt 2011 weist zudem darauf hin, dass die Marktdaten „auf Grundlage einer erweiterten Datenbasis erhoben“ wurden und „ein direkter Vergleich mit den entsprechenden IVH-Daten für das Jahr 2010 … daher nur bedingt möglich“ sei.
2. **2012 – ZZF/IMR:** „In über einem Drittel der deutschsprachigen Haushalte der Bundesrepublik leben 31 Millionen Katzen, Hunde, Kleinsäuger und Ziervögel. Das ergab eine haushaltsrepräsentative Erhebung zur Heimtierhaltung in Deutschland, die der Zentralverband Zoologischer Fachbetriebe Deutschlands e.V. (ZZF) bei dem Marktforschungsinstitut IMR – Institute for Marketing Research im April diesen Jahres in Auftrag gegeben hat.“ (ZZF-PM 20.06.2012, wiedergegeben in zza-online: https://www.zza-online.de/industrie/die-deutschen-begeistern-sich-fuer-heimtiere/ und petcom.at: https://petcom.at/deutschland/marktdaten/Heimtier-Populationen-Deutschland/Heimtierhaltung-in-Deutschland-2012.html; ZZF-Original: https://www.zzf.de/presse/meldungen/meldungen/article/die-deutschen-begeistern-sich-fuer-heimtiere.html, zit. in Wikipedia „Heimtier“). Werte: Katzen 12,3 (16,5 % HH), Hunde 7,4 (13,4 %), Kleinsäuger 7,6 (6,2 %), Ziervögel 3,7. Erstmals also eine eigenständige, haushaltsrepräsentative Bevölkerungsbefragung des ZZF (nicht des IVH) – die Haushaltsanteile (16,5 % Katzen, 13,4 % Hunde) entsprechen fast genau den IVH-Anteilen 2008–2011 (16,5 %/13,3–13,8 %), die Tierzahlen liegen aber um ca. 40–50 % höher: Der Sprung entsteht überwiegend durch eine andere Hochrechnung der **Tiere pro tierhaltendem Haushalt** (Mehrfachhaltung) und der Haushaltsbasis, nicht durch mehr Halterhaushalte.
3. **Ab Ende 2013 – IVH + ZZF gemeinsam bei Skopos:** „In über einem Drittel der Haushalte in Deutschland leben 28 Millionen Katzen, Hunde, Kleinsäuger und Ziervögel. Das ergibt eine neue repräsentative Erhebung …, die der ZZF und der IVH bei dem Marktforschungsinstitut Skopos in Auftrag gegeben haben … die Ende 2013 durchgeführte Erhebung“ (PM 03.06.2014, https://petcom.at/deutschland/marktdaten/Heimtier-Populationen-Deutschland/Heimtiere-Deutschland-2014.html; vet-magazin.de). Seitdem jährlich „repräsentative Befragung bei 5.000 Haushalten“ (ZZF Marktdaten, https://www.zzf.de/marktdaten/heimtiere-in-deutschland). 2013: 28 Mio. (Katzen 11,5, Hunde 6,9), ab 2014 konsistente Reihe (ds2).

Folgerung für Zeitreihen: Drei nicht direkt vergleichbare Segmente (IVH-Schätzung ≤ 2011 | IMR 2012 | Skopos ≥ 2013). Keine der Quellen enthält eine Rückrechnung der alten Reihe; ZZF selbst stellt „20 Millionen im Jahr 2000“ und „34 Millionen heute“ ohne Bruchhinweis nebeneinander.

## Gibt es ein amtliches Heimtierregister in Deutschland?

**Nein, kein bundesweites.** „Deutschland … hat aktuell keine bundesweite einheitliche Kennzeichnungs- und Registrierungspflicht“ (Netzwerk Kennzeichnung & Registrierung/heimtierverantwortung.net, https://www.heimtierverantwortung.net/k-r/situation-in-deutschland/). Die Broschüre „Bundesweit einheitliche Kennzeichnung und Registrierung von Hund und Katze“ (Netzwerk K&R, Stand Nov. 2017, veröffentlicht vom Niedersächsischen Landwirtschaftsministerium, https://www.ml.niedersachsen.de/download/128376/Broschuere_K_R.pdf) formuliert als Ziel „eine bundesweite Pflicht der Halter zur Kennzeichnung und Registrierung ihrer Hunde und Katzen“ und nennt als Nebeneffekt die „verlässliche Gewinnung von Tierzahlen“ – d. h. verlässliche Bestandszahlen existieren gerade nicht. Was es gibt: (a) **kommunale Hundesteuer-Anmeldung** (Ordnungs-/Steueramt der Gemeinde, ohne bundesweite Zusammenführung; Destatis weist nur das Steueraufkommen aus); (b) **Landes-Hunderegister** nach Landeshundegesetzen, z. B. Niedersachsen (seit 2013), Berlin (seit 2022; FAQ: „Eine bereits erfolgte Meldung in anderen Registern, wie zum Beispiel TASSO, gilt nicht als Registrierung im Zentralregister“, https://www.hunderegister.berlin.de/faq/), Hamburg, Thüringen u. a. – nur Hunde, nur einzelne Länder; (c) **freiwillige private Register** TASSO e.V. und FINDEFIX (Deutscher Tierschutzbund) – Wikipedia „Tasso (Tierregister)“: „Auch wenn das Tierregister vereinsseitig als Haustierzentralregister bezeichnet wird, erfüllt es nicht die Funktion des zentralen Registers“ (https://de.wikipedia.org/wiki/Tasso_(Tierregister)). Ein Gesetzgebungsvorhaben zu einer bundesweiten K&R-Pflicht ist im Lobbyregister des Bundestages dokumentiert (https://www.lobbyregister.bundestag.de/inhalte-der-interessenvertretung/regelungsvorhabensuche/RV0012118/37473); Presseberichte (z. B. honestdog.de, Aug. 2026) melden BMEL-Pläne für ein staatliches Register über eine Verordnungsermächtigung im Tierschutzgesetz – eine amtliche Primärquelle dazu wurde nicht eingesehen. Alle Bestandszahlen (IVH/ZZF, FEDIAF, Statista) sind daher Umfrage-Hochrechnungen.

---

## Quellen-Kurzliste (neu in dieser Runde)

- BTK PM 2/98, 6/99, 5/01 (Wayback, s. o.); weitere 17 archivierte BTK-PMs 1998–2002 in `gaps/btkpm/` (ohne Statistikbezug).
- Friedrich 2007 (TiHo), Osburg 2010 (TiHo) – s. o.
- IVH-Website 2001 (Wayback, 22 Seiten in `gaps/ivh2001/`).
- Pharmazeutische Zeitung 50/2002 „Tierarzneimittel in der Apotheke“.
- ZZF-PM 20.06.2012 (zza-online, petcom), IVH/ZZF-PM 03.06.2014 (petcom), IVH-Datenblätter 2004/2011, ZZF Marktdaten.
- heimtierverantwortung.net; Netzwerk-K&R-Broschüre (ML Niedersachsen); Wikipedia „Tasso (Tierregister)“; hunderegister.berlin.de FAQ; Lobbyregister RV0012118.
- FEDIAF Facts & Figures 2010/2012/2014 (Wayback, `gaps/fediaf/`) – Deutschland-Werte nur ab 2010.
- Statistisches Jahrbuch 1997–2004 (statistischebibliothek.de, Scans ohne Text) – nicht auswertbar ohne OCR.
