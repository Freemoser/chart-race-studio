# Verlängerung der Zeitreihen bis 1991 (Stand 14.09.2026)

Ergänzt `datasets-research.md`, `research-1990.md` und `research-gaps.md`.
Alle Werte sind publizierte Originalzahlen mit zitierfähiger Quelle. **Nichts geschätzt, nichts interpoliert.**
Leere Zelle = nicht gefunden bzw. in der Quelle nicht erhoben. Rohdaten unter `r1991/` (`vieh/`, `btk/`, `vdh/`).

Neue Dateien: `ds5-tieraerzte-bundesland-1991-2005.json`, `ds6-welpen-1990-1991.json`, `ds7-viehbestand-1991-2009.json`.


---

## Überblick – was diese Runde geschlossen hat

| Task | vorher | jetzt | Status |
|---|---|---|---|
| **A** Tierärzte je Bundesland | 2006–2025 | **2002**–2025 (alle 17 Kammern, „gesamt“ + „praktizierend“ + m/w) | teilweise: 1991–2001 nur gedruckt vorhanden; Einzelwerte Sachsen 1991/2001 gefunden |
| **A+** nationale Tierärztereihe | Lücken 1996, 1999, „tätige“ 1992–2001 | **1994–2000 vollständig** (Agrarstat. Jahrbuch 2001, Tab. 166) | geschlossen |
| **B** VDH-Welpen 1990/1991 | ab 1992 | **keine VDH-Gesamtzahl gefunden**; 3 vereinseigene Rassereihen bis 1986/89 zurück | nicht geschlossen |
| **C** Viehbestand national | 1990, 1995, 2000–2025 | **1990–2025 lückenlos** (Rinder, Schweine; Schafe außer 1998-Sonderfall; zusätzlich Ziegen und Milchkühe) | geschlossen |
| **C** Viehbestand je Bundesland | 2010–2025 | **1990–2025** (Rinder, Schweine, Milchkühe); Schafe 1990–2002 und 2004–2025 | geschlossen bis auf Schafe 2003 und Sachsen-Anhalt Mai 2002 |

---

## Task A – Tierärztinnen und Tierärzte je Bundesland/Kammerbereich 1991–2005

**Ergebnis: teilweise geschlossen.** Die Bundesland-Reihe reicht jetzt **von 2002 statt 2006** zurück (4 zusätzliche Jahre, alle 17 Kammern, beide Kennzahlen, alle Prüfsummen exakt). **1991–2001 ist online nicht vorhanden** – die BTK selbst stellt Kammerdaten erst ab Stand 31.12.2002 bereit. Zusätzlich wurde die *nationale* Reihe 1994–2000 aus dem Agrarstatistischen Jahrbuch geschlossen (schließt mehrere in `research-1990.md` / `research-gaps.md` offene Jahre).

### A.1 Tierärzte gesamt (Kammermitglieder) nach Kammerbereich, 2002–2005

| Kammerbereich | 2002 | 2003 | 2004 | 2005 | (2006, vorhanden) |
|---|---|---|---|---|---|
| Baden-Württemberg | 3.032 | 3.099 | 3.184 | 3.264 | 3.381 |
| Bayern | 6.070 | 6.214 | 6.306 | 6.516 | 6.664 |
| Berlin | 1.815 | 1.844 | 1.826 | 1.835 | 1.846 |
| Brandenburg | 1.337 | 1.369 | 1.379 | 1.430 | 1.483 |
| Bremen | 167 | 173 | 175 | 184 | 183 |
| Hamburg | 398 | 400 | 417 | 413 | 443 |
| Hessen | 2.435 | 2.493 | 2.521 | 2.580 | 2.574 |
| Mecklenburg-Vorpommern | 1.120 | 1.143 | 1.151 | 1.152 | 1.149 |
| Niedersachsen | 4.388 | 4.485 | 4.586 | 4.785 | 4.884 |
| Nordrhein | 2.408 | 2.463 | 2.557 | 2.609 | – |
| Westfalen-Lippe | 2.218 | 2.249 | 2.283 | 2.361 | – |
| *NRW (Summe beider Kammern)* | *4.626* | *4.712* | *4.840* | *4.970* | *5.067* |
| Rheinland-Pfalz | 1.099 | 1.112 | 1.129 | 1.191 | 1.258 |
| Saarland | 219 | 231 | 242 | 245 | 256 |
| Sachsen | 1.522 | 1.562 | 1.587 | 1.625 | 1.648 |
| Sachsen-Anhalt | 1.002 | 1.001 | 1.014 | 996 | 1.023 |
| Schleswig-Holstein | 1.375 | 1.415 | 1.453 | 1.483 | 1.538 |
| Thüringen | 856 | 863 | 870 | 853 | 862 |
| **Summe 17 Kammern** | **31.461** | **32.116** | **32.680** | **33.522** | **34.259** |
| publizierte Deutschland-Zahl | 31.461 ✓ | 32.116 ✓ | 32.680 ✓ | 33.522 ✓ | 34.259 |

Die Geschlechteraufteilung (m/w) je Kammer liegt für alle vier Jahre ebenfalls vor und steht in der JSON (Tab. 10 der Statistik 2005). Einzige Einschränkung: Thüringen 2004 – der Männerwert ist in der Textebene des PDF fehlerhaft lesbar (526 statt 626; 626 + 244 = 870), er wurde deshalb weggelassen.

### A.2 Praktizierende Tierärzte (Praxisinhaber:innen) nach Kammerbereich, 2002–2005

| Kammerbereich | 2002 | 2003 | 2004 | 2005 | (2006, vorhanden) |
|---|---|---|---|---|---|
| Baden-Württemberg | 1.042 | 1.054 | 1.085 | 1.151 | 1.141 |
| Bayern | 1.930 | 1.953 | 1.974 | 2.079 | 2.172 |
| Berlin | 333 | 335 | 331 | 333 | 340 |
| Brandenburg | 518 | 519 | 518 | 534 | 539 |
| Bremen | 54 | 52 | 52 | 57 | 60 |
| Hamburg | 126 | 125 | 126 | 128 | 154 |
| Hessen | 781 | 805 | 826 | 848 | 874 |
| Mecklenburg-Vorpommern | 354 | 343 | 337 | 317 | 314 |
| Niedersachsen | 1.374 | 1.391 | 1.427 | 1.474 | 1.525 |
| Nordrhein | 883 | 899 | 924 | 952 | – |
| Westfalen-Lippe | 803 | 812 | 826 | 855 | – |
| *NRW (Summe)* | *1.686* | *1.711* | *1.750* | *1.807* | *1.854* |
| Rheinland-Pfalz | 402 | 409 | 416 | 446 | 474 |
| Saarland | 100 | 107 | 107 | 108 | 114 |
| Sachsen | 538 | 545 | 543 | 575 | 575 |
| Sachsen-Anhalt | 388 | 377 | 372 | 367 | 366 |
| Schleswig-Holstein | 506 | 510 | 525 | 528 | 548 |
| Thüringen | 343 | 332 | 324 | 320 | 308 |
| **Summe 17 Kammern** | **10.475** | **10.568** | **10.713** | **11.072** | **11.358** |
| publizierte Deutschland-Zahl | 10.475 ✓ | 10.568 ✓ | 10.713 ✓ | 11.072 ✓ | 11.358 |

**Quellen A.1/A.2** (jeweils Tab. 1, Zeile „Summe A und B (Nr. 1 bis 13)“ bzw. ab 2005 „C. Tierärzte/Tierärztinnen insgesamt“, und Zeile A.1 „Praktizierende Tierärzte“):
- 2002: https://www.bundestieraerztekammer.de/btk/statistik/downloads/statistik_02.pdf (DTBl 6/2003)
- 2003: https://www.bundestieraerztekammer.de/btk/statistik/downloads/statistik03.pdf (DTBl 7/2004)
- 2004: https://www.bundestieraerztekammer.de/btk/statistik/downloads/statistik2004.pdf (DTBl 6/2005)
- 2005: https://www.bundestieraerztekammer.de/btk/statistik/downloads/statistik_final.pdf (DTBl 11/2006, S. 1344–1345)
- **Unabhängige Gegenprobe für alle vier Jahre:** Tab. 10 „Entwicklung ab 2002“ in derselben Veröffentlichung von 2005 – wiederholt alle 17 Kammern × 2002–2005 mit m/w/ges., **keine einzige Abweichung**.

