# Recherche: VDH-Welpenstatistik 2011–2025 – Ergänzung der in ds3 fehlenden Rassen (Stand 15.09.2026)

Ziel: die 22 Rassen, die in `ds3b-hunderassen-1990-2010.json` (1992–2010) stehen, aber in
`ds3-hunderassen.json` (2011–2025, nur Top-15-Rassen) fehlen, für 2011–2025 vervollständigen –
damit beim Verketten von ds3b + ds3 + ds3c keine Reihe nach 2010 abbricht. Ergebnis:
`ds3c-hunderassen-2011-2025.json`, 360 Zeilen = **24 Rassen × 15 Jahre, lückenlos**.
Alle Werte sind publizierte Originalzahlen; nichts geschätzt, nichts interpoliert.

## 1. Quelle

| Jahre | Quelle | Abruf |
|---|---|---|
| 2011–2025 (alle 15 Jahre, alle 24 Rassen) | VDH e. V., „Welpenstatistik der VDH-Mitgliedsvereine“, Onlinetabelle mit **304 Rassen × 15 Jahren**, <https://www.vdh.de/ueber-den-vdh/welpenstatistik/> | 15.09.2026 (live geladen als `vdh_live_2026.html`; zellengleich mit der vorhandenen lokalen Kopie `vdh.html` und mit `vdh_rows.json`) |
| Gegenprobe 2011 | Wayback-Snapshot 25.10.2012 von `vdh.de/welpenstatistik-liste.html` (Rohdatei `r1990/vdh_liste_2012.html`, Basis von ds3b) | – |

Die VDH-Seite liefert **eine** Tabelle für alle Jahre 2011–2025 (Spalten 2025 … 2011), d. h. die
Quelle ist für jedes Jahr dieselbe URL; darunter steht eine zweite Tabelle „Gesamt – Alle Rassen“
(2011: 80.719 … 2025: 55.053). Die Spaltensummen der 304 Rassenzeilen ergeben exakt diese
Gesamtwerte – die Tabelle ist also vollständig und intern konsistent.

Lizenz/Attribution: Verbandsstatistik, Zitat mit Quellenangabe – „Quelle: VDH, Welpenstatistik
der VDH-Mitgliedsvereine 2011–2025“.

## 2. Jahr × Rasse (Welpen pro Kalenderjahr)

Die *kursive* Zeile „2010 (ds3b)“ ist nicht Teil von ds3c, sondern der letzte Wert der
bestehenden Reihe – sie zeigt, dass die Verkettung ohne Sprung funktioniert.

| Jahr | West Highland White Terrier | Yorkshire Terrier | Airedale Terrier | Deutscher Jagdterrier | Dobermann | Parson Russell Terrier | Chihuahua | Bearded Collie |
|---|---|---|---|---|---|---|---|---|
| *2010 (ds3b)* | *953* | *767* | *997* | *879* | *802* | *904* | *941* | *716* |
| 2011 | 872 | 606 | 890 | 907 | 616 | 751 | 903 | 798 |
| 2012 | 838 | 620 | 764 | 828 | 604 | 781 | 879 | 745 |
| 2013 | 751 | 495 | 814 | 741 | 597 | 788 | 989 | 687 |
| 2014 | 734 | 528 | 792 | 847 | 635 | 768 | 913 | 695 |
| 2015 | 709 | 432 | 821 | 724 | 478 | 794 | 872 | 607 |
| 2016 | 694 | 416 | 784 | 766 | 583 | 767 | 821 | 630 |
| 2017 | 611 | 401 | 753 | 743 | 491 | 738 | 677 | 588 |
| 2018 | 642 | 366 | 761 | 739 | 417 | 699 | 643 | 548 |
| 2019 | 553 | 347 | 639 | 739 | 478 | 816 | 598 | 577 |
| 2020 | 546 | 366 | 834 | 738 | 442 | 677 | 602 | 504 |
| 2021 | 595 | 387 | 725 | 796 | 442 | 825 | 620 | 735 |
| 2022 | 482 | 308 | 632 | 590 | 417 | 603 | 496 | 416 |
| 2023 | 435 | 228 | 463 | 473 | 302 | 609 | 446 | 374 |
| 2024 | 364 | 241 | 470 | 514 | 363 | 532 | 298 | 405 |
| 2025 | 378 | 225 | 353 | 547 | 416 | 540 | 263 | 334 |

