# Tierartenschwerpunkt nach Kammerbereich, 2002–2025

Stand der Auswertung: 15.09.2026. Alle Werte stammen aus den Original-PDFs der Bundestierärztekammer
(lokal in `btk/`, gelesen mit `pdftotext -layout` **und** unabhängig mit `pdfplumber` über Wort-Koordinaten;
beide Wege stimmen überein). **Keine Schätzungen, keine Interpolation, keine Korrekturen.** Fehlwerte bleiben Fehlwerte.

Basis-URL: `https://www.bundestieraerztekammer.de/btk/statistik/downloads/<datei>` · Übersicht: https://www.bundestieraerztekammer.de/btk/statistik/

Kammer-Kürzel: BW Baden-Württemberg · BY Bayern · BE Berlin · BB Brandenburg · HB Bremen · HH Hamburg ·
HE Hessen · MV Mecklenburg-Vorpommern · NI Niedersachsen · NR Nordrhein · WL Westfalen-Lippe ·
RP Rheinland-Pfalz · SL Saarland · SN Sachsen · ST Sachsen-Anhalt · SH Schleswig-Holstein · TH Thüringen.

`k. A.` = in der Quelle ausdrücklich „k. A."; `–` = Zelle in der Quelle leer. **!** = Prüfsumme verfehlt.

---

## 0. Quellen, Tabellennummer, Zeilenbeschriftung und Prüfsumme je Jahr

| Jahr | Datei | Tabelle | Bezugsgröße (Zeilenkopf) | gedruckte Kategorienlabels | Prüfsumme Σ17 = publ. Summe? |
|---|---|---|---|---|---|
| 2002 | `statistik_02.pdf` | Tab. 1 A Nr. 1 a | 1. Praktizierende Tierärzte | a4. Praxis für überwiegend **Großtiere** / a5. Praxis für überwiegend **Kleintiere** / a6. Praxis für **Groß- und Kleintiere** | ja (alle 3) |
| 2003 | `statistik03.pdf` | Tab. 1 A Nr. 1 a | 1. Praktizierende Tierärzte | wie 2002 | ja |
| 2004 | `statistik2004.pdf` | Tab. 1 A Nr. 1 a | 1. Praktizierende Tierärzte | wie 2002 | ja |
| **2005** | `statistik_final.pdf` | Tab. 1 **verkürzt** | – | **keine Praxisart-/Tierartenzeilen publiziert** | **Jahr fehlt vollständig** |
| 2006 | `dtb_sd_statistik_2006.pdf` | Tab. 1 | Praktizierende Tierärzte | `Nutztiere` / `Kleintiere` / `Nutztiere und Kleintiere` (ohne `*`) | ja |
| 2007 | `dtb_sd_statistik_2007.pdf` | Tab. 1 | Praktizierende Tierärzte ges. | `Nutztiere*` / `Kleintiere*` / `Nutztiere und Kleintiere*` | ja |
| 2008 | `sd_dtb_statistik08.pdf` | Tab. 1 | Praktizierende Tierärzte ges. | wie 2007 | ja |
| 2009 | `dtb_04_s_500-505_statistik.pdf` | Tab. 1 | Praktizierende Tierärzte ges. | wie 2007 | ja |
| 2010 | `dtb_statistik2010.pdf` | Tab. 1 | Praktizierende Tierärzte ges. | wie 2007 | ja |
| 2011 | `dtb_Statistik2011.pdf` | Tab. 1 | Praktizierende Tierärzte ges. | wie 2007 | ja |
| 2012 | `Statistik_2012_korr.pdf` | Tab. 1 | **Niedergelassene** Tierärzte ges. | wie 2007 | ja |
| 2013 | `DTBl_06_2014_Statistik.pdf` | Tab. 1 | Niedergelassene Tierärzte ges. | wie 2007 | ja |
| 2014 | `Statistik-2014.pdf` | Tab. 1 | Niedergelassene Tierärzte ges. | wie 2007 | ja |
| 2015 | `Statistik-2015.pdf` | Tab. 1 | Niedergelassene Tierärzte ges. | wie 2007 | ja |
| 2016 | `Statistik-2016.pdf` | Tab. 1 | Niedergelassene Tierärzte ges. | wie 2007 | ja |
| 2017 | `2017.pdf` (lokal `btk_2017.pdf`) | Tab. 1 | Niedergelassene Tierärzte ges. | wie 2007 | ja |
| 2018 | `Statistik_2018.pdf` | Tab. 1 | Niedergelassene Tierärzte ges. | wie 2007 | ja |
| 2019 | `2019.pdf` | **Tab. 2** | Niedergelassene Tierärzte ges. | `– Kleintiere` / `– Pferd*` / `– Nutztiere` / `– Kleintiere und Pferde` / `– Nutztiere und Pferde` / `– Nutztiere und Kleintiere` / `– Nutztiere, Pferde und Kleintiere` | **nein (alle 3)** |
| 2020 | `2020.pdf` | Tab. 2 | Niedergelassene Tierärzt:innen ges. | wie 2019 | ja |
| 2021 | `2021.pdf` | Tab. 2 | Niedergelassene Tierärzt:innen ges. | wie 2019, aber **ohne Gedankenstrich und ohne `*`** | ja |
| 2022 | `2022.pdf` | Tab. 2 | Niedergelassene Tierärzt:innen ges. | ohne Gedankenstrich, **mit `*`** (`Kleintiere*` …) | ja |
| 2023 | `2023.pdf` | Tab. 2 | Niedergelassene Tierärzt:innen ges. | wie 2022 | ja (gegen die Summenspalte von **Tab. 2**) |
| 2024 | `2024.pdf` | Tab. 2 | Niedergelassene Tierärzt:innen ges. | wie 2022 | **nein (alle 3)** |
| 2025 | `2025_korr.pdf` | Tab. 2 | Niedergelassene Tierärzt:innen ges. | wie 2022 | ja |

