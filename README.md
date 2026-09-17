# Chart Race Studio

Animierte **Bar Chart Races** und **Line Chart Races** aus eigenen Daten erstellen und direkt im Browser als **MP4** (außerdem GIF und PNG) für Social Media exportieren. Läuft komplett client-seitig auf GitHub Pages, ohne Login, ohne Backend, ohne Tracking.

Personal-Branding-Werkzeug von **Thomas Freimoser**. Diagramm-Animation auf Basis von [racing-bars](https://github.com/hatemhosny/racing-bars) (MIT) von Hatem Hosny.

## Funktionen

- **Daten:** CSV/XLSX-Upload oder editierbare Tabelle; Wide- und Long-Format werden erkannt (manuell korrigierbar); Datenprüfung mit klaren Hinweisen; Lücken interpolieren oder letzten Wert fortschreiben.
- **Chart-Typen:** Bar Chart Race (racing-bars) und Line Chart Race (eigener D3-Renderer, optional mit zweiter Y-Achse rechts für Reihen in anderer Einheit), umschaltbar ohne erneuten Upload.
- **Formate:** 16:9 (1920×1080), 1:1 (1080×1080), 4:5 (1080×1350), 9:16 (1080×1920) mit formatabhängigem Layout und Live-Vorschau in Zielauflösung.
- **Einstellungen:** Animationsdauer (Sekunden) oder Dauer je Zeitschritt, voreingestellt sind 30 s Animation plus 1 s Standbild am Anfang und 15 s am Ende, Zwischenschritte, **Standbild am Anfang und Ende** (in Datei und Gesamtlänge enthalten), Titel/Untertitel/Quelle, Farben je Kategorie plus Paletten, Bilder/Flaggen je Kategorie, Top N, **Labels im Balken oder außerhalb links mit automatisch reservierter Breite**, Zahlenformat, Datumsformat, Hell/Dunkel.
- **Wasserzeichen:** Name/Handle und optional Logo, standardmäßig aktiv, Position/Deckkraft/Größe einstellbar, wird eingebrannt.
- **Export:** deterministisch Frame für Frame (30 fps) über WebCodecs `VideoEncoder` (H.264) + `mp4-muxer` in einem Web Worker; Fallback `ffmpeg.wasm`; Fortschritt und Abbrechen; GIF (gifenc) und PNG.
- **Beispiel-Datensätze** mit recherchierten, realen Zahlen aus der Tiermedizin: Tierärzteschaft (BTK) national und je Bundesland, Heimtierbestand (IVH/ZZF), VDH-Welpenstatistik, Rinderbestand (Destatis). Details und Quellen: [`docs/DATASETS.md`](docs/DATASETS.md).

## Schnellstart

```bash
npm install
npm run dev
```

Dann <http://localhost:5173> öffnen. Weitere Skripte:

```bash
npm test          # Unit-Tests (Vitest, einmalig)
npm run lint      # oxlint
npm run build     # Produktions-Build nach dist/
npm run preview   # dist/ lokal ansehen
```

Zum Testen des Fallback-Encoders die App mit `?encoder=ffmpeg` in der URL öffnen.

Voraussetzungen: Node.js 20 oder neuer. Für den MP4-Export im Browser ist WebCodecs nötig (Chrome, Edge, Safari 16.4+, Firefox 130+); ohne WebCodecs lädt die App einmalig `ffmpeg.wasm` (ca. 30 MB) von jsDelivr.

## Redaktionsplan

Die Seite hat neben dem Studio eine zweite Ansicht: den **Redaktionsplan** unter `#redaktionsplan`, erreichbar über den Umschalter oben rechts. Dort stehen 30 aufeinander aufbauende LinkedIn-Posts mit Aufhänger, Kernzahlen, dem zugehörigen Datensatz und dem Datenstatus (`belegt`, `teilweise`, `offen`). Ein Klick auf „Datensatz im Studio öffnen“ lädt den passenden Datensatz und Diagrammtyp.

- Inhalte: [`src/content/roadmap.ts`](src/content/roadmap.ts) – hier nach der Veröffentlichung `linkedInUrl` und `publishedOn` eintragen, dann verlinkt die Ansicht den Beitrag.
- Angaben zur Seite und Datenschutztext: [`src/content/site.ts`](src/content/site.ts). **Das Impressum ist bewusst leer** und muss vor dem öffentlichen Betrieb ausgefüllt werden; solange `impressum.anschrift` leer ist, blendet die Seite den Block aus.

## Artikel und SEO

Die Studio-Oberfläche ist eine Single-Page-Anwendung mit Hash-Routen (`#redaktionsplan`, `#impressum`). **Fragmente sind für Suchmaschinen keine eigenen Seiten**, und viele Crawler von Antwort-Maschinen führen kein JavaScript aus. Inhalte, die gefunden werden sollen, gehören deshalb in eigene statische HTML-Seiten unter `artikel/`:

- Inhalt steht im Quelltext, kein JavaScript nötig
- eigenes schlankes Stylesheet (`src/article.css`), unabhängig vom Utility-Scanner
- JSON-LD mit `Article` und `FAQPage` für Antwort-Maschinen
- als Build-Eingang in [`vite.config.ts`](vite.config.ts) eintragen, dann landet die Seite auch in der Sitemap

Vorhanden:

- [`artikel/tierarztketten-deutschland.html`](artikel/tierarztketten-deutschland.html) – wer die Tierarztpraxen betreibt
- [`artikel/datenherkunft.html`](artikel/datenherkunft.html) – Quelle, Annahmen und Stand je Beispiel-Datensatz, mit Anker je Datensatz-ID

Jeder Datensatz trägt `erstellt` und `geprueft` (ISO-Datum). Die Oberfläche zeigt beides unter „Dateninfo“, der Datenherkunft-Artikel wiederholt es je Abschnitt. Damit lässt sich in einem Jahr sauber sagen, was neu geprüft wurde und was sich seitdem geändert hat.

## Inhaltsprüfung

```bash
npm run check:content
```

Findet dünne, doppelte und unverlinkte Inhalte: Posts mit zu wenig Kennzahlen, Datensätze mit zu knapper Kachel oder zu wenig Datenkunde, Artikel unter 600 Wörtern oder ohne strukturierte Daten, Beiträge, auf die kein anderer verweist, und Platzhalter im Text. Trennt Mängel von Hinweisen, Exit-Code 1 bei Mängeln.

## Deployment auf GitHub Pages

1. Repository auf GitHub anlegen und Code pushen (Branch `main`).
2. In den Repository-Einstellungen unter **Pages** als Source **GitHub Actions** wählen.
3. Der Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) baut bei jedem Push auf `main` und deployt nach `https://<user>.github.io/<repo>/`. Der Basis-Pfad wird automatisch aus dem Repo-Namen gesetzt (`BASE_PATH`).
4. Für eine eigene Domain oder ein `<user>.github.io`-Repository im Workflow `BASE_PATH="/"` setzen.

