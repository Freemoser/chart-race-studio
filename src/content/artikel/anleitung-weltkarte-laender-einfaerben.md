---
art: anleitung
slug: weltkarte-laender-einfaerben-animieren
titel: Weltkarte nach Daten einfärben und animieren – kostenlos
beschreibung: Eine Excel-Tabelle mit Jahr, Ländern und Werten reicht: So wird daraus eine animierte Weltkarte als Video. Mit Vorlage, Datenstandard und Screenshots.
frage: Wie kann ich eine Weltkarte nach Daten einfärben und animieren?
suchbegriffe: weltkarte länder einfärben, weltkarte länder einfärben kostenlos, animierte karte erstellen kostenlos, weltkarte excel länder einfärben, bar chart race erstellen
stand: 2026-09-24
bereit: ja
---
Eine animierte Weltkarte braucht nur **eine Tabelle: in der ersten Spalte das Jahr, in jeder weiteren Spalte ein Land**, in den Zellen die Werte. Das [Studio](../) färbt daraus jedes Land nach seinem Wert ein, lässt die Jahre ablaufen und exportiert das Ergebnis als MP4-Video – kostenlos, ohne Anmeldung und vollständig im Browser, die Daten verlassen den Rechner nicht.

## Das Wichtigste in Kürze

- **Eine Zeile je Jahr, eine Spalte je Land.** 27 Jahre und 197 Länder sind kein Problem, sechs Länder und fünf Jahre auch nicht.
- **Ländernamen dürfen deutsch, englisch oder als ISO-Code stehen:** Deutschland, Germany und DE färben dieselbe Fläche.
- **Spalten, die mit „Summe:“ beginnen, landen nicht auf der Karte**, sondern als kleine Linie mit dem aktuellen Wert neben ihr – etwa „Summe: Hunde (Mio.)“.
- **Für Anteile um einen Kipppunkt** (zum Beispiel 50 Prozent) teilt die Karte die Länder in fünf Stufen ein und zählt, wie viele in jeder Stufe liegen.
- Vorlagen zum Herunterladen: [Weltkarte](vorlagen/vorlage-weltkarte.xlsx), [Bundesländer](vorlagen/vorlage-bundeslaender.xlsx), [Zeitreihe](vorlagen/vorlage-zeitreihe.xlsx) – jeweils auch als CSV.

## Schritt für Schritt

### 1. Die Tabelle anlegen

![Die Vorlage Weltkarte: Jahr in der ersten Spalte, sechs Länder in gemischter Schreibweise, zwei Summenspalten rechts](anleitung/01-tabelle.png)

In Excel, Numbers, LibreOffice oder Google Tabellen: oben die Spaltenköpfe, darunter eine Zeile je Jahr. In die Zellen gehört nur die Zahl, die Einheit steht im Spaltenkopf in Klammern. Eine leere Zelle bedeutet „nicht erhoben“ und wird überbrückt, eine 0 wird als echter Wert gezeichnet. Keine Formeln, keine verbundenen Zellen, keine Summenzeile unten.

Die Vorlage oben zeigt den Hundeanteil an allen Hunden und Katzen für sechs Länder, und rechts die weltweiten Summen. Dass dort „Deutschland“, „USA“ und „CN“ nebeneinanderstehen, ist Absicht: Alle drei Schreibweisen werden erkannt.

### 2. Die Datei ins Studio laden

![Spaltenzuordnung nach dem Laden: Zeitspalte „Jahr“, acht Spalten erkannt, 27 Perioden von 2000 bis 2026](anleitung/02-datei-laden.png)

Im [Studio](../) unter **Daten → Eigene Daten** die Datei hineinziehen oder „Datei wählen“ klicken. Gelesen werden Excel (`.xlsx`, `.xls`), LibreOffice (`.ods`) und CSV mit Komma, Semikolon oder Tabulator als Trennzeichen. Das Studio erkennt die Zeitspalte selbst und meldet, wie viele Jahre und Spalten es gefunden hat.

### 3. Prüfen, ob jedes Land erkannt wurde

![Kartenabgleich: Weltkarte erkannt, sechs von sechs Ländern zugeordnet, zwei Summenspalten als Mini-Linie](anleitung/03-kartenabgleich.png)

Unter **Gestaltung** als Diagrammtyp **Karte** wählen. Im Reiter Daten erscheint dann der **Kartenabgleich**: Er zeigt, welche Karte erkannt wurde – Welt oder deutsche Bundesländer – und welche Spalten keiner Fläche zugeordnet werden konnten. Steht dort ein Land, ist entweder der Name unbekannt oder das Land zu klein für die Karte, etwa Malta oder Singapur. Kleinstaaten zählen trotzdem in der Stufenzählung mit.

### 4. Farbstufen und Beschriftung einstellen

![Gestaltung der Karte: Kipppunkt 50, unten „Katzen“, oben „Hunde“, Überschrift „Länder je Stufe“](anleitung/04-gestaltung.png)