**Prüfsumme** = Summe der 17 Kammerspalten (Spalte `ges.`) gegen die in derselben Zeile gedruckte Spalte
„gesamt"/„Summe". Die Prüfung wurde für alle drei Kategorien **und** zusätzlich für die Kopfzeile
(Praktizierende bzw. Niedergelassene) jedes Jahres durchgeführt; die Kopfzeile stimmt in **allen** Jahren.

---

## 1. Kleintiere (bzw. 2002–2004 „Praxis für überwiegend Kleintiere")

| Jahr | BW | BY | BE | BB | HB | HH | HE | MV | NI | NR | WL | RP | SL | SN | ST | SH | TH | Σ 17 | publ. Summe | Δ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2002 | 399 | 767 | 319 | 128 | 45 | 107 | 449 | 65 | 467 | 574 | 362 | 158 | 57 | 169 | 88 | 198 | 67 | 4.419 | 4.419 | 0 |
| 2003 | 406 | 796 | 323 | 144 | 44 | 109 | 462 | 64 | 485 | 594 | 372 | 164 | 64 | 174 | 86 | 205 | 68 | 4.560 | 4.560 | 0 |
| 2004 | 425 | 824 | 321 | 145 | 44 | 112 | 469 | 65 | 504 | 612 | 388 | 171 | 64 | 178 | 85 | 210 | 70 | 4.687 | 4.687 | 0 |
| 2006 | 0 | 958 | 326 | 171 | 53 | 119 | 504 | 64 | 555 | 662 | 419 | 200 | 65 | 190 | 88 | 226 | 73 | 4.673 | 4.673 | 0 |
| 2007 | 490 | 992 | 335 | 182 | 50 | 128 | 511 | 63 | 578 | 695 | 428 | 216 | 63 | 191 | 89 | 255 | 71 | 5.337 | 5.337 | 0 |
| 2008 | 507 | 1.017 | 347 | 188 | 51 | 131 | 515 | 59 | 593 | 695 | 437 | 215 | 65 | 185 | 96 | 249 | 73 | 5.423 | 5.423 | 0 |
| 2009 | 522 | 1.022 | 345 | 196 | 52 | 131 | 520 | 61 | 604 | 715 | 443 | 220 | 63 | 182 | 98 | 254 | 76 | 5.504 | 5.504 | 0 |
| 2010 | 524 | 1.027 | 360 | 199 | 52 | 138 | 525 | 61 | 626 | 727 | 461 | 235 | 67 | 182 | 98 | 251 | 103 | 5.636 | 5.636 | 0 |
| 2011 | 539 | 1.030 | 368 | 204 | 52 | 140 | 541 | 60 | 636 | 739 | 470 | 246 | 70 | 180 | 100 | 252 | 124 | 5.751 | 5.751 | 0 |
| 2012 | 545 | 1.051 | 384 | 207 | 50 | 142 | 561 | 60 | 655 | 753 | 480 | 261 | 70 | 183 | 107 | 253 | 119 | 5.881 | 5.881 | 0 |
| 2013 | 547 | 1.045 | 385 | 206 | 49 | 142 | 571 | 62 | 668 | 737 | 500 | 259 | 73 | 186 | 143 | 257 | 119 | 5.949 | 5.949 | 0 |
| 2014 | 553 | 1.050 | 375 | 210 | 47 | 145 | 576 | 64 | 674 | 755 | 502 | 265 | 72 | 186 | 141 | 258 | 121 | 5.994 | 5.994 | 0 |
| 2015 | 557 | 1.037 | 373 | 213 | 47 | 143 | 583 | 63 | 685 | 760 | 506 | 268 | 70 | 187 | 134 | 263 | 121 | 6.010 | 6.010 | 0 |
| 2016 | 566 | 1.153 | 377 | 216 | 48 | 148 | 581 | 64 | 695 | 763 | 506 | 277 | 74 | 184 | 132 | 254 | 119 | 6.157 | 6.157 | 0 |
| 2017 | 505 | 1.147 | 366 | 224 | 47 | 146 | 583 | 69 | 694 | 761 | 509 | 285 | 72 | 183 | 132 | 260 | 116 | 6.099 | 6.099 | 0 |
| 2018 | 639 | 1.062 | 360 | 229 | 45 | 152 | 579 | 68 | 704 | 764 | 508 | 281 | 72 | 186 | 129 | 252 | 112 | 6.142 | 6.142 | 0 |
| 2019 | 679 | 1.072 | 355 | 234 | k. A. | 160 | 592 | k. A. | 717 | 781 | 504 | 296 | 74 | 193 | 129 | 239 | 110 | 6.135 | 5.912 | +223 **!** |
| 2020 | 697 | 1.087 | 353 | 234 | k. A. | 150 | 607 | k. A. | 718 | 780 | 527 | 301 | 74 | 201 | 130 | 250 | 108 | 6.217 | 6.217 | 0 |
| 2021 | 701 | 1.081 | 341 | 229 | k. A. | 5 | 559 | k. A. | 705 | 767 | 563 | 303 | 75 | 202 | k. A. | 251 | 117 | 5.899 | 5.899 | 0 |
| 2022 | 662 | 1.057 | 326 | 223 | k. A. | k. A. | 541 | k. A. | 702 | 767 | 570 | 298 | 73 | 211 | k. A. | 257 | 115 | 5.802 | 5.802 | 0 |
| 2023 | 572 | 1.030 | 348 | 227 | k. A. | k. A. | 528 | k. A. | 686 | 746 | 542 | 305 | 78 | 218 | k. A. | 238 | 111 | 5.629 | 5.629 | 0 |
| 2024 | 583 | 1.022 | 305 | 248 | k. A. | 131 | 519 | 87 | 687 | 723 | 531 | 288 | 91 | 237 | 140 | 243 | 118 | 5.953 | 6.241 | -288 **!** |
| 2025 | 581 | 1.006 | 299 | 239 | k. A. | 133 | 504 | 84 | 677 | 730 | 528 | 283 | 91 | 262 | 139 | 250 | 124 | 5.930 | 5.930 | 0 |

