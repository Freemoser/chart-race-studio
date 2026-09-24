# Redaktion: Visiten, Freigabe, Artikel

**Stand:** 23.09.2026

## Visiten

Der Redaktionsplan ist in **Visiten** zu je 30 Posts gegliedert – wie ein Rundgang über die Station, Bett für
Bett. Die Postnummern laufen durch: Visite 1 sind die Posts 1–30, Visite 2 beginnt mit Post 31. Verweise wie
„siehe Post 3“ bleiben dadurch über alle Visiten eindeutig.

Definiert in `src/content/roadmap.ts` (`VISITEN`, `POSTS_JE_VISITE`). Eine neue Visite: Eintrag in `VISITEN`
mit Titel und Leitfrage, dann Posts ab der nächsten Nummer anlegen.

## Ablauf je Post

1. Post im Redaktionsplan auf `naechster`, Artikelentwurf in `src/content/artikel/NN-slug.md` auf `bereit: ja`.
2. Video im Studio exportieren, Post auf LinkedIn veröffentlichen.
3. Im Redaktionsplan: `status: 'veroeffentlicht'`, `publishedOn`, `linkedInUrl`.
4. Push. Ist die Freigabe an, gehen damit Datensatz und Artikel automatisch online.
5. Den Artikel-Link in den ersten Kommentar setzen.

Nach Änderungen an Titel oder Beschreibung eines Artikels: `node scripts/og-bilder.mjs` (braucht lokales Chrome) und die Bilder in `public/beitrag/og/` einchecken – das ist die Vorschau, die LinkedIn im Kommentar zeigt.

Optional: ein Standbild des Charts als `public/beitrag/<slug>.png` ablegen – der Artikel zeigt es dann unter dem ersten Absatz.

## Freigabe (`src/content/freigabe.json`)

| Schalter | an | aus |
|---|---|---|
| `beispieleErstNachVeroeffentlichung` | Das Studio zeigt nur Datensätze, die ein veröffentlichter Post verwendet | alle Datensätze sichtbar |
| `artikelLive` (**an seit 23.09.2026**) | Artikel von Posts auf `naechster` oder `veroeffentlicht` mit `bereit: ja` werden als Seite gebaut, dazu Übersicht `/beitrag/`, CSV je Datensatz unter `/daten/`, Sitemap und llms.txt | kein Artikel online |

**Vor dem Einschalten von `beispieleErstNachVeroeffentlichung`:** Datensätze, die in keinem Post vorkommen,
verschwinden dann ebenfalls. Seit der Weltkarte als Post 3 betrifft das keinen Datensatz mehr.

**Was „verborgen“ nicht heißt:** Das Repository ist öffentlich. Entwürfe, Redaktionsplan und Rohdaten sind dort
lesbar, und die Datensätze liegen weiterhin im ausgelieferten JavaScript. Die Schalter steuern, was die Seite
anbietet und was Suchmaschinen finden, nicht was geheim ist.

## Anleitungen

Artikel mit `art: anleitung` statt `post:` gehören zu keinem Post und gehen online, sobald sie `bereit: ja` tragen. Screenshots nie von Hand: `npm run dev`, dann `node scripts/screenshots-anleitung.mjs`. Nach Änderungen am Datenstandard (`docs/DATENSTANDARD.md`) Vorlagen neu erzeugen: `node scripts/build-vorlagen.mjs`.

## Artikel

Format und Regeln: `src/content/artikel/README.md`. Vorschau aller Entwürfe mit `npm run dev` unter
`/beitrag/entwurf/`. `npm run check:content` prüft jeden Entwurf auf Pflichtabschnitte, Länge der
Beschreibung, eine Zahl im ersten Absatz und offene Stellen.

## Kandidaten für Visite 2

Stand der Bewertung von Visite 1 und Themen, die dort keinen Platz hatten. Reihenfolge ist Priorität.

1. ~~**Hund oder Katze – die Welt**~~ – seit 24.09.2026 Post 3 in Visite 1 (die Posts 3–15 sind dafür um eins aufgerückt, der alte Post 16 ist darin aufgegangen).
2. **Die Tiermedizin wird weiblich, als Reihe seit 1991.** Einzelwerte sind in Post 28 belegt; die Zeitreihe steht in denselben BTK-Jahrgängen wie Datensatz 1 und muss ausgelesen werden.
3. **Versorgung je Einwohner** (Post 22) – falls die Destatis-Reihe nicht rechtzeitig für Visite 1 kommt.
4. **Tiergesundheitsmarkt als Reihe** (Post 27) – die Vorjahre veröffentlicht der BfT jährlich.
5. **Eröffnungen der Neugründer** (Post 9) – Eröffnungsdatum je Standort von filu, Rex, Wolf & Tiger ergäbe ein echtes Rennen.
6. **Japan: vom Hunde- zum Katzenland** – Einzelfall aus der Weltkarte, 57 auf 41 Prozent Hundeanteil.
