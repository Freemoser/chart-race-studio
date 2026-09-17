# Upgrading: racing-bars und andere Abhängigkeiten

Dieses Projekt benutzt [`racing-bars`](https://github.com/hatemhosny/racing-bars) als **npm-Abhängigkeit** (aktuell `0.5.1`). Es gibt keinen Fork und keinen Patch in `node_modules`. Alle Anpassungen sind Wrapper-Code in diesem Repo. Dependabot legt für neue Versionen eigene PRs an (`.github/dependabot.yml`, Gruppe `racing-bars`).

## Wo wir die Library berühren

| Stelle | Was wir nutzen | Worauf bei Updates achten |
|---|---|---|
| `src/lib/chart/racingBars.ts` → `barOptions()` | Öffentliche `Options`: `dataShape`, `labelsPosition`, `labelsWidth`, `showIcons`, `controlButtons`, `overlays`, `autorun`, `theme`, `colorMap`, `height`/`width`, `margin*`, `topN`, `tickDuration`, `valueLocale`, `valueDecimals`, `fixedScale`, `title`/`subTitle`/`caption`/`dateCounter` (alle leer, wir rendern Texte selbst) | Neue oder umbenannte Optionen. **Nullwerte werden vom Options-Reducer ignoriert** (`Number(x) || default`), deshalb geben wir `0.01` statt `0` für Ränder an. |
| `barOptions()` – `marginRight` | Die Library reserviert intern **65 px** rechts für Wertlabels (`range([left, width - right - 65])`). Wir messen die breiteste Zahl und ergänzen den Rest. | Wenn sich die 65 px ändern, Werte rechts prüfen. |
| `barOptions()` – `labelsWidth` | Bei `labelsPosition: 'outside'` gilt `margin.left = marginLeft + labelsWidth`; die Library **kürzt nicht**. Wir messen den längsten Kategorienamen (Canvas `measureText`) und setzen `labelsWidth` passend. | Falls die Library eigenes Messen/Kürzen einführt, unsere Messung ggf. entfernen. |
| `toRacingData()` | `Data` mit `date`, `name`, `value`, optional `icon` (Data-URL) | Feldnamen der `Data`-Schnittstelle. |
| `createBarRace()` | `race()`, `Race.play/pause/setDate/getDate/getAllDates/isRunning/on('dateChange')/destroy` | `setDate` akzeptiert nur Werte aus `getAllDates()` (sonst stiller No-op). `inc/dec` haben in 0.5.1 einen Bug (immer Schritt 1) – wir nutzen sie nicht. |
| `overrideCss()` | CSS-Overrides **nur** innerhalb unseres Containers: Schrift (`text{font-family}`), `--base-font-size` (Library-Default ist `max(1vw,12px)`, also viewport-abhängig), Balkenrundung (`rect.bar{rx}`), Icon-Skalierung (`circle{transform:scale()}`), Achsen-Farben, Ausblenden von `.controls/.overlay` | Klassennamen: `.bar`, `.label`, `.valueLabel`, `.xAxis`, `.tick`, `.domain`, `.svgpattern`, `circle` (Icon), `.controls`, `.overlay`. Bei Umbenennung Overrides anpassen. |
| `attachValueFormatter()` | MutationObserver auf `text.valueLabel` und `.xAxis .tick`: Die Library formatiert mit `Intl.NumberFormat(valueLocale)`; wir parsen die Zahl zurück und formatieren mit Präfix/Suffix/Tausender/kompakt (Achse ohne Präfix/Suffix). Zusätzlich blenden wir bei zu dichten Achsen-Ticks (schmale Formate) jeden k-ten Tick aus. | Wenn die Library eigene `valueFormatter`-/`ticks`-Optionen bekommt, Observer durch die Optionen ersetzen. Klassennamen `.xAxis`, `.tick` prüfen. |
| `src/export-frame/main.ts` | **Virtuelle Uhr für den Export**: Die gebündelte `d3-timer` liest `performance.now()` dynamisch, bindet aber `window.requestAnimationFrame` **beim Modul-Laden**. Deshalb patchen wir beides im Export-iframe, *bevor* `racing-bars` dynamisch importiert wird, und stubben `setInterval` (d3-timer „pokt“ damit seine Uhr). Danach ist jeder Zwischenzustand einer Transition eine reine Funktion der virtuellen Zeit. | Wenn `racing-bars`/d3 auf andere Zeitquellen umstellen (z.B. `Date.now`, `setTimeout`-basierte Ticks, Web Animations API), Export-Frames stichprobenartig mit der Vorschau vergleichen: `npm run dev`, Export starten, MP4 prüfen. |
| `src/lib/export/svgSerialize.ts` | Serialisiert das Library-SVG: berechnete Styles werden inline geschrieben (die Library injiziert ihr CSS in `<head>`, gescoped auf `#containerId`), Schriften als `@font-face` mit Data-URL eingebettet. | Neue SVG-Elementtypen (z.B. `foreignObject`) oder CSS-Eigenschaften in `STYLE_PROPS` ergänzen. |

Nicht benutzt: `racing-bars/react` (ruft `changeOptions` bei jedem Render auf, ignoriert Datenänderungen, kein `destroy()` beim Unmount) – wir kapseln `race()` selbst.

## Checkliste bei einem racing-bars-Update

1. Changelog/Release-Notes lesen: <https://github.com/hatemhosny/racing-bars/releases>
2. `npm install`, `npm run build`, `npm test`
3. `npm run dev` → Beispiel „Tierärztinnen und Tierärzte je Bundesland“ laden:
   - Labels außerhalb: alle 16 Namen vollständig lesbar (Mecklenburg-Vorpommern, Baden-Württemberg)?
   - Labels im Balken: Wertlabels korrekt mit Suffix formatiert?
   - Bilder/Flaggen an: Icons sichtbar, Größe-Regler wirkt?
4. MP4-Export (16:9 und 9:16) → Datei abspielen: flüssige Übergänge, Standbilder am Anfang/Ende vorhanden, Datum/Titel/Wasserzeichen sichtbar.
5. `docs/UPGRADING.md` aktualisieren, wenn sich Optionen oder DOM-Struktur geändert haben.

## Andere sensible Abhängigkeiten

- **mp4-muxer**: API `Muxer`, `ArrayBufferTarget`, `addVideoChunk(chunk, meta)`, `finalize()`. Bei Major-Updates `src/lib/export/encoder.worker.ts` prüfen. Alternative bei Problemen: `mediabunny` (Nachfolger derselben Autoren).
- **@ffmpeg/ffmpeg**: Core-Version in `src/lib/export/ffmpegFallback.ts` (`CORE_VERSION`) muss zur `@ffmpeg/ffmpeg`-Version passen (beide 0.12.x).
- **xlsx (SheetJS)**: kommt als Tarball von `cdn.sheetjs.com` (npm-Registry-Version ist veraltet). Neue Version: URL in `package.json` anpassen.
- **Tailwind CSS 4**: Eigene Klassen als `@utility` in `src/index.css`, damit `@apply` sie kennt.