---

## 2. Nutztiere (2002–2004 „Praxis für überwiegend Großtiere")

| Jahr | BW | BY | BE | BB | HB | HH | HE | MV | NI | NR | WL | RP | SL | SN | ST | SH | TH | Σ 17 | publ. Summe | Δ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2002 | 126 | 418 | 3 | 117 | 2 | 2 | 72 | 73 | 276 | 84 | 123 | 25 | 6 | 67 | 80 | 107 | 56 | 1.637 | 1.637 | 0 |
| 2003 | 123 | 424 | 3 | 112 | 2 | 2 | 79 | 69 | 279 | 84 | 127 | 25 | 7 | 65 | 81 | 99 | 54 | 1.635 | 1.635 | 0 |
| 2004 | 127 | 421 | 1 | 112 | 2 | 2 | 81 | 64 | 286 | 91 | 135 | 28 | 8 | 60 | 79 | 101 | 50 | 1.648 | 1.648 | 0 |
| 2006 | 1.138 | 416 | 3 | 101 | 2 | 23 | 73 | 56 | 305 | 83 | 139 | 40 | 1 | 53 | 78 | 87 | 33 | 2.631 | 2.631 | 0 |
| 2007 | 66 | 400 | 2 | 88 | 3 | 4 | 71 | 58 | 277 | 72 | 142 | 18 | 1 | 53 | 68 | 82 | 33 | 1.438 | 1.438 | 0 |
| 2008 | 69 | 414 | 3 | 87 | 3 | 4 | 68 | 58 | 261 | 71 | 150 | 16 | 1 | 52 | 63 | 63 | 31 | 1.414 | 1.414 | 0 |
| 2009 | 72 | 419 | 2 | 84 | 3 | 3 | 65 | 56 | 260 | 69 | 132 | 14 | 1 | 50 | 58 | 59 | 33 | 1.380 | 1.380 | 0 |
| 2010 | 72 | 415 | 1 | 80 | 3 | 3 | 53 | 55 | 256 | 69 | 114 | 14 | 1 | 46 | 51 | 59 | 28 | 1.320 | 1.320 | 0 |
| 2011 | 60 | 404 | 1 | 77 | 3 | 3 | 41 | 52 | 247 | 70 | 112 | 13 | 1 | 44 | 49 | 55 | 27 | 1.259 | 1.259 | 0 |
| 2012 | 60 | 398 | 0 | 71 | 3 | 3 | 33 | 49 | 239 | 68 | 113 | 12 | 1 | 40 | 50 | 51 | 27 | 1.218 | 1.218 | 0 |
| 2013 | 57 | 401 | 0 | 69 | 3 | 3 | 29 | 48 | 240 | 66 | 110 | 13 | 1 | 39 | 31 | 46 | 26 | 1.182 | 1.182 | 0 |
| 2014 | 60 | 407 | 0 | 66 | 3 | 4 | 27 | 47 | 237 | 63 | 104 | 13 | 0 | 37 | 28 | 43 | 27 | 1.166 | 1.166 | 0 |
| 2015 | 57 | 395 | 0 | 64 | 3 | 3 | 28 | 45 | 228 | 66 | 105 | 14 | 0 | 36 | 28 | 43 | 25 | 1.140 | 1.140 | 0 |
| 2016 | 57 | 284 | 0 | 61 | 3 | 3 | 26 | 43 | 214 | 70 | 101 | 14 | 0 | 35 | 29 | 44 | 26 | 1.010 | 1.010 | 0 |
| 2017 | 192 | 287 | 0 | 58 | 2 | 3 | 27 | 42 | 206 | 67 | 98 | 12 | 0 | 33 | 30 | 44 | 24 | 1.125 | 1.125 | 0 |
| 2018 | 70 | 263 | 1 | 56 | 2 | 3 | 25 | 38 | 205 | 68 | 99 | 12 | 0 | 34 | 31 | 43 | 21 | 971 | 971 | 0 |
| 2019 | 71 | 254 | 1 | 39 | k. A. | 3 | 26 | k. A. | 202 | 65 | 93 | 11 | 0 | 30 | 32 | 41 | 19 | 887 | 838 | +49 **!** |
| 2020 | 70 | 249 | 1 | 32 | k. A. | 0 | 20 | k. A. | 199 | 66 | 84 | 11 | 0 | 26 | 32 | 38 | 20 | 848 | 848 | 0 |
| 2021 | 66 | 241 | 1 | 33 | k. A. | 0 | 25 | k. A. | 198 | 65 | 50 | 11 | 0 | 23 | k. A. | 34 | 21 | 768 | 768 | 0 |
| 2022 | 60 | 232 | 1 | 26 | k. A. | k. A. | 24 | k. A. | 193 | 55 | 48 | 10 | 0 | 20 | k. A. | 40 | 19 | 728 | 728 | 0 |
| 2023 | 58 | 229 | 1 | 30 | k. A. | k. A. | 24 | k. A. | 185 | 50 | 47 | 10 | 0 | 23 | k. A. | 30 | 18 | 705 | 705 | 0 |
| 2024 | 56 | 225 | 1 | 24 | k. A. | 0 | 24 | 20 | 179 | 52 | 45 | 9 | 0 | 22 | 22 | 34 | 19 | 732 | 741 | -9 **!** |
| 2025 | 59 | 212 | 1 | 19 | k. A. | 0 | 25 | 19 | 179 | 48 | 45 | 8 | 0 | 26 | 20 | 35 | 22 | 718 | 718 | 0 |