**Definition:** Die BTK zählt Personen, nicht Praxen. „Praktizierende Tierärzte“ (bis 2011) = selbstständige Praxisinhaber:innen; ab 2012 heißt dieselbe Kategorie „Niedergelassene“. Datenbasis bis 2011: Zentrale Tierärztedatei (ZTD) des PIZ der TiHo Hannover. Stichtag durchgängig 31.12.

### A.3 Einziger gefundener Kammerwert vor 2002: Sachsen

| Stichtag | Kammermitglieder gesamt | dar. Tierärztinnen | Niedergelassene (SLTK-Definition) | Praxisangestellte | Öffentlicher Dienst | Ruheständler |
|---|---|---|---|---|---|---|
| 31.12.1991 | 1.035 | 251 | 463 | 9 | 344 | 105 |
| 31.12.2001 | 1.508 | 495 | 548 | 91 | 327 | 264 |
| 31.12.2002 (BTK) | 1.522 | 517 | 538 („praktizierend“) | | | |

Quelle: Sächsische Landestierärztekammer, Meldung „Mitgliederstatistik“ vom 10.05.2022, **Abb. 1 und Abb. 2 – die Werte stehen als Datenbeschriftung an den Säulen**, sie wurden nicht aus der Achse abgelesen: https://www.tieraerztekammer-sachsen.de/news/1/731711/nachrichten/mitgliederstatistik.html (Grafiken: `…/abb._1_mitgliederentwicklung.jpg`, `…/abb._2_mitgliederentwicklung_berufsgruppen.jpg`). Der Wert 1.035 ist zusätzlich im Text bestätigt: „25 Jahre Sächsische Heilberufekammern“, S. 71 („Im Vergleich zum Gründungsjahr mit 1.035 Tierärzten…“), https://web.archive.org/web/20160329065205/http://www.tieraerztekammer-sachsen.de/dokumente/25_jahre_heilberufekammer.pdf
**Achtung:** „Niedergelassene“ (SLTK) ist **nicht** deckungsgleich mit „Praktizierende Tierärzte“ (BTK) – die beiden Reihen dürfen nicht ungeprüft verkettet werden. Die SLTK datiert 1.035 auf den 31.12.1991, die Festschrift spricht vom „Gründungsjahr“ (Kammer gegründet 30.11.1990) – gleiche Zahl, zwei Jahresetiketten.

### A.4 Bonus: nationale Reihe 1994–2000 geschlossen

Quelle: **BMEL/BML, Statistisches Jahrbuch über Ernährung, Landwirtschaft und Forsten 2001, Tab. 166 „Zahl der Tierärztinnen und Tierärzte“ (Tab.-Nr. 3103100), S. 147** – Quelle dort: Planungs- und Informationszentrum der TiHo Hannover. https://www.bmel-statistik.de/fileadmin/SITE_MASTER/content/Jahrbuch/Agrarstatistisches-Jahrbuch-2001.pdf

| Stand 31.12. | 1994 | 1995 | **1996** | 1997 | 1998 | **1999** | 2000 |
|---|---|---|---|---|---|---|---|
| Tierärzte insgesamt | 26.118 | 26.932 | **27.786** | 28.463 | 29.088 | **29.673** | 30.282 |
| Tierärztlich Tätige | 18.176 | 18.683 | 19.056 | 19.521 | 19.879 | 20.384 | 20.943 |
| Praktizierende Tierärzte | 8.834 | 9.046 | **9.779** | 9.600 | 9.806 | **10.022** | 10.247 |
| Praxisassistent:innen/-vertreter:innen u. lw. Genossenschaften | 2.715 | 2.927 | 3.191 | 3.040 | 3.382 | 3.599 | 3.854 |
| Veterinärverwaltung | 1.859 | 1.887 | 1.852 | 1.819 | 1.790 | 1.803 | 1.782 |
| Institute | 1.232 | 1.222 | 1.193 | 1.191 | 1.205 | 1.232 | 1.228 |
| Hochschulen/Universitäten | 1.205 | 1.220 | 1.216 | 1.140 | 1.178 | 1.197 | 1.250 |
| Fleischuntersuchung | 617 | 594 | 571 | 525 | 563 | 554 | 543 |
| Industrie | 1.027 | 1.045 | 1.058 | 1.069 | 1.107 | 1.147 | 1.178 |
| Bundeswehr | 71 | 72 | 72 | 70 | 73 | 75 | 71 |
| Tierärzte im Ausland | 208 | 238 | 245 | 247 | 302 | 316 | 335 |
| Nicht bzw. nicht mehr tätig | 7.942 | 8.249 | 8.730 | 8.942 | 9.209 | 9.289 | 9.339 |
| dar. im Ruhestand | 3.839 | 3.947 | 4.110 | 4.277 | 4.398 | 4.519 | 4.611 |
| dar. arbeitslos | 457 | 593 | 798 | 873 | 905 | 884 | 882 |
| dar. Doktoranden | 1.159 | 1.145 | 1.249 | 1.217 | 1.233 | 1.169 | 1.090 |
| dar. berufsfremd tätig | 698 | 738 | 749 | 775 | 819 | 835 | 864 |
| dar. ohne Berufsausübung | 1.789 | 1.826 | 1.824 | 1.800 | 1.854 | 1.882 | 1.892 |

Damit sind die in `research-1990.md` und `research-gaps.md` offenen Punkte erledigt: **Kammermitglieder gesamt 1996 (27.786) und 1999 (29.673)**, **tierärztlich Tätige 1994–2000** (dort fehlten 1992–1997 und 1999–2001) und **praktizierende Tierärzt:innen 1996, 1999, 2000**.
**Konsistenzprüfungen:** „tierärztlich Tätige 1998 = 19.879“ ist identisch mit der BTK-Pressemitteilung 6/99; „praktizierende 1998 = 9.806“ bestätigt publiziert den Wert, der in `research-gaps.md` nur *berechnet* war. **Praktizierende 2001 = 10.387** doppelt belegt (Jahrbuch 2004 Tab. 157 **und** Spalte „Summe 2001“ in BTK `statistik_02.pdf`).
**Abweichungshinweis:** Das Jahrbuch 2004 druckt für 2003 „insgesamt 32.118“, die BTK 32.116 – Differenz 2, wird hier nur vermerkt, nicht aufgelöst. Ebenso: Praktizierende 1997 = 9.600 (Jahrbuch) vs. „9.538 Stand 1.1.1998“ in BTK-PM 2/98.

### A.5 „Nicht gefunden“ – wo überall gesucht wurde (1991–2001 je Kammer)

