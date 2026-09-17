# Branding-Vorschlag: Thomas Freimoser

Ziel: seriös, modern, datengetrieben, passend zu LinkedIn-Inhalten. Kein Startup-Bunt. Drei Richtungen sind implementiert und in der App oben rechts unter **„Design-Richtung“** live umschaltbar. Alle Werte liegen zentral in `src/brand/tokens.css` (CSS-Variablen) und werden in `src/index.css` als Tailwind-Theme (`@theme inline`) verfügbar gemacht. Die Chart-Paletten stehen in `src/lib/palettes.ts`.

## Richtung 1 – „Klar“ (Standard)

- **Schrift:** Inter (variabel). Neutral, exzellent lesbar in kleinen Größen und in Videos, Tabellenziffern (`tnum`).
- **Farben:** Petrol `#0F4C5C` als Primärfarbe (ruhig, vertrauenswürdig, medizinnah ohne Klinik-Weiß), warmes Orange `#E36414` als Akzent (LinkedIn-tauglicher Kontrast, sparsam einsetzen), kühle Grautöne.
- **Wortmarke:** Monogramm-Kachel mit drei Balken abnehmender Länge (Bar-Race-Motiv), mittlerer Balken in Akzentfarbe; daneben „Chart Race Studio / THOMAS FREIMOSER“ in Versalien. Skaliert von Favicon bis Header.
- **Wirkung:** aufgeräumt, technisch, professionell. Empfehlung als Standard.

## Richtung 2 – „Editorial“

- **Schrift:** IBM Plex Sans. Etwas charaktervoller, „redaktionell“, sehr gut für lange Zahlenreihen.
- **Farben:** Anthrazit `#1F2933` primär, Bernstein `#C98A1C` als Akzent, warmer Papierton `#FAF8F3` als Hintergrund, kleine Radien.
- **Wirkung:** Fachmagazin, Analyse, „Datenjournalismus“. Gut, wenn die Inhalte eher Studien und Marktanalysen sind.

## Richtung 3 – „Signal“

- **Schrift:** Manrope (variabel). Geometrischer, moderner, etwas mehr Persönlichkeit.
- **Farben:** Tiefblau `#14213D` primär, Smaragd `#2A9D8F` als Akzent, größere Radien.
- **Wirkung:** Tech/Produkt, klar erkennbar, trotzdem seriös. Gut für Software- und Digitalisierungsthemen.

## Gemeinsame Regeln

- Ein Akzent pro Fläche. Der Akzent markiert Handlung (Buttons) oder die eine hervorgehobene Datenreihe.
- Video-Bühne: hell (`--stage-bg-light`) oder dunkel (`--stage-bg-dark`) – beide pro Richtung definiert.
- Chart-Paletten sind bewusst gedeckt (Standard „Freimoser“: Petrol, Orange, Salbei, Bordeaux, …). Signalfarben nur als Option („Kräftig“).
- Typografie im Video: Titel 700, Untertitel 400, Kategorien 600, Werte 500, Quelle 400. Größen pro Format in `src/lib/formats.ts`.

## Wechseln oder anpassen

- Standard-Richtung: `data-brand="klar"` in `index.html` und `brand: 'klar'` in `src/state/store.ts`.
- Neue Richtung: Block in `tokens.css` ergänzen, Schrift in `src/lib/fonts.ts` registrieren (Fontsource-Paket), Option im Header (`src/App.tsx`).
- Schriften werden für den Videoexport als Data-URL ins SVG eingebettet (`src/lib/fonts.ts`), daher müssen alle Schnitte lokal im Bundle liegen (keine Google-Fonts-Links).