Pull Requests werden über [`ci.yml`](.github/workflows/ci.yml) geprüft (Lint, Tests, Build). Dependabot ([`.github/dependabot.yml`](.github/dependabot.yml)) legt wöchentlich Update-PRs an, `racing-bars` in einer eigenen Gruppe.

## Architektur

```
src/
  lib/data/        Import (CSV/XLSX), Erkennung wide/long, Perioden-Parsing, Lückenfüllung, Zwischenschritte
  lib/chart/       racingBars.ts (Wrapper um racing-bars), lineRace.ts (eigener D3-Line-Race), timeline.ts
  lib/layout.ts    Gemeinsames Bühnen-Layout (Titel, Chart-Fläche, Datum, Quelle, Wasserzeichen) für Vorschau und Export
  lib/export/      exportController.ts, svgSerialize.ts (Styles inline + Fonts als Data-URL), compose.ts (Canvas),
                   encoder.worker.ts (WebCodecs + mp4-muxer), gif.worker.ts, ffmpegFallback.ts
  export-frame/    Renderer im versteckten iframe mit virtueller Uhr (deterministische Frames)
  components/      React-UI (Stage = Vorschau, Data-/Design-/Export-Panel)
  brand/tokens.css Design-Tokens der drei Branding-Richtungen (siehe docs/BRANDING.md)
  samples/         Beispiel-Datensätze
```

**Warum der Export deterministisch ist:** `racing-bars` animiert mit D3-Transitions in Echtzeit. Für den Export läuft eine zweite Instanz in einem iframe, in dem `performance.now()` und `requestAnimationFrame` durch eine virtuelle Uhr ersetzt sind. Die Zeit wird pro Frame um exakt 1/30 s vorgestellt; jede Transition landet damit im exakten Zwischenzustand, egal wie schnell der Rechner ist. Das SVG wird serialisiert (Styles inline, Schriften eingebettet), auf ein Canvas in Zielauflösung gezeichnet, mit Texten und Wasserzeichen komponiert und an den Encoder-Worker übergeben. Der Line Chart Race ist von vornherein eine reine Funktion der Zeit.

## Upstream-Updates von racing-bars

Wir nutzen die Library unverändert als Abhängigkeit. Alle Berührungspunkte (Optionen, CSS-Overrides, DOM-Nachbearbeitung, virtuelle Uhr) und eine Checkliste für Updates stehen in [`docs/UPGRADING.md`](docs/UPGRADING.md).

## Bekannte Grenzen

- Bilder an den Balken werden von racing-bars als Kreis am Balkenende gezeichnet; wir bieten die Größe an, nicht die Position. Im Line Chart Race sitzen Bilder am Linienkopf.
- Kategorienamen sollten pro Datensatz eindeutig sein.
- Sehr lange Videos (mehrere Minuten in 9:16) brauchen entsprechend Zeit und Speicher; die Vorschau zeigt die Gesamtlänge vorab an.

## Änderungen

Siehe [`CHANGELOG.md`](CHANGELOG.md).

## Lizenz

MIT, siehe [`LICENSE`](LICENSE). Lizenzen der Abhängigkeiten inkl. vollständigem MIT-Text von racing-bars: [`THIRD-PARTY-LICENSES`](THIRD-PARTY-LICENSES).