**Kernbefund: Die BTK selbst besitzt online keine Kammerdaten vor 2002** – dreifach belegt: (a) die Downloadliste unter `/btk/statistik/` beginnt mit Stand 31.12.2002; (b) die Vergleichstabelle heißt „Entwicklung **ab 2002**“; (c) DTBl 8/2024 („20 Jahre Tierärztestatistik“, https://www.bundestieraerztekammer.de/btk/dtbl/archiv/2024/artikel/DTBl_08-2024_Statistik-Entwicklung.pdf) schreibt: „Zum Vergleich der Daten stehen die Veröffentlichungen **seit 2002** … zur Verfügung“.

- **BTK-Dateinamen abgetastet:** rund 55 Varianten unter `/btk/statistik/downloads/` (statistik_00/01, statistik99, statistik2002–2006, dtb_stat_04/05/07_bericht, stat2005 …) – alle leer. Das DTBl-Archiv `/btk/dtbl/archiv/` beginnt **2005**.
- **Wayback-Machine CDX:** 14.306 URLs für `bundestieraerztekammer.de`; die **früheste Erfassung überhaupt stammt von Juni 2002**, im gesamten Capture-Set existiert kein Statistik-PDF vor 2002. `tieraerzteblatt.de` ist erst ab 2013 archiviert. Die in der Aufgabe genannte Domain `btk-berlin.de` gehört (wie schon in `research-gaps.md` festgestellt) einer Berliner Ticketagentur.
- **Agrarstatistisches Jahrbuch:** Ausgaben 2001, 2002, 2003, 2004, 2010, 2015, 2020, 2022 heruntergeladen und volltextdurchsucht – Tab. 3103100 ist **in jeder Ausgabe rein national**; die Kammertabelle 0106490 gibt es nur als Web-Datei mit aktuellem plus Vorjahr. Ausgaben 1990–2000 sind nicht online (das BMEL-Archiv springt von der Erstausgabe 1956 auf 2001).
- **Destatis Statistisches Jahrbuch:** SJ 1997 (45 MB, 775 S.) heruntergeladen – **reiner Bildscan ohne Textebene**. Vorabprüfung am volltextfähigen SJ 2006: „Tierärzte“ erscheint dort nur im Umsatzsteuer-/Freie-Berufe-Kontext, **eine Tierärzte-nach-Ländern-Tabelle existiert in dieser Reihe nicht**. Route deshalb bewusst abgebrochen (OCR hätte nichts gebracht).
- **Statistische Landesämter:** getestet am *Statistischen Jahrbuch für Bayern* (Kapitel Gesundheitswesen, Ausgaben 2021 und 2024): **null Treffer für „Tierärzt“**. Tierärzte sind nicht Teil der Gesundheitspersonalstatistik der Länder. GBE-Bund, Destatis-Genesis 23621 „Gesundheitspersonal“ und regionalstatistik.de liefern ebenfalls keine Tierärzte-nach-Bundesland-Tabelle.
- **Alle 17 Landestierärztekammern:** vollständige Wayback-CDX-Inventare gezogen (u. a. 2.478 URLs Berlin, 4.516 bltk.de, 8.254 ltk-hessen.de, 4.389 tknds.de, 2.982 tieraerztekammer-wl.de, 4.673 Nordrhein); rund 350 archivierte Seiten aus der Zeit vor 2006 automatisch abgerufen und nach Mitgliederzahlen durchsucht – **null Treffer außer Sachsen**. (Korrektur zur Aufgabenstellung: mehrere der dort genannten Domains existieren nicht; die realen sind u. a. `tieraerztekammer-wl.de`, `ltk-bw.de`, `ltk-rlp.de`, `landestieraerztekammer-mv.de`, `ltkt.de`, `tierarzt-saar.de`, `ltk-brandenburg.de`.)
- **Knapp verfehlt:** `ltk-hessen.de/.../06-05-06-Ausblick.pdf` enthält ein Diagramm **„Mitgliederentwicklung 1970–2004“ für Hessen** – aber als **unbeschriftetes Liniendiagramm** (anders als bei Sachsen). Werte abzulesen wäre Schätzung, deshalb **nichts übernommen**. Die LTK Hessen besitzt die Zahlen.
- **Repositorien:** elib.tiho-hannover.de und refubium.fu-berlin.de mit Bot-Sperre; edoc.ub.uni-muenchen.de verweigerte die Verbindung; geb.uni-giessen.de/jlupub-API: „Kammerbereich“ 4 irrelevante Treffer, „Tierärztedichte“ 0; qucosa-API HTTP 400. **Maure 1998** („Frauen als Tierärztinnen“, FU Berlin) vollständig gelesen – alle 10 Tabellen rein national. Ebenso leer: archive.org-Volltext, DNB-Katalog, bpt, vetion/vetline/animal-health-online, Google Books, Tierärzte-Atlas 2024 (zitiert selbst nur BTK 2002–2023).

**Wo die Daten 1991–2001 tatsächlich liegen:** ausschließlich gedruckt, in der jährlichen PIZ/ZTD-Reihe *„Statistische Untersuchungen über die Tierärzteschaft in der Bundesrepublik Deutschland (Stand 31.12.19xx)“* von R. Schöne u. a. im **Deutschen Tierärzteblatt** (jeweils Mai-/Juni-Heft des Folgejahres), deren Tab. 1 genauso nach Kammerbereichen gegliedert ist wie die PDFs ab 2002. Eine Fundstelle ist konkret belegt: **Schöne/Ulrich, Stand 31.12.1996 → DTBl 1997, S. 539.** Realistische Wege: Bibliotheksscan der DTBl-Jahrgänge 1992–2002 (je eine Seite pro Jahr; TiHo-Bibliothek Hannover oder Veterinärbibliothek FU Berlin), BTK-Geschäftsstelle Berlin (hat die ZTD-Altbestände ca. 2005 übernommen), LTK Hessen für die Hessen-Reihe 1970–2004.

---

## Task B – VDH-Welpenstatistik 1990 und 1991

**Ergebnis: nicht geschlossen.** Eine VDH-Gesamtzahl für 1990 oder 1991 existiert im offenen Netz nicht. Gefunden wurden drei vereinseigene Zuchtbuchreihen, die bis 1990/91 zurückreichen – sie sind **kein Ersatz** für die VDH-Zahl.

### B.1 Was gefunden wurde (→ `ds6-welpen-1990-1991.json`, 31 Zeilen)

**(1) English Cocker Spaniel – Jagdspaniel-Klub e.V. (VDH-Mitgliedsverein), nach Geburtsjahr – belastbar**

| Geburtsjahr | 1987 | 1988 | 1989 | **1990** | **1991** | 1992 | 1993 | 1994 | 1995 |
|---|---|---|---|---|---|---|---|---|---|
| registrierte Welpen | 1.970 | 2.190 | 1.920 | **1.975** | **2.077** | 2.114 | 2.284 | 2.172 | 2.223 |

Quelle: Zadil, Sinet-Jasmin (2004), „Vererbung von Augenkrankheiten beim Englischen Cocker Spaniel“, Diss. Tierärztliche Hochschule Hannover, **Tab. 2, S. 25** – https://d-nb.info/974132802/34 (der TiHo-Server elib.tiho-hannover.de blockt Bots; die DNB-Kopie ist frei abrufbar).
**Abgleich:** JSpK 1992 = 2.114 gegenüber VDH „Cocker Spaniel“ 1992 = 2.347 → der Klub deckt rund 90 % der VDH-Eintragungen dieser Rasse ab, der Rest entfällt auf weitere VDH-Vereine. Die Reihe ist also eine **Untergrenze**, kein VDH-Wert.

**(2) Deutscher Schäferhund – SV-Zuchtbuch, nach Geburtsjahr – nur sekundär, mit Warnung**

| Geburtsjahr | 1986 | 1987 | 1988 | 1989 | **1990** | **1991** | 1992 | 1993 | 1994 | 1995 | 1996 | 1997 | 1998 | 1999 | 2000 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SV-Zuchtbuch | 24.546 | 25.754 | 25.503 | 25.189 | **29.605** | **29.756** | 32.131 | 34.681 | 33.340 | 34.278 | 32.808 | 29.563 | 28.147 | 24.445 | 22.228 |
| VDH-Welpenstatistik (ds3b) | – | – | – | – | – | – | 28.000 | 27.648 | 28.730 | 29.805 | 30.802 | 29.824 | 27.834 | 23.839 | 20.872 |

Quelle: Jan Demeyere (2009), „Der Deutsche Schäferhund – The German Shepherd Dog / Hüftgelenksdysplasie“, Tabelle „wie viele Hunde im Zuchtbuch des SV über die Jahre hinweg eingetragen wurden“ (Datenbasis: **SV-Genetics-Datenbank**, Stand 1. Quartal 2006) – https://blogimages.bloggen.be/hd/attach/244501.pdf (PDF-Metadaten: Autor „Jan Demeyere, B-8570 Vichte“, erstellt 12.09.2009).
**Warnung:** privat publizierte Auswertung, kein Verbandsdokument. In den Überlappungsjahren 1992–1996 liegt die SV-Reihe **10–25 % über** der VDH-Welpenstatistik, ab 1997 dagegen sehr nahe daran. Die 1990/91-Werte sind daher **nicht** auf die VDH-Skala übertragbar; sie eignen sich nur als eigenständige SV-Reihe mit Quellenhinweis.

**(3) Großspitz – Verein für Deutsche Spitze – sekundär, sehr kleine Zahlen**

| Jahr | 1989 | **1990** | **1991** | 1992 |
|---|---|---|---|---|
| Großspitz-Welpen | 37 | **47** | **57** | 37 |

Quelle: „Der Deutsche Spitz“ (DDS) Nr. 211 (VDS-Vereinszeitschrift), transkribiert auf https://www.vom-gut-glueck.de/spitz-zucht/der-gro%C3%9Fspitz/welpenstatistik/ – Primärquelle nur gedruckt, nicht eingesehen.

### B.2 Bewusst abgelehnter Treffer (wichtig)

**Michels & Distl (2022), *Animals* 12:929, Tabelle S2** (Deutsch Drahthaar, Pedigree-Analyse des VDD) enthält die Spalte „Number of animals“ ab Geburtsjahr **1991 = 1.726**. Diese Zahl wurde **nicht** übernommen: ab 1995 deckt sie sich fast exakt mit der VDH-Welpenstatistik (1995: 3.839 vs. VDH 3.791; 1996: 3.554 vs. 3.512; 2000: 3.097 vs. 3.061), für 1991–1994 liegt sie aber nur bei rund der Hälfte (1992: 1.817 vs. VDH 3.349; 1993: 1.853 vs. 3.404). Die ausgewertete Pedigree-Datei ist für die frühen Jahre also unvollständig – die 1.726 sind **keine** Welpenzahl. Bezugsweg (MDPI ist Cloudflare-gesperrt, PMC liefert HTML): `https://www.ebi.ac.uk/europepmc/webservices/rest/PMC8996862/supplementaryFiles`.

### B.3 „Nicht gefunden“ – wo überall gesucht wurde

- **VDH selbst:** Wayback-CDX `vdh.de*` 1996–2004 (3.901 URLs, `r1991/vdh/cdx_vdh_1996_2004.txt`). Snapshots 1998/1999 enthalten nur Kalender, Welpenvermittlung und Vereinsseiten – **keine Statistikseite**. In den archivierten Skripten `…/cgi-bin/vdh_admin/welpenzahlen.pl` (03.12.2003) und `…/vdh_gesamt/welpenzahlen.pl` (09.03.2004) **endet die Jahres-Auswahlliste bei 1992** – die Onlinetabelle hat 1990/91 nie enthalten. Ebenfalls geprüft: `vdh.de/presse/welpenstatistik.php` (nur Navigationsframe), `vdh.de/presse/daten-zur-hundehaltung/`, `vdh.de/fileadmin/media/news/2022/Rassehundezucht_im_VDH.pdf` (kein Jahr vor 2000), `vdh.de/zeitschrift-unser-rassehund/archiv/` (**digitalisiert erst ab 2009**), `kleinhunde-bremen.de/vdh_welpen_statistik.html` (nur iframe auf die VDH-Tabelle).
- **FCI:** Wayback-CDX `fci.be*` 1997–2006 (6.000 URLs) – keine archivierten Statistikdokumente.
- **Zuchtvereine (Wayback-CDX, jeweils kein Treffer auf statist/zuchtbuch/welpenzahl):** schaeferhunde.de, adrk.de, drahthaar.de, boxer-klub.de, pudelklub.de, kft-online.de, drc.de, doggen.de. `hovawart.org/Verein/Zuchtbuch99.htm` = nur Bestellformular. `teckelklub.de/welpenstatistiken/` und `dtk1888.de` = Welpenstatistik-PDFs **erst ab 2007**; `dtk-westfalen.de/datenundfakten.html` liefert kein HTML mit Jahreszahlen. `bk-muenchen.de` Chronik (`12.01_Chronik4.pdf`) nennt 1985–1988 und 1992 (≈2.500, passt zu VDH 2.544), **für 1990/91 keine Zahl**. `doggen.de/…/ZB_113.pdf` ab 2008; `bsd-ev.com/zucht/welpenstatistik.html` = 404; `pon-op.de` nur Aggregat 1983–2005; `leonberger-database.com`, `spitzdatenbank.de`, `ssv-ev.de` ohne Jahresreihen.
- **Dissertationen/Fachliteratur:** Gresky 2004 (Dackel, TiHo) – DTK-Jahreswerte nur als **unbeschriftetes Balkendiagramm**, deshalb nicht verwertet (1987 = 16.794 und 2001 = 8.595 sind im Text genannt); Broschk 2004 (Irischer Wolfshund) – nur **Dreijahresblöcke** (1988–1990 = 1.278; 1991–1993 = 1.583), nicht auf Jahre aufteilbar; Bieliga 2022 (TiHo) zitiert VDH nur 2005–2019; Herzog 2017 (FU Berlin, DRC) ohne Eintragungsreihe.
- **Amtliche Quellen/Presse:** Bundestagsdrucksachen 12/4242 (Tierschutzbericht 1993), 13/350, 13/7016 – VDH nur im Abkürzungs-/Anhörungsverzeichnis, **keine Zahlen**; BTK-Qualzuchtgutachten ohne Eintragungszahlen; WILD UND HUND 14/2015 basiert auf VDH-Zahlen **ab 1998**; vetline.de ab 2007; archive.org-Volltextsuche „Unser Rassehund“ = **0 Treffer** (die Zeitschrift ist nicht digitalisiert); Statista (kostenpflichtig, Reihen ab 2000).
- **Realistisch verbleibende Wege (offline):** VDH-Geschäftsberichte bzw. „Unser Rassehund“ Jahrgänge 1991–1993, die gedruckten Zuchtbücher der Mitgliedsvereine, oder eine direkte Anfrage beim VDH-Zuchtbuchamt in Dortmund.

---

## Task C – Viehbestand nach Bundesland 1990–2010 und nationale Lücken 1991–1999

**Ergebnis: vollständig geschlossen** (bis auf zwei kleine Restlücken, s. u.).

### C.1 Quellen

| Teil | Quelle | URL |
|---|---|---|
| Bundesland 1990–2004 und 2007–2010 (Rinder, Schweine, Schafe, Milchkühe) | Eurostat, Tabelle `apro_mt_ls_r` „Animal populations by NUTS 2 region“ (Datenlieferant: Statistisches Bundesamt), NUTS-1 = Bundesländer, Einheit 1 000 Stück | https://ec.europa.eu/eurostat/databrowser/view/apro_mt_ls_r/default/table |
| Nationale Reihe 1990–2001 (Rinder, Schweine, Schafe, Ziegen) | BMEL/BML, Statistisches Jahrbuch über Ernährung, Landwirtschaft und Forsten **2001**, Tab. 141 „Viehbestand“, S. 130 (Q: Statistisches Bundesamt) | https://www.bmel-statistik.de/fileadmin/SITE_MASTER/content/Jahrbuch/Agrarstatistisches-Jahrbuch-2001.pdf |
| Bundesland 2005 (Rinder, Schweine, Schafe) + Schafe 2004 | Destatis, Fachserie 3 Reihe 4.1 „Viehbestand“, 3. Mai 2005, Tab. 2.1/2.2/2.3 | https://www.statistischebibliothek.de/mir/servlets/MCRFileNodeServlet/DEHeft_derivate_00004804/2030410057004.pdf |
| Bundesland 2006 (Rinder, Schweine, Schafe) + Milchkühe 2005/2006 | Destatis, Fachserie 3 Reihe 4.1 „Viehbestand“, 3. Mai 2006 | https://www.statistischebibliothek.de/mir/servlets/MCRFileNodeServlet/DEHeft_derivate_00004807/2030410067004.pdf |
| Schafe nach Bundesland 2007 | Destatis, Fachserie 3 Reihe 4.1 „Viehbestand“, 3. Mai 2007, Tab. 2.3 | https://www.statistischebibliothek.de/mir/servlets/MCRFileNodeServlet/DEHeft_derivate_00004810/2030410077004.pdf |
| Kontrolle Stichtage / Monatsauflösung national | Eurostat `apro_mt_lscatl`, `apro_mt_lspig`, `apro_mt_lssheep` (Dimension `month`) | https://ec.europa.eu/eurostat/databrowser/view/apro_mt_lscatl/default/table |
| Schafzählung Juni 1998 (Kontrolle) | Destatis, FS 3 R 4.1 „Rinder- und Schafbestand, 3. Juni 1998“ | https://www.statistischebibliothek.de/mir/servlets/MCRFileNodeServlet/DEHeft_derivate_00059863/FS-3-4-1-Rind_Schaf_1998.pdf |
| Sachsen-Anhalt November 2002 (Anker) | Destatis, FS 3 R 4.1 „Rinder- und Schweinebestand, 3. November 2003“ (mit Vorjahr) | https://www.statistischebibliothek.de/mir/servlets/MCRFileNodeServlet/DEHeft_derivate_00059873/2030410037004.pdf |

**Lizenz:** Eurostat-Daten unter der Eurostat-Lizenz (freie Weiterverwendung mit Quellenangabe); Destatis/BMEL-Veröffentlichungen unter dl-de/by-2-0 bzw. mit Quellenangabe.

### C.2 Methoden- und Definitionsnotizen (wichtig!)

1. **Erhebungsstichtag wechselt.** Bis 1997 Zählung zum **3. Dezember**, 1998 zum **3. November**, ab 1999 Haupterhebung zum **3. Mai** (Fußnote 1 zu Tab. 141 des Jahrbuchs 2001). In der Eurostat-Regionaltabelle entsprechen **1990–1998 der Dezember-/November-Zählung**, **1999–2006 und 2008/2009 der Mai-Erhebung**, **2007 und 2010 der November-Erhebung**. Das wurde Jahr für Jahr durch Abgleich der Ländersumme mit den monatsaufgelösten Eurostat-Tabellen (`apro_mt_lscatl` etc.) verifiziert – siehe Feld `note` in der JSON.
2. **Gebietsstand.** Der Wert für **1990 ist bereits gesamtdeutsch** (Dezember-Zählung nach der Vereinigung), ab 1991 durchgängig Deutschland. Der sehr starke Rückgang 1990→1991 in den neuen Ländern (z. B. Sachsen Rinder 1 109 → 719 Tsd., Mecklenburg-Vorpommern Schweine 1 971 → 1 153 Tsd.) ist **real** (Auflösung der LPG-Tierbestände), **kein Gebietsstandsbruch**. Für Zeitreihen ab 1991 ist das unproblematisch; wer 1990 mitzeigt, sollte den Struktureffekt annotieren.
3. **Schafe 1998 – abweichender Stichtag.** Im Dezember 1998 fand **keine Schafzählung** statt (Tab. 141 des Jahrbuchs 2001 weist für 1998 bei Schafen „.“ aus). Die Eurostat-Regionalwerte für 1998 stammen aus der **Juni-Erhebung 1998** (Deutschland 2 870 Tsd.; bestätigt durch die Destatis-Fachserie „Rinder- und Schafbestand, 3. Juni 1998“, dort Deutschland = 2 870). Sie sind mit den Dezemberwerten 1991–1997 **nicht direkt vergleichbar** (Juni/Mai-Zählungen liegen wegen der Frühjahrslämmer systematisch ~25 % höher; Juni 1997 = 2 884 vs. Dezember 1997 = 2 302).
4. **Stadtstaaten.** Berlin, Bremen und Hamburg wurden nicht in jedem Jahr erhoben. In den Fachserien tragen ihre Zeilen dann die Fußnote „Ergebnis: Mai 2003“ bzw. „Mai 2005“ (fortgeschriebener Vorjahreswert) oder „/“ (nicht nachgewiesen). Für **2000** fehlen alle drei Länder auch in der Eurostat-Regionaltabelle – sie wurden in dem Jahr nicht erhoben (Differenz zur Bundessumme: 21,9 Tsd. Rinder, 5,0 Tsd. Schweine, 2,1 Tsd. Schafe).
5. **Erfassungsgrenzen / Methodenbrüche** (wie in `datasets-research.md` dokumentiert): Rinder ab 2008 aus HIT, Schweine 2010 und Schafe 2011 geänderte Erfassungsgrenzen. Über diese Schnitte hinweg sind die Niveaus nur eingeschränkt vergleichbar.
6. **Prüfsummen.** Die Summe der 16 Länder stimmt in **jedem** Jahr auf ±0,3 Tsd. mit dem nationalen Wert der gleichen Quelle überein (Rundungsdifferenz). Ausnahmen sind genau die dokumentierten Erhebungslücken (2000 Stadtstaaten, 2002 Sachsen-Anhalt, 2005/2006 Bremen+Hamburg) – siehe Spalten „Summe“ vs. „Deutschland“ in den Tabellen unten.
7. **Anschluss an ds4.** Die Werte für 2010 sind identisch mit der vorhandenen ds4-Bundesland-Reihe (z. B. Rinder Bayern 2010 = 3 350,3; Milchkühe BW 2010 = 353,1) – die neue Reihe schließt also nahtlos an.

### C.3 Tabellen

#### Rinder nach Bundesland, 1990–2010 (1.000 Tiere)

| Jahr | BW | BY | BE | BB | HB | HH | HE | MV | NI | NW | RP | SL | SN | ST | SH | TH | Summe | Deutschland |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1990 | 1584,0 | 4814,3 | 3,8 | 1071,2 | 15,0 | 11,2 | 713,5 | 1105,5 | 3277,2 | 1990,2 | 542,3 | 67,3 | 1109,2 | 888,5 | 1525,4 | 769,5 | 19488,1 | 19488,0 |
| 1991 | 1497,5 | 4651,1 | 3,8 | 781,0 | 14,3 | 10,9 | 661,7 | 730,9 | 3126,1 | 1848,3 | 520,2 | 65,1 | 718,8 | 498,8 | 1473,0 | 532,2 | 17133,7 | 17133,8 |
| 1992 | 1435,2 | 4420,8 | 1,7 | 684,3 | 14,0 | 9,9 | 633,3 | 592,3 | 3048,9 | 1817,5 | 497,3 | 63,5 | 630,3 | 447,5 | 1435,0 | 475,9 | 16207,4 | 16207,3 |
| 1993 | 1406,8 | 4326,8 | 1,7 | 675,4 | 13,7 | 10,0 | 609,1 | 626,7 | 2975,8 | 1764,3 | 491,0 | 63,4 | 615,3 | 428,2 | 1424,3 | 463,9 | 15896,4 | 15896,6 |
| 1994 | 1410,6 | 4296,5 | 1,2 | 698,3 | 13,4 | 9,1 | 600,0 | 629,5 | 3008,9 | 1779,6 | 488,1 | 62,6 | 652,3 | 444,2 | 1396,2 | 471,7 | 15962,2 | 15962,2 |
| 1995 | 1400,4 | 4228,7 | 1,2 | 711,6 | 13,6 | 9,1 | 601,1 | 641,1 | 3014,7 | 1753,3 | 489,5 | 62,0 | 644,4 | 452,9 | 1398,1 | 468,2 | 15889,9 | 15889,9 |
| 1996 | 1382,0 | 4225,2 | 1,0 | 716,4 | 12,8 | 8,7 | 598,4 | 636,1 | 2992,7 | 1711,2 | 487,4 | 63,3 | 629,5 | 439,0 | 1397,0 | 458,9 | 15759,6 | 15759,6 |
| 1997 | 1327,1 | 4125,9 | 1,0 | 694,2 | 12,8 | 8,7 | 575,2 | 611,5 | 2884,6 | 1634,1 | 470,3 | 62,2 | 617,9 | 420,6 | 1336,0 | 445,1 | 15227,2 | 15227,2 |
| 1998 | 1283,8 | 4031,0 | 1,0 | 680,6 | 12,8 | 8,7 | 567,7 | 595,8 | 2876,7 | 1587,8 | 456,6 | 61,9 | 600,8 | 403,0 | 1342,0 | 431,8 | 14942,0 | 14942,0 |
| 1999 | 1269,3 | 4049,9 | 0,5 | 686,5 | 12,6 | 8,9 | 560,3 | 611,1 | 2861,8 | 1567,4 | 457,2 | 62,5 | 580,6 | 412,9 | 1336,7 | 417,7 | 14895,9 | 14895,8 |
| 2000 | 1234,2 | 3976,5 |  | 664,3 |  |  | 536,6 | 594,4 | 2810,6 | 1529,5 | 451,3 | 60,3 | 561,9 | 399,3 | 1296,9 | 400,2 | 14516,0 | 14537,9 |
| 2001 | 1211,7 | 4084,3 | 0,5 | 649,4 | 11,9 | 8,2 | 542,6 | 591,9 | 2827,0 | 1513,8 | 446,2 | 62,2 | 550,8 | 391,8 | 1320,3 | 390,4 | 14603,0 | 14603,1 |
| 2002 | 1171,3 | 3895,8 | 0,5 | 623,4 | 11,9 | 8,2 | 511,2 | 577,9 | 2719,4 | 1432,2 | 433,7 | 60,9 | 529,4 |  | 1259,8 | 374,5 | 13610,1 | 13988,3 |
| 2003 | 1138,3 | 3763,8 | 0,4 | 614,3 | 11,3 | 7,1 | 504,8 | 565,1 | 2661,1 | 1418,8 | 410,5 | 58,5 | 521,6 | 364,6 | 1236,6 | 366,9 | 13643,7 | 13643,7 |
| 2004 | 1079,6 | 3632,2 | 0,4 | 594,2 | 11,3 | 7,1 | 481,3 | 556,2 | 2586,9 | 1375,1 | 397,4 | 55,9 | 504,8 | 352,1 | 1206,6 | 354,5 | 13195,6 | 13195,8 |
| 2005 | 1070,3 | 3586,9 | 0,4 | 580,9 |  |  | 476,2 | 539,3 | 2561,6 | 1383,7 | 389,7 | 53,9 | 501,1 | 344,4 | 1179,4 | 349,4 | 13017,2 | 13034,5 |
| 2006 | 1047,5 | 3489,8 | 0,4 | 572,3 |  |  | 472,7 | 537,4 | 2520,0 | 1335,3 | 383,7 | 51,7 | 487,4 | 334,3 | 1152,8 | 344,8 | 12730,1 | 12747,9 |
| 2007 | 1019,0 | 3470,7 | 0,5 | 573,1 | 11,0 | 6,4 | 479,9 | 544,3 | 2501,6 | 1346,7 | 384,9 | 52,1 | 485,1 | 336,9 | 1148,2 | 347,2 | 12707,6 | 12707,3 |
| 2008 | 1048,2 | 3428,7 | 0,6 | 589,0 | 10,8 | 6,5 | 492,9 | 565,3 | 2573,4 | 1421,3 | 391,6 | 54,2 | 504,2 | 350,3 | 1181,6 | 351,1 | 12969,7 | 12969,7 |
| 2009 | 1044,6 | 3414,0 | 0,7 | 586,6 | 10,6 | 6,4 | 485,2 | 568,0 | 2574,3 | 1437,8 | 384,1 | 52,8 | 509,1 | 352,5 | 1168,6 | 349,9 | 12944,9 | 12944,9 |
| 2010 | 1027,5 | 3350,3 | 0,7 | 570,3 | 10,3 | 6,1 | 472,1 | 551,6 | 2531,3 | 1431,5 | 374,1 | 49,9 | 503,7 | 342,9 | 1137,4 | 346,6 | 12706,2 | 12706,2 |

#### Schweine nach Bundesland, 1990–2010 (1.000 Tiere)

| Jahr | BW | BY | BE | BB | HB | HH | HE | MV | NI | NW | RP | SL | SN | ST | SH | TH | Summe | Deutschland |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1990 | 2224,1 | 3716,3 | 27,0 | 2049,2 | 3,5 | 5,2 | 1027,6 | 1970,5 | 7127,1 | 5937,5 | 509,6 | 35,7 | 1493,8 | 1955,9 | 1445,0 | 1290,8 | 30818,8 | 30818,8 |
| 1991 | 2166,8 | 3693,2 | 27,0 | 1086,2 | 3,3 | 5,1 | 984,6 | 1152,5 | 6920,2 | 5674,9 | 488,2 | 33,8 | 788,8 | 932,4 | 1387,5 | 718,8 | 26063,3 | 26063,4 |
| 1992 | 2239,7 | 3833,9 | 2,0 | 1038,4 | 3,1 | 4,3 | 999,5 | 969,6 | 7215,7 | 5902,8 | 485,9 | 31,3 | 754,3 | 881,7 | 1396,7 | 755,5 | 26514,4 | 26514,4 |
| 1993 | 2297,5 | 3807,4 | 2,0 | 968,9 | 3,0 | 4,3 | 980,2 | 791,1 | 7214,8 | 5916,1 | 465,7 | 32,2 | 681,9 | 817,0 | 1377,7 | 715,3 | 26075,1 | 26075,1 |
| 1994 | 2250,5 | 3722,3 | 2,0 | 761,6 | 2,6 | 3,2 | 916,8 | 609,1 | 6900,6 | 5762,3 | 435,3 | 26,7 | 613,6 | 711,9 | 1308,6 | 671,1 | 24698,2 | 24698,1 |
| 1995 | 2175,8 | 3437,2 | 2,0 | 702,1 | 2,6 | 3,1 | 876,6 | 527,4 | 6752,2 | 5632,7 | 396,8 | 24,8 | 562,6 | 712,3 | 1268,7 | 659,7 | 23736,6 | 23736,6 |
| 1996 | 2231,3 | 3521,1 | 1,2 | 718,4 | 2,0 | 3,3 | 869,2 | 584,0 | 6946,4 | 5772,5 | 396,5 | 24,2 | 567,3 | 711,2 | 1293,4 | 641,0 | 24283,0 | 24283,0 |
| 1997 | 2275,8 | 3650,5 | 1,2 | 736,2 | 2,0 | 3,3 | 883,5 | 601,1 | 7120,5 | 5800,7 | 399,7 | 24,6 | 581,8 | 745,9 | 1308,3 | 660,1 | 24795,2 | 24795,2 |
| 1998 | 2397,6 | 3817,8 | 1,2 | 811,5 | 2,0 | 3,3 | 942,2 | 614,2 | 7523,9 | 6232,0 | 418,9 | 25,7 | 633,7 | 819,9 | 1348,0 | 702,2 | 26294,1 | 26294,0 |
| 1999 | 2320,0 | 3841,0 | 0,3 | 753,5 | 1,8 | 2,8 | 884,0 | 648,0 | 7540,2 | 6211,6 | 379,3 | 25,8 | 612,6 | 864,2 | 1365,1 | 650,8 | 26101,0 | 26101,0 |
| 2000 | 2244,0 | 3731,3 |  | 740,7 |  |  | 844,1 | 636,0 | 7412,6 | 6152,8 | 374,7 | 23,5 | 604,3 | 829,2 | 1367,4 | 667,8 | 25628,4 | 25633,4 |
| 2001 | 2314,5 | 3766,5 | 0,1 | 732,9 | 0,8 | 2,5 | 827,0 | 632,6 | 7502,0 | 6119,9 | 361,9 | 22,5 | 613,8 | 816,1 | 1383,9 | 686,9 | 25783,9 | 25783,9 |
| 2002 | 2288,6 | 3720,8 | 0,1 | 755,6 | 0,8 | 2,5 | 851,4 | 645,1 | 7774,3 | 6092,9 | 355,4 | 18,6 | 612,8 |  | 1400,3 | 742,2 | 25261,4 | 26103,0 |
| 2003 | 2302,2 | 3731,2 | 0,1 | 769,1 | 0,5 | 1,4 | 819,3 | 688,1 | 7795,3 | 6268,3 | 340,8 | 20,7 | 641,4 | 820,0 | 1425,4 | 710,5 | 26334,3 | 26334,3 |
| 2004 | 2178,9 | 3632,5 | 0,1 | 738,8 | 0,5 | 1,4 | 775,6 | 668,4 | 7601,0 | 6064,7 | 324,0 | 18,1 | 616,3 | 849,2 | 1446,7 | 742,9 | 25659,1 | 25659,3 |
| 2005 | 2256,9 | 3711,6 | 0,1 | 773,6 |  |  | 802,3 | 673,2 | 7909,1 | 6598,0 | 315,9 | 15,3 | 630,2 | 941,8 | 1478,9 | 748,9 | 26855,8 | 26857,8 |
| 2006 | 2242,4 | 3649,6 | 0,1 | 797,5 |  |  | 799,8 | 709,9 | 8023,8 | 6124,4 | 301,3 | 15,3 | 617,6 | 984,6 | 1505,1 | 747,7 | 26519,1 | 26521,3 |
| 2007 | 2218,8 | 3734,3 | 0,1 | 820,0 | 0,6 | 0,5 | 781,1 | 779,8 | 8159,7 | 6330,9 | 306,9 | 15,1 | 622,3 | 1072,3 | 1496,7 | 774,0 | 27113,1 | 27113,0 |
| 2008 | 2121,3 | 3660,1 | 0,1 | 756,4 | 0,6 | 0,4 | 727,8 | 746,6 | 8175,8 | 6366,4 | 285,7 | 13,5 | 615,6 | 1007,6 | 1494,7 | 714,3 | 26686,8 | 26686,8 |
| 2009 | 2103,6 | 3624,7 | 0,1 | 772,3 | 0,6 | 0,4 | 718,5 | 745,4 | 8168,0 | 6526,0 | 268,5 | 11,7 | 653,7 | 1053,6 | 1556,6 | 744,6 | 26948,3 | 26948,3 |
| 2010 | 2082,5 | 3549,9 |  | 799,3 |  |  | 674,0 | 780,7 | 8307,7 | 6369,0 | 245,3 | 8,3 | 665,5 | 1113,0 | 1503,0 | 802,6 | 26900,8 | 26900,8 |

#### Schafe nach Bundesland, 1990–2010 (1.000 Tiere)

| Jahr | BW | BY | BE | BB | HB | HH | HE | MV | NI | NW | RP | SL | SN | ST | SH | TH | Summe | Deutschland |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1990 | 279,7 | 387,2 | 4,8 | 226,5 | 0,5 | 3,6 | 171,2 | 195,4 | 257,9 | 257,8 | 144,2 | 21,2 | 274,2 | 372,8 | 259,1 | 383,5 | 3239,6 | 3239,5 |
| 1991 | 275,7 | 373,9 | 4,8 | 178,3 | 0,4 | 3,2 | 157,1 | 77,4 | 236,5 | 232,2 | 139,9 | 22,2 | 138,4 | 172,4 | 243,2 | 231,8 | 2487,4 | 2487,5 |
| 1992 | 273,3 | 376,6 | 1,1 | 122,5 | 0,5 | 2,2 | 156,1 | 73,4 | 233,7 | 254,0 | 141,9 | 19,8 | 119,0 | 143,1 | 247,3 | 221,6 | 2386,1 | 2386,0 |
| 1993 | 265,6 | 421,6 | 1,1 | 125,0 | 0,4 | 2,1 | 151,8 | 73,4 | 220,1 | 242,4 | 138,2 | 20,3 | 115,1 | 128,3 | 231,1 | 232,2 | 2368,7 | 2368,8 |
| 1994 | 281,1 | 370,1 | 1,5 | 122,3 | 0,4 | 1,4 | 154,4 | 63,6 | 233,0 | 245,8 | 137,0 | 18,0 | 123,2 | 132,4 | 225,3 | 230,6 | 2340,1 | 2340,1 |
| 1995 | 291,3 | 374,8 | 1,5 | 121,6 | 0,3 | 1,5 | 158,1 | 69,3 | 235,8 | 238,6 | 138,5 | 18,7 | 127,9 | 137,9 | 237,0 | 241,9 | 2394,7 | 2394,7 |
| 1996 | 286,5 | 383,2 | 0,5 | 120,6 | 0,3 | 1,6 | 158,8 | 68,5 | 226,2 | 231,4 | 132,4 | 16,8 | 115,8 | 125,8 | 222,5 | 233,1 | 2324,0 | 2324,0 |
| 1997 | 285,3 | 382,1 | 0,5 | 128,5 | 0,3 | 1,6 | 157,8 | 70,4 | 223,9 | 223,6 | 126,7 | 15,5 | 116,5 | 120,2 | 222,9 | 226,1 | 2301,9 | 2301,9 |
| 1998 | 327,4 | 433,3 | 0,5 | 160,3 | 0,3 | 1,6 | 189,6 | 92,8 | 305,5 | 278,5 | 151,4 | 18,3 | 146,5 | 142,6 | 366,2 | 255,1 | 2869,9 | 2869,8 |
| 1999 | 294,7 | 465,7 | 0,3 | 166,6 | 0,3 | 1,5 | 182,7 | 93,7 | 254,5 | 234,4 | 144,9 | 15,4 | 131,7 | 139,8 | 363,8 | 233,4 | 2723,4 | 2723,7 |
| 2000 | 298,5 | 479,3 |  | 168,7 |  |  | 187,4 | 105,7 | 251,0 | 212,6 | 142,6 | 14,2 | 139,3 | 138,4 | 359,1 | 244,4 | 2741,2 | 2743,3 |
| 2001 | 307,8 | 472,0 | 0,3 | 156,5 | 0,2 | 3,7 | 181,2 | 112,0 | 272,1 | 225,1 | 138,2 | 16,4 | 143,7 | 137,6 | 365,8 | 238,6 | 2771,2 | 2771,1 |
| 2002 | 319,6 | 467,3 | 0,3 | 149,3 | 0,2 | 3,7 | 178,0 | 112,6 | 287,4 | 205,2 | 127,2 | 15,5 | 138,1 |  | 353,9 | 237,8 | 2596,1 | 2721,5 |
| 2004 | 306,0 | 470,3 | 0,3 | 144,5 | 0,5 | 2,8 | 157,5 | 116,3 | 277,8 | 231,1 | 128,8 | 15,8 | 142,5 | 122,7 | 368,4 | 228,2 | 2713,5 | 2713,5 |
| 2005 | 315,7 | 450,1 | 0,6 | 136,5 |  |  | 177,2 | 102,1 | 266,4 | 220,0 | 121,9 | 19,0 | 128,5 | 114,1 | 368,4 | 219,3 | 2639,8 | 2642,4 |
| 2006 | 298,7 | 448,7 | 0,6 | 133,7 |  |  | 167,5 | 101,5 | 255,6 | 201,1 | 112,9 | 18,9 | 121,7 | 112,8 | 367,6 | 216,2 | 2557,5 | 2560,3 |
| 2007 | 274,3 | 441,6 | 0,3 | 129,1 | 0,4 | 2,0 | 169,5 | 105,6 | 265,4 | 199,8 | 114,6 | 14,4 | 127,2 | 111,4 | 367,4 | 214,8 | 2537,8 | 2537,8 |
| 2008 | 299,7 | 429,5 | 0,3 | 126,1 | 0,4 | 2,0 | 149,1 | 104,3 | 250,1 | 173,8 | 108,0 | 12,4 | 125,2 | 110,5 | 344,3 | 201,4 | 2437,0 | 2437,0 |
| 2009 | 282,6 | 422,9 | 0,3 | 123,9 | 0,4 | 2,0 | 148,2 | 99,1 | 235,8 | 181,9 | 100,9 | 14,4 | 116,4 | 113,7 | 320,1 | 187,8 | 2350,4 | 2350,4 |
| 2010 | 248,7 | 387,7 | 0,4 | 102,9 | 0,2 | 1,9 | 139,9 | 83,7 | 205,6 | 136,8 | 89,2 | 10,0 | 102,2 | 103,4 | 281,7 | 194,3 | 2088,6 | 2088,5 |

#### Milchkühe nach Bundesland, 1990–2010 (1.000 Tiere)

| Jahr | BW | BY | BE | BB | HB | HH | HE | MV | NI | NW | RP | SL | SN | ST | SH | TH | Summe | Deutschland |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1990 | 573,7 | 1809,4 | 1,9 | 328,7 | 4,2 | 2,5 | 231,2 | 345,4 | 949,5 | 526,7 | 180,4 | 20,7 | 383,9 | 272,4 | 471,6 | 252,2 | 6354,4 | 6354,6 |
| 1991 | 543,0 | 1728,9 | 1,9 | 250,8 | 4,0 | 2,5 | 210,1 | 248,4 | 902,6 | 495,0 | 166,1 | 19,0 | 256,4 | 166,9 | 457,7 | 179,0 | 5632,3 | 5632,2 |
| 1992 | 518,1 | 1640,0 | 0,6 | 232,0 | 3,9 | 1,8 | 203,3 | 221,9 | 869,6 | 478,1 | 155,4 | 18,2 | 249,1 | 161,1 | 440,2 | 171,9 | 5365,2 | 5365,2 |
| 1993 | 509,4 | 1606,0 | 0,6 | 236,6 | 3,9 | 1,8 | 195,6 | 235,7 | 852,9 | 468,7 | 154,6 | 17,7 | 246,3 | 165,6 | 431,4 | 174,1 | 5300,9 | 5301,0 |
| 1994 | 503,3 | 1594,2 | 0,7 | 226,4 | 3,9 | 1,7 | 192,8 | 226,2 | 863,3 | 478,0 | 150,9 | 17,7 | 251,0 | 168,9 | 425,7 | 168,7 | 5273,4 | 5273,3 |
| 1995 | 498,5 | 1566,7 | 0,7 | 228,0 | 3,9 | 1,7 | 189,7 | 233,1 | 872,6 | 468,0 | 148,5 | 17,0 | 247,5 | 168,6 | 420,9 | 164,0 | 5229,4 | 5229,4 |
| 1996 | 490,3 | 1558,6 | 0,6 | 229,6 | 3,7 | 1,5 | 187,5 | 231,2 | 860,8 | 462,2 | 148,5 | 17,3 | 247,9 | 168,8 | 422,2 | 164,1 | 5194,8 | 5194,7 |
| 1997 | 465,7 | 1513,4 | 0,6 | 221,8 | 3,7 | 1,5 | 176,6 | 226,0 | 827,3 | 451,2 | 142,0 | 16,5 | 250,0 | 166,5 | 401,8 | 161,7 | 5026,3 | 5026,2 |
| 1998 | 447,4 | 1474,4 | 0,6 | 210,8 | 3,7 | 1,5 | 174,7 | 204,0 | 807,6 | 422,2 | 136,0 | 15,7 | 233,7 | 153,6 | 395,1 | 151,9 | 4832,9 | 4833,0 |
| 1999 | 443,1 | 1453,9 | 0,1 | 206,4 | 3,5 | 1,4 | 175,6 | 203,3 | 794,3 | 418,9 | 136,4 | 16,6 | 227,6 | 159,9 | 377,0 | 147,0 | 4765,0 | 4765,1 |
| 2000 | 429,1 | 1416,0 |  | 196,5 |  |  | 162,7 | 194,9 | 758,4 | 391,3 | 130,5 | 15,0 | 220,6 | 154,0 | 354,5 | 141,2 | 4564,7 | 4569,8 |
| 2001 | 418,2 | 1401,6 | 0,1 | 189,6 | 3,3 | 1,2 | 168,5 | 190,1 | 762,8 | 404,1 | 131,9 | 15,6 | 215,4 | 149,3 | 362,1 | 134,9 | 4548,7 | 4548,6 |
| 2002 | 410,0 | 1384,6 | 0,1 | 182,1 | 3,3 | 1,2 | 160,6 | 183,9 | 738,5 | 387,5 | 130,0 | 14,2 | 208,4 |  | 350,0 | 128,4 | 4282,8 | 4427,2 |
| 2003 | 398,3 | 1326,6 | 0,1 | 181,5 | 3,4 | 1,1 | 161,6 | 182,2 | 748,1 | 391,6 | 126,6 | 14,8 | 208,6 | 142,9 | 357,7 | 127,0 | 4372,1 | 4372,0 |
| 2004 | 385,4 | 1291,7 | 0,1 | 178,1 | 3,4 | 1,1 | 157,7 | 181,4 | 743,7 | 384,0 | 125,2 | 14,0 | 202,5 | 140,9 | 352,0 | 124,0 | 4285,2 | 4285,1 |
| 2005 | 385,3 | 1273,7 |  | 174,6 |  |  | 157,5 | 179,1 | 733,0 | 382,5 | 122,4 | 13,9 | 203,4 | 137,9 | 345,1 | 123,4 | 4231,8 | 4236,0 |
| 2006 | 375,8 | 1232,1 |  | 167,4 |  |  | 152,9 | 170,8 | 707,9 | 363,7 | 118,1 | 13,2 | 195,6 | 132,2 | 327,7 | 119,8 | 4077,2 | 4081,2 |
| 2007 | 356,2 | 1228,8 | 0,1 | 165,1 | 3,2 | 0,9 | 150,1 | 172,2 | 716,0 | 373,0 | 119,0 | 13,4 | 192,1 | 129,4 | 351,3 | 116,5 | 4087,3 | 4087,3 |
| 2008 | 365,0 | 1267,2 | 0,1 | 167,0 | 3,4 | 1,1 | 153,7 | 174,9 | 765,1 | 390,2 | 119,3 | 14,1 | 191,6 | 129,4 | 359,4 | 116,2 | 4217,7 | 4217,7 |
| 2009 | 358,1 | 1257,5 | 0,1 | 165,6 | 3,5 | 1,0 | 151,3 | 173,9 | 773,2 | 396,4 | 118,4 | 14,1 | 191,3 | 127,1 | 358,7 | 115,1 | 4205,5 | 4205,5 |
| 2010 | 353,1 | 1243,8 | 0,1 | 158,9 | 3,6 | 0,9 | 148,8 | 172,3 | 776,4 | 398,1 | 119,0 | 14,3 | 186,3 | 123,2 | 373,5 | 109,2 | 4181,7 | 4181,7 |

#### Nationale Reihe (Agrarstatistisches Jahrbuch 2001, Tab. 141; 1.000 Tiere)

| Jahr | Rinder | Schweine | Schafe | Ziegen |
|---|---|---|---|---|
| 1990 | 19488,0 | 30819,0 | 3239,0 | 90,0 |
| 1991 | 17134,0 | 26063,0 | 2488,0 | 86,0 |
| 1992 | 16207,0 | 26514,0 | 2386,0 | 90,0 |
| 1993 | 15897,0 | 26075,0 | 2369,0 | 92,0 |
| 1994 | 15962,0 | 24698,0 | 2340,0 | 95,0 |
| 1995 | 15890,0 | 23737,0 | 2395,0 | 100,0 |
| 1996 | 15760,0 | 24283,0 | 2324,0 | 105,0 |
| 1997 | 15227,0 | 24795,0 | 2302,0 | 115,0 |
| 1998 | 14942,0 | 26294,0 |  | 125,0 |
| 1999 | 14896,0 | 26101,0 | 2724,0 | 135,0 |
| 2000 | 14538,0 | 25633,0 | 2743,0 | 140,0 |

#### Nationale Rinder-/Milchkuhreihe nach Stichtag (Agrarstatistisches Jahrbuch 2001, Tab. 147; 1.000 Tiere)

| Jahr | Rinder Mai/Juni | Rinder Nov./Dez. | Milchkühe Mai/Juni | Milchkühe Nov./Dez. |
|---|---|---|---|---|
| 1990 |  | 19488 |  | 6355 |
| 1991 | 18456 | 17134 | 5911 | 5632 |
| 1992 | 16775 | 16207 | 5412 | 5365 |
| 1993 | 16151 | 15897 | 5255 | 5301 |
| 1994 | 16023 | 15962 | 5192 | 5273 |
| 1995 | 16098 | 15890 | 5233 | 5229 |
| 1996 | 15965 | 15760 | 5194 | 5195 |
| 1997 | 15612 | 15227 | 5069 | 5026 |
| 1998 | 15170 | 14942 | 4881 | 4833 |
| 1999 | 14896 | 14658 | 4765 | 4710 |
| 2000 | 14538 | 14568 | 4570 | 4564 |
| 2001 | 14536 |  | 4528 |  |

### C.4 Restlücken Task C (ehrliche „nicht gefunden“-Liste)

| Lücke | Status | Wo gesucht |
|---|---|---|
| **Schafe nach Bundesland 2003** | nicht gefunden | Destatis stellte 2002–2004 keine Fachserie „Viehbestand“ (Mai) mit Schaftabelle bereit – in der Reihe 3/4.1 existieren für diese Jahre nur die Hefte „Rinder- und Schweinebestand“ (November). Eurostat `apro_mt_ls_r` hat für 2003 nur den Bundeswert (2 697,0 Tsd., Mai). Geprüft: Heftliste der Fachserie 3 Reihe 4.1 in der Statistischen Bibliothek (https://www.statistischebibliothek.de/mir/receive/DESerie_mods_00000414), Volltextsuche „Schafbestand“ dort, Agrarstatistisches Jahrbuch (enthält keine Ländertabellen zum Viehbestand), Eurostat NUTS-2-Ebene. |
| **Sachsen-Anhalt, Mai 2002** (Rinder, Schweine, Schafe, Milchkühe) | nicht gefunden (nur Residuum und November-Anker) | In Eurostat fehlen genau diese vier Werte. Residuen aus Bund minus 15 Länder wären Rinder 378,2 / Schweine 841,6 / Schafe 125,4 / Milchkühe 144,4 Tsd. – **nicht in die JSON übernommen, weil abgeleitet**. Publiziert und in der JSON enthalten sind dagegen die **November-2002**-Werte (Rinder 373,1; Schweine 865,5 Tsd.) aus der Fachserie „Rinder- und Schweinebestand, 3. November 2003“ – anderer Stichtag, daher separat ausgewiesen. Geprüft: statistik.sachsen-anhalt.de (Berichte C III nur ab ca. 2010 online), Eurostat NUTS-2 (DEE0–DEE3, leer). |
| **Berlin/Bremen/Hamburg in Nicht-Erhebungsjahren** (u. a. 2000, 2005, 2006) | nicht erhoben | Das ist keine Recherchelücke: Destatis hat diese Länder in den betreffenden Jahren nicht erhoben („/“ bzw. Fußnote „Ergebnis: Mai …“). |
| **GENESIS-Online-Direktabruf** (41311-0001 usw.) | nicht möglich | Der alte REST-Dienst `https://www-genesis.destatis.de/genesisWS/rest/2020/...` leitet seit dem GENESIS-Relaunch auf die neue SPA um; `username=GAST&password=GAST` liefert nur noch die HTML-Shell. Auch `https://www.regionalstatistik.de/genesisws/rest/2020/...` antwortet mit `Code 15 – Sie sind nicht berechtigt` (Gastzugang deaktiviert). Deshalb wurde über Eurostat (identische Destatis-Lieferung) und die Fachserien-PDFs gearbeitet. |
| **Ziegen nach Bundesland** | nicht gefunden | Ziegen wurden bis 2009 bundesweit nur geschätzt (Fußnote 2 zu Tab. 141: „ab 1977 überhaupt nicht mehr gezählt, geschätzt“) – eine Länderaufteilung existiert für die 1990er nicht. |
