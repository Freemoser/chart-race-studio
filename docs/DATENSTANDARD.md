# Datenstandard „Tiermedizin in Zahlen“ 1.0

**Stand:** 24.09.2026 · Gilt für alle Tabellen, die ins Studio geladen werden, und für alle eigenen Datensätze
unter `src/samples/`. Öffentliche Fassung für Leserinnen und Leser: Artikel „Weltkarte nach Daten einfärben und
animieren“ (`src/content/artikel/anleitung-weltkarte-laender-einfaerben.md`). Vorlagen: `public/vorlagen/`
(erzeugt mit `scripts/build-vorlagen.mjs`).

Der Standard ist bewusst klein. Jede Regel hier ist im Code umgesetzt und wird im Studio geprüft – steht
etwas hier, das der Code nicht tut, ist das ein Fehler in einem von beiden.

## 1. Form der Tabelle

| Regel | Beispiel | Umgesetzt in |
|---|---|---|
| **Eine Tabelle, erste Zeile Spaltenköpfe.** Excel: nur das erste Blatt zählt | `Jahr, Deutschland, Frankreich, …` | `src/lib/data/parse.ts` |
| **Erste Spalte ist die Zeit**, eine Zeile je Zeitpunkt | `2024`, `2024-03`, `03.2024`, `Q1 2024`, `31.12.2024` | `src/lib/data/dates.ts` |
| **Jede weitere Spalte ist eine Reihe** (Land, Gruppe, Kategorie) | `Praxisinhaber:innen` | `src/lib/data/detect.ts` |
| Alternativ lang: drei Spalten Zeit, Name, Wert | `2024, Bayern, 8938` | wird automatisch erkannt |
| Dateiformate | `.xlsx`, `.xls`, `.ods`, `.csv`, `.tsv` | CSV-Trennzeichen Komma, Semikolon, Tab oder Strich werden erkannt |

**Unsere eigenen Datensätze** liefern wir als CSV mit **Komma als Trennzeichen und Punkt als Dezimaltrenner**
aus – das lesen Tabellenprogramme, Skripte und Antwortmaschinen gleichermaßen. Für Menschen, die in Excel
arbeiten, gibt es jede Vorlage zusätzlich als `.xlsx`.

## 2. Zahlen

- **Nur die Zahl in die Zelle.** `12125`, `12.125`, `12,5` und `42.9` werden alle richtig gelesen; `€`, `%`,
  Leerzeichen und Apostrophe als Tausendertrenner werden entfernt.
- **Die Einheit gehört in den Spaltenkopf, in Klammern:** `Hunde (Mio.)`, `Anteil (%)`. Bei Summenspalten
  wird sie so direkt an den Wert geschrieben.
- **Leer heißt „nicht erhoben“, nicht null.** Eine leere Zelle wird je nach Einstellung überbrückt oder
  ausgelassen; eine `0` wird als echter Wert gezeichnet.
- **Keine Formeln, keine verbundenen Zellen, keine Summenzeile unten.** Summen über die Zeit rechnet das
  Studio nicht; Summen über die Reihen gehören als eigene Spalte in die Tabelle (Abschnitt 4).

## 3. Karten

- **Spaltenköpfe sind Länder oder Bundesländer.** Welche Karte gezeichnet wird, entscheidet die Mehrheit der
  Treffer: Wer mehr Bundesländer als Staaten trifft, bekommt Deutschland.
- **Ländernamen dürfen deutsch, englisch oder als ISO-Code (zwei Buchstaben) stehen:** `Deutschland`,
  `Germany` und `DE` färben dieselbe Fläche. Groß- und Kleinschreibung, Akzente und Bindestriche spielen
  keine Rolle. Gängige Varianten sind hinterlegt (`USA`, `DR Kongo`, `Türkiye`, `Czech Republic` …).
  Tabelle: `src/assets/laendernamen.json`, erzeugt von `scripts/build-laendernamen.mjs`.
- **Bundesländer mit ihrem amtlichen Namen:** `Nordrhein-Westfalen`, `Baden-Württemberg`. Kammerbereiche
  wie Nordrhein und Westfalen-Lippe vorher zusammenfassen.
- **Kleinstaaten** (Malta, Singapur, Monaco …) haben auf der Weltkarte keine eigene Fläche. Sie zählen in der
  Stufenzählung und in Summen trotzdem mit.
- Das Studio zeigt unter **„Kartenabgleich“**, welche Spalten keiner Fläche zugeordnet werden konnten.
  Dieselbe Funktion (`ordneZu` in `src/lib/chart/geo.ts`) entscheidet auch, was die Karte zeichnet.

## 4. Summenspalten

- **Eine Spalte, deren Kopf mit `Summe:` beginnt, ist keine Fläche**, sondern erscheint als Mini-Linie unten
  im Seitenpanel, mit dem aktuellen Wert. Gleichwertig: `Gesamt:`, `Total:`.
- Aufbau: `Summe: <Name> (<Einheit>)`, zum Beispiel `Summe: Hunde (Mio.)`. Angezeigt wird „Hunde“ mit
  „521 Mio.“.
- **Die Summe steht in der Tabelle, sie wird nicht gerechnet.** Eine Summe über die Spalten einer Karte ist
  selten richtig: Anteile lassen sich nicht addieren, und Kleinstaaten oder fehlende Länder würden stillschweigend
  fehlen. Wer die Summe liefert, sagt auch, wie sie entstanden ist.
- Höchstens zwei bis drei Summenspalten; mehr passt nicht lesbar in das Panel.
- Farben: Ein Name mit „Hund“ wird orange, mit „Katz“ türkis gezeichnet – passend zur Karte. Andere Namen
  bekommen ihre Farbe aus der Palette.

## 5. Anteile mit Kipppunkt

Für Anteile, bei denen die Seite die Aussage ist (Hundeanteil über oder unter 50 Prozent), unter
**Gestaltung → Farbstufen um einen Kipppunkt** den Kipppunkt setzen und beide Seiten benennen, etwa „Katzen“
und „Hunde“. Die Karte zeigt dann fünf Stufen (±3 und ±10 Punkte um den Kipppunkt), und das Panel zählt die
Länder je Stufe statt einer Rangliste. Ohne Namen heißen die Stufen neutral „darunter“ und „darüber“ – eine
fremde Tabelle wird nie mit „mehr Hunde“ beschriftet.

## 6. Was zu jedem eigenen Datensatz dazugehört

Für die Datensätze unter `src/samples/` zusätzlich, damit jede Zahl belegbar bleibt:

1. **Quelle je Wert** in der Rohdatei unter `data/raw/`, mit Markierung belegt / geschätzt / interpoliert.
2. **Dateninfo** (`dataInfo`): was gezählt wird und was nicht, Lücken, Methodenbrüche, Gegenproben.
3. **Datum** der Erstellung und der letzten Prüfung (`erstellt`, `geprueft`).
4. **`isExample: true`**, wenn ein wesentlicher Teil modelliert ist.
5. Ein Eintrag in `docs/DATASETS.md`.

## Änderungen am Standard

Neue Regel → erst hier eintragen, dann im Code umsetzen, dann die Vorlagen neu erzeugen
(`node scripts/build-vorlagen.mjs`) und die Anleitung prüfen. Die Versionsnummer steigt, sobald eine Tabelle,
die vorher galt, nicht mehr gilt.
