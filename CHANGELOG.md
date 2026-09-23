# Changelog

Alle nennenswerten Änderungen dieses Projekts. Format lose nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## [Unveröffentlicht]

### Neu

- **Choroplethenkarte der Bundesländer** als dritter Diagrammtyp. Wie der Line-Renderer eine reine Funktion der Zeit (`renderAt`), damit der Frame-für-Frame-Export reproduzierbar bleibt; zwischen zwei Jahren wird interpoliert, die Farbe wandert also weich. Feste Farbdomäne über den gesamten Zeitraum, Legende und eine mitlaufende Rangliste mit den Werten des aktuellen Jahres.
- Geometrie wird vorab aus `data/geo/deu.topo.json` erzeugt (`scripts/build-geo.mjs`) und mitgeliefert – zur Laufzeit wird nichts nachgeladen und keine TopoJSON-Bibliothek gebraucht.

### Geändert

- Impressum und Datenschutz sind statische Seiten mit `noindex, follow` statt Hash-Routen, aus einer JSON-Quelle erzeugt und aus der Sitemap genommen.
- `check:launch` läuft gegen den Build und prüft zusätzlich Canonical, Sitemap gegen noindex in beiden Richtungen, Favicon-Größen und ob Datenschutztext und tatsächliche Einbindung zusammenpassen.
- `companyName` ist leer: „Petleo" allein wäre nach § 5 DDG unvollständig, weil die Rechtsform fehlt.

### Behoben

- Die Legende der Weltkarte lag über ihren eigenen Farbkästchen. Der Layouttest hatte das übersehen, weil er nur Text gegen Text prüfte — er vergleicht jetzt auch Text gegen gefüllte Flächen und fand damit sofort zwei weitere Fehler im Hochformat.

- **Alle Seiten trugen dasselbe Canonical** und zeigten auf die Startseite. Beide Artikel wären damit aus dem Index gefallen. Canonical wird jetzt je Seite gesetzt, Seiten mit noindex bekommen keines.

- Die Karte animierte in der Vorschau nicht. Der Renderer brachte keine eigene Abspielschleife mit; die Vorschau ruft aber nur `play()` und verlässt sich darauf, dass der Renderer selbst läuft und Datumswechsel meldet. Im Export fiel das nicht auf, weil der die Zeit selbst stellt.
- Die Exportlänge wich von der Anzeige ab: Bei Datensätzen mit Jahreslücken lieferte der Export 53,8 s, während die Oberfläche 46,0 s versprach.

## [0.1.0] – 2026-09-17

Erste Veröffentlichung.

### Enthalten

- **Studio:** Bar Chart Race (racing-bars) und Line Chart Race (eigener D3-Renderer, optional zweite Y-Achse), vier Formate (16:9, 1:1, 4:5, 9:16) mit formatabhängigem Layout und Live-Vorschau in Zielauflösung.
- **Daten:** CSV/XLSX-Upload oder editierbare Tabelle, Wide- und Long-Format-Erkennung, Datenprüfung, Lücken interpolieren oder fortschreiben.
- **Export:** deterministisch Frame für Frame über WebCodecs `VideoEncoder` (H.264) und `mp4-muxer` im Web Worker, Fallback `ffmpeg.wasm`, dazu GIF und PNG. Standbild am Anfang und Ende ist in Datei und Gesamtlänge enthalten.
- **Zehn Beispiel-Datensätze** aus der deutschen Tiermedizin mit recherchierten Zahlen, Quelle, Dateninfo und offengelegten Lücken. Jeder trägt Recherche- und Prüfdatum.
- **Redaktionsplan** mit 30 aufeinander aufbauenden Posts unter `#redaktionsplan`, verlinkt mit den Datensätzen und nach Veröffentlichung mit den LinkedIn-Beiträgen.
- **Artikel** als eigene statische Seiten mit echter URL und strukturierten Daten: „Wer betreibt die Tierarztpraxen in Deutschland?" und „Woher die Zahlen kommen".
- **Recht und Messung:** Impressum und Datenschutz aus einer Quelle, Cookie-Einwilligung nach § 25 TDDDG (Skript erst nach Klick), Google Analytics und Cloudflare Web Analytics optional, Search Console und Sitemap.
- **Prüfskripte:** `npm run check:launch` (Blocker vor dem Livegang) und `npm run check:content` (dünne, doppelte, unverlinkte Inhalte).

### Bekannte Einschränkungen

- Die Anschrift im Impressum fehlt noch; bis dahin meldet `check:launch` einen Blocker und die Seite gehört nicht in den öffentlichen Betrieb.
- Belegte und geschätzte Werte sind in den Daten markiert, im Diagramm aber noch nicht visuell unterscheidbar.
- Der Browser-Layouttest (`scripts/browser-overlap-check.js`) braucht ein sichtbares Browser-Fenster; in einem versteckten Tab ist `requestAnimationFrame` gedrosselt und das Diagramm rendert nicht nach.