---

## 3. Nutztiere und Kleintiere (2002–2004 „Praxis für Groß- und Kleintiere")

| Jahr | BW | BY | BE | BB | HB | HH | HE | MV | NI | NR | WL | RP | SL | SN | ST | SH | TH | Σ 17 | publ. Summe | Δ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2002 | 517 | 745 | 11 | 273 | 7 | 17 | 260 | 216 | 631 | 225 | 318 | 219 | 37 | 302 | 220 | 201 | 220 | 4.419 | 4.419 | 0 |
| 2003 | 525 | 733 | 9 | 263 | 5 | 14 | 264 | 210 | 627 | 221 | 313 | 220 | 36 | 306 | 210 | 206 | 210 | 4.372 | 4.372 | 0 |
| 2004 | 532 | 729 | 9 | 261 | 5 | 12 | 276 | 208 | 637 | 221 | 303 | 217 | 35 | 305 | 208 | 214 | 204 | 4.376 | 4.376 | 0 |
| 2006 | 3 | 798 | 11 | 267 | 5 | 12 | 297 | 194 | 665 | 234 | 317 | 234 | 48 | 332 | 200 | 235 | 202 | 4.054 | 4.054 | 0 |
| 2007 | 603 | 762 | 11 | 275 | 4 | 12 | 307 | 187 | 679 | 243 | 316 | 237 | 50 | 328 | 201 | 246 | 206 | 4.667 | 4.667 | 0 |
| 2008 | 595 | 751 | 13 | 272 | 4 | 14 | 313 | 187 | 695 | 239 | 315 | 244 | 48 | 339 | 198 | 275 | 207 | 4.709 | 4.709 | 0 |
| 2009 | 594 | 752 | 14 | 273 | 3 | 15 | 318 | 185 | 696 | 244 | 338 | 246 | 50 | 342 | 198 | 286 | 199 | 4.753 | 4.753 | 0 |
| 2010 | 585 | 772 | 14 | 273 | 2 | 15 | 334 | 180 | 706 | 255 | 359 | 247 | 50 | 344 | 193 | 294 | 178 | 4.801 | 4.801 | 0 |
| 2011 | 594 | 779 | 11 | 278 | 2 | 17 | 343 | 179 | 705 | 266 | 351 | 243 | 50 | 341 | 186 | 300 | 177 | 4.822 | 4.822 | 0 |
| 2012 | 577 | 797 | 9 | 272 | 1 | 16 | 354 | 169 | 706 | 269 | 354 | 241 | 53 | 333 | 183 | 303 | 170 | 4.807 | 4.807 | 0 |
| 2013 | 577 | 803 | 10 | 270 | 2 | 16 | 359 | 164 | 709 | 272 | 346 | 244 | 49 | 336 | 162 | 316 | 172 | 4.807 | 4.807 | 0 |
| 2014 | 570 | 787 | 10 | 271 | 2 | 18 | 363 | 161 | 703 | 275 | 354 | 243 | 47 | 329 | 164 | 308 | 168 | 4.773 | 4.773 | 0 |
| 2015 | 576 | 796 | 11 | 263 | 2 | 19 | 362 | 160 | 709 | 281 | 355 | 244 | 49 | 320 | 163 | 301 | 165 | 4.776 | 4.776 | 0 |
| 2016 | 570 | 704 | 10 | 264 | 2 | 19 | 365 | 166 | 705 | 276 | 347 | 246 | 49 | 317 | 162 | 293 | 167 | 4.662 | 4.662 | 0 |
| 2017 | 543 | 618 | 12 | 261 | 2 | 23 | 369 | 164 | 700 | 272 | 349 | 245 | 48 | 307 | 167 | 295 | 163 | 4.538 | 4.538 | 0 |
| 2018 | 579 | 599 | 13 | 260 | 2 | 23 | 372 | 154 | 709 | 274 | 354 | 242 | 46 | 303 | 165 | 297 | 162 | 4.554 | 4.554 | 0 |
| 2019 | 325 | 577 | 1 | 202 | k. A. | 0 | 58 | k. A. | 444 | 175 | 185 | 176 | 22 | 256 | 141 | 163 | 138 | 2.863 | 2.651 | +212 **!** |
| 2020 | 316 | 556 | 1 | 174 | k. A. | 0 | 54 | k. A. | 432 | 177 | 161 | 171 | 18 | 171 | 141 | 158 | 129 | 2.659 | 2.659 | 0 |
| 2021 | 306 | 530 | 1 | 161 | k. A. | 0 | 48 | k. A. | 418 | 169 | 85 | 169 | 16 | 164 | k. A. | 144 | 114 | 2.325 | 2.325 | 0 |
| 2022 | 286 | 484 | 0 | 158 | k. A. | k. A. | 45 | k. A. | 410 | 160 | 73 | 161 | 16 | 153 | k. A. | 129 | 108 | 2.183 | 2.183 | 0 |
| 2023 | 249 | 464 | 1 | 149 | k. A. | k. A. | 41 | k. A. | 393 | 150 | 68 | 167 | 13 | 148 | k. A. | 122 | 106 | 2.071 | 2.071 | 0 |
| 2024 | 241 | 447 | 1 | 110 | k. A. | 0 | 39 | 80 | 377 | 149 | 63 | 161 | 9 | 140 | 127 | 119 | 102 | 2.165 | 2.326 | -161 **!** |
| 2025 | 229 | 431 | 1 | 83 | k. A. | 0 | 33 | 76 | 360 | 138 | 58 | 149 | 8 | 107 | 128 | 114 | 99 | 2.014 | 2.014 | 0 |