| Jahr | Cairn Terrier | Neufundländer | Tibet Terrier | Foxterrier (Drahthaar) | Deutscher Wachtelhund | Schnauzer | Beagle | Siberian Husky |
|---|---|---|---|---|---|---|---|---|
| *2010 (ds3b)* | *491* | *480* | *600* | *446* | *699* | *539* | *818* | *377* |
| 2011 | 518 | 471 | 571 | 408 | 577 | 436 | 711 | 278 |
| 2012 | 496 | 454 | 598 | 347 | 578 | 373 | 757 | 339 |
| 2013 | 423 | 335 | 515 | 323 | 556 | 422 | 626 | 341 |
| 2014 | 527 | 462 | 543 | 332 | 642 | 460 | 692 | 339 |
| 2015 | 323 | 318 | 525 | 293 | 564 | 453 | 585 | 324 |
| 2016 | 430 | 445 | 478 | 313 | 590 | 449 | 650 | 337 |
| 2017 | 466 | 340 | 445 | 279 | 604 | 370 | 643 | 364 |
| 2018 | 434 | 290 | 465 | 259 | 569 | 470 | 581 | 327 |
| 2019 | 403 | 389 | 429 | 306 | 619 | 392 | 433 | 371 |
| 2020 | 362 | 262 | 429 | 300 | 568 | 416 | 602 | 333 |
| 2021 | 536 | 318 | 544 | 363 | 662 | 541 | 610 | 438 |
| 2022 | 368 | 210 | 338 | 281 | 536 | 381 | 445 | 357 |
| 2023 | 312 | 195 | 279 | 233 | 411 | 265 | 411 | 234 |
| 2024 | 294 | 176 | 290 | 175 | 443 | 271 | 327 | 271 |
| 2025 | 259 | 175 | 233 | 197 | 357 | 246 | 312 | 184 |

| Jahr | Weimaraner | Mops | Havaneser | Französische Bulldogge | Australian Shepherd | Jack Russell Terrier | Lagotto Romagnolo | Whippet |
|---|---|---|---|---|---|---|---|---|
| *2010 (ds3b)* | *575* | *719* | *581* | *325* | *480* | *163* | – | – |
| 2011 | 418 | 693 | 733 | 301 | 406 | 148 | 156 | 531 |
| 2012 | 607 | 545 | 777 | 312 | 448 | 154 | 166 | 567 |
| 2013 | 429 | 479 | 804 | 274 | 356 | 174 | 248 | 588 |
| 2014 | 510 | 448 | 639 | 299 | 378 | 169 | 229 | 605 |
| 2015 | 464 | 398 | 828 | 232 | 341 | 186 | 316 | 568 |
| 2016 | 450 | 395 | 828 | 210 | 318 | 164 | 407 | 627 |
| 2017 | 482 | 428 | 857 | 237 | 425 | 142 | 308 | 517 |
| 2018 | 449 | 282 | 812 | 154 | 373 | 203 | 368 | 542 |
| 2019 | 390 | 272 | 741 | 131 | 332 | 182 | 517 | 630 |
| 2020 | 500 | 251 | 811 | 193 | 408 | 164 | 562 | 712 |
| 2021 | 473 | 296 | 851 | 209 | 448 | 248 | 736 | 873 |
| 2022 | 431 | 207 | 678 | 118 | 387 | 189 | 639 | 649 |
| 2023 | 346 | 136 | 522 | 125 | 421 | 250 | 645 | 593 |
| 2024 | 301 | 152 | 562 | 62 | 523 | 196 | 549 | 520 |
| 2025 | 334 | 133 | 530 | 43 | 493 | 221 | 534 | 584 |

## 3. Neu aufgenommene Rassen (Top-20-Prüfung 2011–2025)

Über alle 15 Jahre bilden 30 verschiedene Rassen die jeweiligen Top 20. 28 davon standen schon in
ds3 bzw. ds3b; **zwei fehlten in beiden Dateien** und sind neu in ds3c (Label exakt wie in der
VDH-Tabelle):

| Label in ds3c | bester Rang | Jahr | Anzahl Jahre in den Top 20 |
|---|---|---|---|
| `Whippet` | 18 | 2025 | 1 |
| `Lagotto Romagnolo` | 18 | 2023 | 1 |

Damit ist jede Rasse, die 2011–2025 in irgendeinem Jahr Top 20 war, in ds3 + ds3b + ds3c enthalten.
Knapp darunter (Rang 21–25, **nicht** aufgenommen, da außerhalb des Auftrags): Miniature Bull
Terrier (Rang 22 in 2020, 25 in 2018 und 2023) – bei Bedarf aus derselben Tabelle nachrüstbar.

## 4. Namensschreibweisen (Merge-Kompatibilität)

* `Foxterrier (Drahthaar)` – die heutige VDH-Tabelle schreibt „Fox Terrier (Drahthaar)“, die alten
  Tabellen (und ds3b) „Foxterrier (Drahthaar)“. In ds3c steht die ds3b-Schreibweise.
