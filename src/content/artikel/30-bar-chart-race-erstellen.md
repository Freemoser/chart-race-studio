---
post: 30
slug: bar-chart-race-erstellen
titel: Bar Chart Race erstellen: kostenlos im Browser, ohne Upload
beschreibung: Animierte Balken-, Linien- und Kartenrennen aus einer Tabelle, als MP4 in vier Formaten. Läuft im Browser, Open Source unter MIT, 12 Beispieldatensätze.
frage: Wie erstellt man ein Bar Chart Race kostenlos?
suchbegriffe: bar chart race erstellen, line chart race, animiertes diagramm video, chart race mp4
stand: 2026-09-23
bereit: nein
---
Die Videos dieser Reihe sind mit **Chart Race Studio** entstanden, einem selbstgebauten Werkzeug, das aus einer Tabelle animierte Balken-, Linien- und Kartenrennen macht und sie als **MP4 mit 30 Bildern pro Sekunde** in **vier Formaten** exportiert. Es läuft vollständig im Browser, braucht kein Konto und steht als Open Source unter der **MIT-Lizenz**.

## Das Wichtigste in Kürze

- Drei Diagrammtypen: Bar Chart Race, Line Chart Race und eine animierte Karte, wahlweise der Bundesländer oder der Welt.
- Vier Formate: 16:9 (1920 × 1080), 1:1 (1080 × 1080), 4:5 (1080 × 1350) und 9:16 (1080 × 1920).
- Daten aus Tabellen in sieben Dateiendungen: CSV, TSV, TXT, XLSX, XLS, XLSM und ODS. Export als MP4, GIF oder PNG.
- Zwölf Beispieldatensätze aus der Tiermedizin und zu Haustieren, jeder mit Quelle, Prüfdatum und Datenkunde (Stand September 2026).
- Voreinstellung: 30 Sekunden Animation, dazu 1 Sekunde Standbild am Anfang und 15 Sekunden am Ende.

## Was das Werkzeug macht

Der Weg vom Datensatz zum Video hat vier Schritte:

1. **Daten laden.** Eine Tabelle hochladen oder direkt im Werkzeug bearbeiten. Ob die Jahre in Zeilen oder in einer eigenen Spalte stehen, erkennt es selbst; die Zuordnung lässt sich korrigieren. Lücken werden auf Wunsch interpoliert oder mit dem letzten Wert fortgeschrieben.
2. **Diagramm wählen.** Balken, Linie oder Karte, umschaltbar ohne erneuten Upload. Für Reihen in anderer Einheit gibt es im Liniendiagramm eine zweite Achse rechts.
3. **Gestalten.** Titel, Untertitel und Quelle, Farben je Kategorie, Bilder oder Flaggen, Zahl der gezeigten Kategorien, Zahlen- und Datumsformat, hell oder dunkel. Ein Wasserzeichen mit Name oder Logo ist voreingestellt und wird ins Video eingebrannt.
4. **Exportieren.** Die Vorschau zeigt das Video in der Zielauflösung und nennt die Gesamtlänge vorab.

Die Quelle steht dabei im Bild, nicht nur in der Bildunterschrift. Wer ein Video weiterleitet, leitet die Herkunft der Zahlen mit.

## Warum keine Daten das Gerät verlassen

Es gibt keinen Server, der Tabellen entgegennimmt. Eingelesen, gerechnet und als Video kodiert wird im Browser, auf dem eigenen Rechner. Eine hochgeladene Datei bleibt dort.

Eine Ausnahme betrifft nur Programmcode, keine Daten: Browser ohne die Schnittstelle WebCodecs laden einmalig einen Ersatz-Encoder von rund 30 MB aus einem öffentlichen Verzeichnis nach. Chrome, Edge, Safari ab 16.4 und Firefox ab 130 brauchen ihn nicht. Ob und wie die Seite selbst Besuche misst, steht in der [Datenschutzerklärung](../datenschutz.html).

## Warum ein Video Bild für Bild entsteht

Animierte Diagramme im Browser laufen normalerweise in Echtzeit. Ein langsamer Rechner ruckelt dann, und das Video ruckelt mit. Das Werkzeug rendert den Export deshalb getrennt von der Vorschau und stellt die Zeit für jedes Bild um genau eine Dreißigstelsekunde weiter. Jedes Bild zeigt damit exakt den richtigen Zwischenzustand, unabhängig davon, wie schnell der Rechner ist. Dasselbe Datenblatt ergibt dasselbe Video.

## Was aus der Reihe im Werkzeug steckt

Von den 29 Beiträgen vor diesem stützen sich 23 auf einen der Beispieldatensätze (berechnet aus dem Redaktionsplan). Die übrigen sechs kamen ohne eigenes Video aus, weil eine Reihe fehlt oder, wie beim Beitrag [Was die Statistik nicht sagt](statistik-tieraerzte-grenzen.html), ein Text besser passt. Jeder Datensatz lässt sich im Werkzeug öffnen, anders einstellen und neu exportieren. Woher jede Zahl stammt, steht in der [Datenherkunft](../artikel/datenherkunft.html).

**Offen:** Der Aufhänger im Redaktionsplan spricht von „allen 29 Videos“. Nach dem Plan sind es 23. Vor der Veröffentlichung den tatsächlichen Stand zählen.

## Was die Zahl nicht sagt

- **Zwischenbilder sind keine Daten.** Zwischen zwei Jahren rechnet das Werkzeug fließende Übergänge. Ein Balken, der sich im Video zur Jahresmitte bewegt, zeigt keinen gemessenen Halbjahreswert.
- **Aufgefüllte Lücken sind Annahmen.** Wer fehlende Jahre interpolieren lässt, bekommt eine glatte Linie, wo die Quelle schweigt. Die Datenkunde der Beispieldatensätze nennt diese Stellen; bei eigenen Daten liegt das beim Nutzer.
- **Ein Rennen betont Rangwechsel.** Überholvorgänge wirken im Video dramatischer als in einer Tabelle. Ob ein Wechsel wichtig ist, sagt die Animation nicht.
- **Zwölf Datensätze sind der Stand von September 2026.** Die Zahl kann sich bis zur Veröffentlichung ändern. Die Weltkarte ist als Beispieldaten markiert, weil für die meisten Länder Modellwerte stehen.

## Häufige Fragen

### Wie erstellt man ein Bar Chart Race?

Man braucht eine Tabelle mit einer Zeile je Zeitpunkt und einer Spalte je Kategorie oder eine lange Tabelle mit Zeit, Kategorie und Wert. Die lädt man als CSV oder Excel-Datei ins Werkzeug, wählt Diagrammtyp und Format und exportiert das Video als MP4.

### Werden meine Daten hochgeladen?

Nein. Tabellen werden im Browser verarbeitet, das Video entsteht auf dem eigenen Gerät. Es gibt kein Konto und keinen Server, der Daten annimmt.

## Quelle und Methode

Beschreibung nach Quellcode und Projektdokumentation, Stand 23.09.2026. Lizenz: MIT. Die Balkenanimation beruht auf der Bibliothek racing-bars von Hatem Hosny, ebenfalls MIT; Linien- und Kartenrennen sind eigene Renderer auf Basis von D3. Der MP4-Export nutzt WebCodecs mit H.264. Gezählt sind die Beispieldatensätze im Werkzeug und die Beiträge mit Datensatz im Redaktionsplan.

**Offen:** Adresse der Seite und Link zum Quellcode eintragen, sobald beides öffentlich ist. Den Namen „Chart Race Studio“ bestätigen, falls die Marke bis dahin wechselt.