---

## 4. Definitionsbrüche – was **nicht** verglichen werden darf

1. **2002–2004 vs. ab 2006.** Bis 2004 heißt die Rubrik „Praxis für überwiegend Großtiere" bzw.
   „Groß- und Kleintiere", ab 2006 „Nutztiere" bzw. „Nutztiere und Kleintiere". Die Systematik ist
   ähnlich (Personen, nicht Praxen), das Wort ändert sich aber; 2005 fehlt als Stützpunkt dazwischen.
2. **Bruch 2019: Pferde werden eigene Kategorie.** Bis einschließlich 2018 sind Pferde in „Nutztiere"
   („Großtiere") enthalten. Ab 2019 gibt es sieben Kategorien (Kleintiere / Pferde / Nutztiere /
   Kleintiere und Pferde / Nutztiere und Pferde / Nutztiere und Kleintiere / Nutztiere, Pferde und
   Kleintiere). Die BTK selbst (DTBl 8/2024, S. 990) schreibt, das schließe eine Vergleichbarkeit mit
   den Jahren vor 2019 aus. Der Einbruch 2018→2019 bei „Nutztiere" (971 → 838) und vor allem bei
   „Nutztiere und Kleintiere" (4.554 → 2.651) ist deshalb **kein** realer Rückgang, sondern eine
   Umverteilung auf die neuen Pferde-Kategorien. **Nur die Reihe „Kleintiere" läuft über den Bruch
   einigermaßen durch** – auch sie verliert aber ab 2019 die reinen Kleintier-plus-Pferde-Praxen
   (2019: 662 Personen) an die neue Kategorie „Kleintiere und Pferde".