* Alle übrigen 21 Rassennamen sind in der heutigen Tabelle und in ds3b identisch geschrieben
  (`Neufundländer`, `Französische Bulldogge`, `Deutscher Jagdterrier`, `Parson Russell Terrier`,
  `Jack Russell Terrier`, `Tibet Terrier`, `Havaneser`, `Mops`, `Schnauzer`, … ).
* Nicht betroffen, aber zu beachten: ds3b führt `Collie` ohne Haarart; das entspricht
  `Collie (Langhaar)` in ds3/VDH-Tabelle. `Collie (Kurzhaar)` ist eine eigene Zeile der
  VDH-Tabelle und in keiner der Dateien enthalten.
* Die Gesamtsumme (`Alle VDH-Rassen (Summe der Tabelle)`) steht bereits in ds3 und wird in ds3c
  nicht wiederholt.

## 5. Gegenproben

1. **ds3 vs. Tabelle:** alle 360 Werte von ds3 (23 Rassen + Gesamtsumme × 15 Jahre) wurden aus der
   live geladenen Tabelle nachgerechnet – **0 Abweichungen**, u. a. Labrador Retriever
   (2011 = 2.802, 2021 = 3.219, 2025 = 2.401) und Deutscher Schäferhund (2011 = 13.339,
   2019 = 8.634, 2025 = 6.374). Auch die Gesamtsummen stimmen (2011 = 80.719 … 2025 = 55.053).
2. **Anschluss an ds3b:** die Spalte 2011 der heutigen Tabelle ist für alle 24 Rassen zellengleich
   mit der Spalte 2011 des Wayback-Snapshots vom 25.10.2012, aus dem ds3b stammt
   (z. B. West Highland White Terrier 872, Airedale Terrier 890, Havaneser 733, Whippet 531).
3. **ds3b vs. Snapshot:** 41 der 45 ds3b-Rassen ließen sich im Jahr 2010 gegen denselben Snapshot
   prüfen – 0 Abweichungen; die vier „Treffer-Fehlschläge“ sind reine Namensvarianten des alten
   Snapshots (Deutscher Boxer, Collie, Foxterrier (Drahthaar), Shetland Sheepdog).
4. **Nullen/Lücken:** in der VDH-Tabelle hat jede der 304 Rassen für jedes Jahr eine Zahl; leere
   Zellen gibt es nicht, „keine Welpen gemeldet“ wird als `0` ausgegeben (z. B. Japanischer
   Terrier 2011–2020 = 0). Für die 24 Rassen dieser Datei tritt **kein einziger 0-Wert** auf, alle
   360 Werte sind echte positive Meldungen. Es musste also nichts als „missing“ markiert werden.
   (Die Tabelle unterscheidet „nicht gezüchtet“ und „0“ nicht – falls für andere Rassen Nullen
   übernommen werden, ist das zu vermerken.)

## 6. Nicht abgerufen / offene Punkte

* **2026** existiert noch nicht (die Tabelle endet mit 2025).
* **1990 und 1991** bleiben weiterhin unbekannt (siehe `research-1990.md`, Abschnitt A) – daran
  ändert diese Ergänzung nichts.
* Die von der Presse genannte Zahl „113.702 Welpen (2024)“ passt nicht zur Tabellensumme (56.851)
  und wurde – wie in ds3 – nicht übernommen.
* **Offene Namensbaustelle (nicht von mir geändert):** ds3b nennt die Rasse `Collie`, ds3 nennt sie
  `Collie (Langhaar)`. Beide Reihen sind vollständig (1992–2010 bzw. 2011–2025), zerfallen beim
  Merge aber in zwei Halbreihen. Empfehlung: in ds3b `Collie` → `Collie (Langhaar)` umbenennen
  (ein Suchen-und-Ersetzen, 19 Zeilen). Sonst treten beim Zusammenführen von ds3 + ds3b + ds3c
  **keine** Konflikte auf: 0 widersprüchliche Zellen, und alle 22 nachgetragenen Rassen laufen
  durchgehend von 1992 bis 2025 (Ausnahmen mit früherem Reihenbeginn, schon in ds3b so:
  Australian Shepherd und Jack Russell Terrier ab 1996).
* `Miniature Bull Terrier` (Rang 21–25) und die übrigen ~280 Rassen der Tabelle wurden bewusst
  nicht extrahiert; die vollständige Rohtabelle liegt als `vdh_rows.json`/`vdh_live_2026.html`
  bereit, eine Erweiterung ist ohne neue Recherche möglich.