Bei Anteilen, bei denen die Seite die Aussage ist, **„Farbstufen um einen Kipppunkt“** einschalten, den Kipppunkt setzen und beide Seiten benennen. Die Karte zeigt dann fünf Stufen: deutlich und leicht darüber, etwa gleich, leicht und deutlich darunter. Bei allen anderen Werten – Einwohner, Tierärzte, Umsatz – bleibt der Schalter aus. Dann färbt ein stufenloser Verlauf ab 0, und das Seitenpanel zeigt eine Rangliste. Titel, Untertitel und Quelle stehen unter **Gestaltung → Texte**.

### 5. Abspielen und als Video exportieren

![Das fertige Bild für 2026 im Format 1:1: Karte, Länder je Stufe und die weltweite Summe als Mini-Linie](anleitung/05-ergebnis.png)

Mit der Wiedergabe unter der Vorschau lässt sich jedes Jahr ansteuern. Unter **Export** wird das Video im gewählten Format erzeugt: 16:9 für YouTube und Präsentationen, 1:1 oder 4:5 für LinkedIn- und Instagram-Posts, 9:16 für Stories und Reels. Die Farbskala bleibt über alle Jahre fest, damit eine Veränderung auch als Veränderung zu sehen ist.

## Der Datenstandard auf einen Blick

| Was | Regel | Beispiel |
|---|---|---|
| Erste Spalte | Zeit, eine Zeile je Zeitpunkt | 2024 · 2024-03 · Q1 2024 · 31.12.2024 |
| Weitere Spalten | ein Land oder Bundesland je Spalte | Deutschland · Germany · DE · Nordrhein-Westfalen |
| Zellen | nur Zahlen, Komma oder Punkt als Dezimaltrenner | 42,9 · 42.9 · 12.125 |
| Einheit | im Spaltenkopf in Klammern | Hunde (Mio.) · Anteil (%) |
| Leere Zelle | nicht erhoben, wird überbrückt | – |
| Summenspalte | Kopf beginnt mit „Summe:“, erscheint als Mini-Linie | Summe: Katzen (Mio.) |
| Kipppunkt | in der Gestaltung, nicht in der Tabelle | 50 bei Prozentanteilen |

Die Summe steht bewusst in der Tabelle und wird nicht aus den Ländern errechnet: Anteile lassen sich nicht addieren, und wo Länder fehlen, wäre eine errechnete Summe still zu klein. Wer die Summe liefert, weiß auch, woher sie kommt.

## Was die Karte nicht kann

- **Keine Regionen unterhalb der Bundesländer.** Landkreise, Städte oder Postleitzahlen erkennt das Studio nicht.
- **Kleinstaaten ohne Fläche.** Auf dieser Kartenauflösung haben rund 30 Staaten wie Malta, Singapur oder Monaco keine eigene Fläche. Sie zählen in Stufen und Summen, sind aber nicht zu sehen.
- **Ein Wert je Land und Jahr.** Wer zwei Größen vergleichen will, etwa Hunde und Katzen getrennt, braucht zwei Karten oder einen Anteil.
- **Keine Projektion nach Wahl.** Die Weltkarte nutzt die Natural-Earth-Projektion, einen Kompromiss zwischen Flächen- und Formtreue, die deutsche Karte Mercator.

## Häufige Fragen

### Kann ich deutsche Ländernamen verwenden?

Ja. Ländernamen werden auf Deutsch, Englisch und als zweistelliger ISO-Code erkannt, Groß- und Kleinschreibung und Akzente spielen keine Rolle. Gängige Varianten wie USA, DR Kongo, Türkiye oder Czech Republic sind hinterlegt.

### Warum bleibt ein Land auf der Karte grau?

Entweder steht für das Land in diesem Jahr kein Wert in der Tabelle, oder der Name wurde nicht erkannt. Welche Spalten keiner Fläche zugeordnet sind, zeigt der Kartenabgleich im Reiter Daten.

### Kann ich eine Karte der deutschen Bundesländer erstellen?

Ja, mit denselben Schritten. Stehen in den Spaltenköpfen die 16 Bundesländer mit ihrem amtlichen Namen, zeichnet das Studio automatisch die Deutschlandkarte. Eine passende Vorlage gibt es als [Excel-Datei](vorlagen/vorlage-bundeslaender.xlsx).

### Werden meine Daten hochgeladen?

Nein. Das Studio läuft vollständig im Browser, auch der Videoexport. Die Tabelle wird auf dem eigenen Rechner gelesen und verlässt ihn nicht.

### Was kostet das?

Nichts. Das Studio ist kostenlos, ohne Anmeldung nutzbar und Open Source unter der MIT-Lizenz.

## Quelle und Methode

Die Beispieldaten der Vorlage stammen aus dem Datensatz „Hund oder Katze – was ist wo häufiger?“ dieser Seite: Hundeanteil an Hunden und Katzen je Land aus FEDIAF, Europäischer Kommission, AVMA, Japan Pet Food Association und weiteren nationalen Quellen, für Länder ohne eigene Erhebung modelliert; die Summen sind Modellsummen über 197 Länder. Einzelheiten unter [Datenherkunft](../artikel/datenherkunft.html). Die Kartengeometrie stammt aus Natural Earth (gemeinfrei). Die Screenshots sind mit dem aktuellen Studio erzeugt.