3. **Bezugsgröße.** Bis 2011 „Praktizierende Tierärzte", ab 2012 „Niedergelassene Tierärzte"
   (inhaltlich selbstständig Tätige, laut BTK identisch abgegrenzt). Bis 2011 Datenbasis „Zentrale
   Tierärztedatei", ab 2012 Meldungen der Landeskammern.
4. **Fußnote der Quelle** zu allen drei Zeilen ab 2007: „zusätzliche Angaben, die sich nicht in der
   Gesamtzahl widerspiegeln; k. A. = keine Angabe". Faktisch summieren sich die Kategorien 2006–2015
   exakt auf die Zahl der Niedergelassenen, ab 2016 bleibt eine wachsende Lücke.

---

## 5. Bekannte Datenprobleme – gekennzeichnet, nicht repariert

| Jahr | Kammer | Befund | Umgang hier |
|---|---|---|---|
| **2005** | alle | Tab. 1 der Statistik 2005 (`statistik_final.pdf`) ist stark verkürzt und enthält **weder** Praxisart- **noch** Tierartenzeilen. Vollständig durchsucht. | Jahr fehlt komplett |
| **2006** | BW | Baden-Württemberg meldete alle Praktizierenden unter „Nutztiere" (1.138) und **Kleintiere = 0**. Der Bundeswert 2006 ist dadurch verzerrt (Kleintiere ca. 480 zu niedrig, Nutztiere entsprechend zu hoch). Die BTK-Berichtigung `dtb_stat_06_bericht.pdf` korrigiert ausdrücklich nur Tab. 8/9/11, **nicht** Tab. 1. | 0 als publiziert übernommen, `quality` markiert |
| **2016/2017** | BW, BY | Der Sprung Bayern „Nutztiere" 395 (2015) → 284 (2016) und BW „Nutztiere" 57 (2016) → **192** (2017) → 70 (2018) bzw. BW „Kleintiere" 566 → 505 → 639 ist eine Meldeschwankung, keine reale Bewegung. | so publiziert übernommen, BW 2017 markiert |
| **2019** | Bund | **Prüfsumme verfehlt:** Die 17 Kammerspalten addieren sich in Tab. 2 auf mehr als die gedruckte Spalte „Summe": Kleintiere 6.135 statt 5.912 (**+223**), Nutztiere 887 statt 838 (**+49**), Nutztiere und Kleintiere 2.863 statt 2.651 (**+212**). Zahlen am gerenderten PDF (S. 3 und 4) Ziffer für Ziffer nachgeprüft – sie stehen so im Heft. Die Kopfzeile „Niedergelassene" stimmt dagegen exakt (12.019). | beide Werte ausgewiesen, Jahr markiert |
| **2020** | MV–TH | Die Seiten 4–10 des veröffentlichten `2020.pdf` enthalten **keinen Text**, sondern nur Bilder (geprüft mit `pdffonts`/`pdfimages`; erneuter Download von der BTK-Seite liefert dieselbe Datei). Die Fortsetzung von Tab. 2 (M.-Vorpommern bis Thüringen) wurde deshalb aus der gerenderten Bildseite (200 dpi) abgelesen. | Werte übernommen, `source` weist die Bildseite aus; die **Prüfsumme bestätigt die Ablesung in allen drei Kategorien exakt** |
| **2021** | HH | Hamburg weist 154 Niedergelassene aus, meldet aber nur **Kleintiere = 5**, alle übrigen Kategorien 0. Faktisch nicht gemeldet. Die publizierte Bundessumme rechnet mit diesen 5. | so publiziert übernommen, `quality` markiert |
| **2019–2025** | HB, MV, HH, ST | dauerhaft/zeitweise „k. A." im Block Niedergelassene: Bremen 2019–2025 durchgängig; M.-Vorpommern 2019–2023; Hamburg 2022–2023; Sachsen-Anhalt 2021–2023 | `value: null`, `quality: "k. A."` |
| **2023** | Bund | **Interner Widerspruch der Quelle:** Tab. 1 weist 11.437 Niedergelassene aus, die Kopfzeile von Tab. 2 dagegen 11.535 (auch einzelne Kammern weichen ab, z. B. Hessen 921 in Tab. 1 vs. 937 in Tab. 2). Die hier ausgewiesenen Tierarten-Werte stammen aus **Tab. 2** und sind gegen die Summenspalte von Tab. 2 geprüft (stimmt). | nicht aufgelöst, dokumentiert |
| **2024** | Bund | **Prüfsumme verfehlt:** Kammerspalten 5.953 gegen gedruckte Summe 6.241 bei Kleintieren (**−288**), 732 gegen 741 bei Nutztieren (**−9**), 2.165 gegen 2.326 bei „Nutztiere und Kleintiere" (**−161**). Ebenfalls am gerenderten PDF nachgeprüft. Zusätzlich sind in Tab. 2 2024 einzelne Zellen **leer** (nicht „k. A."), u. a. Bayern und Nordrhein in der Zeile „Nutztiere, Pferde und Kleintiere". | beide Werte ausgewiesen, Jahr markiert |

---

## 6. Ehrliche Fehlliste

| Was fehlt | Jahre / Kammern | Grund |
|---|---|---|
| alle drei Kategorien, alle 17 Kammern | **2005** | in der Statistik 2005 nicht publiziert (verkürzte Tab. 1) |
| alle drei Kategorien nach Kammer | **1990–2001** | die BTK publiziert Kammerdaten erst ab Stand 31.12.2002 |
| Bremen | **2019, 2020, 2021, 2022, 2023, 2024, 2025** | „k. A." |
| Mecklenburg-Vorpommern | **2019, 2020, 2021, 2022, 2023** | „k. A." (ab 2024 wieder gemeldet) |
| Sachsen-Anhalt | **2021, 2022, 2023** | „k. A." |
| Hamburg | **2022, 2023** | „k. A." (2021 formal gemeldet, aber unbrauchbar: s. o.) |
| „Kleintiere" Baden-Württemberg | **2006** | mit 0 gemeldet – unbrauchbar, nicht fehlend |
| separate Pferde-Reihe vor 2019 | 2002–2018 | Pferde stecken systematisch in „Großtiere"/„Nutztiere" |

Alle übrigen Zellen – **2002–2004 und 2006–2018 jeweils alle 17 Kammern, 2019–2025 alle Kammern
außer den oben genannten** – sind vollständig vorhanden und stimmen mit der publizierten Summe überein
(Ausnahme: die Summenspalte 2019 und 2024, siehe oben).

---

## 7. Datei

* `ds10-kleintiere-bundesland.json` – Long-Format, 1.173 Zeilen
  (23 Jahre × 17 Kammern × 3 Metriken), Metriken
  `Kleintiere nach Kammerbereich`, `Nutztiere nach Kammerbereich`,
  `Nutztiere und Kleintiere nach Kammerbereich`.
  Jede Zeile trägt `source` (Datei + Tabelle), `quality` und zusätzlich `label_original`
  (die im jeweiligen Jahrgang gedruckte Zeilenbeschriftung). `value: null` = „k. A." in der Quelle.

**Attribution (Footer):** „Quelle: Bundestierärztekammer, Statistik Tierärzteschaft
(Deutsches Tierärzteblatt), Jahrgänge 2002–2025; Angaben je Landes-/Tierärztekammer,
Spalte ‚gesamt'. 2005 nicht publiziert."
