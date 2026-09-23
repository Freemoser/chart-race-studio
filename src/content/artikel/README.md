# Artikel zur Post-Reihe

Jeder Post im Redaktionsplan (`src/content/roadmap.ts`) bekommt hier einen Artikel: die Langfassung mit
Zahl, Jahr und Quelle, auf die der erste LinkedIn-Kommentar verlinkt. Ein Artikel beantwortet **eine**
Frage, die Menschen tatsächlich suchen (siehe `docs/KEYWORD-RECHERCHE.md`).

Gebaut wird mit `scripts/build-artikel.mjs`. Online geht ein Artikel nur, wenn in
`src/content/freigabe.json` `artikelLive` an ist, der Post veröffentlicht ist und hier `bereit: ja` steht.
Vorschau aller Entwürfe: `npm run dev`, dann `/beitrag/entwurf/`.

## Dateiname und Kopf

`NN-slug.md`, NN ist die Postnummer zweistellig (`03-…`, `31-…`).

```
---
post: 3
slug: tieraerzte-angestellt-selbststaendig
titel: Mehr angestellte Tierärzte als Praxisinhaber – der Wechsel 2024
beschreibung: 1–2 Sätze, höchstens 160 Zeichen, mit der Kernzahl. Wird zur Meta-Beschreibung.
frage: Wie viele Tierärzte in Deutschland sind angestellt?
suchbegriffe: tierärzte deutschland anzahl, angestellte tierärzte, praxisinhaber tierarzt
stand: 2026-09-23
bereit: ja
---
```

- `slug`: aus Suchbegriffen, nicht aus dem Post-Titel. Nur a–z, 0–9, Bindestrich; Umlaute als ae/oe/ue/ss. Wird zur URL und ändert sich danach nie wieder.
- `titel`: der `<title>` für Google, höchstens etwa 65 Zeichen, Suchbegriff vorn. Die sichtbare Überschrift ist der Post-Titel aus dem Redaktionsplan.
- `bereit: nein`, solange Zahlen fehlen oder ungeprüft sind. Offene Stellen im Text als `**Offen:** …` markieren.

## Aufbau

1. **Erster Absatz = die Antwort.** Zahl, Jahr, Quelle in einem Satz. Kein Anlauf, kein „In diesem Artikel“. Antwortmaschinen und Google zitieren diesen Absatz.
2. `## Das Wichtigste in Kürze` – drei bis fünf Punkte, jeder mit einer Zahl.
3. Zwei bis vier Abschnitte mit `##`, deren Überschriften Fragen oder Aussagen sind, keine Etiketten („Warum der Wechsel 2024 kam“, nicht „Hintergrund“).
4. `## Was die Zahl nicht sagt` – Grenzen, Methodenbrüche, was verwechselt wird. Pflicht.
5. `## Häufige Fragen` mit `###`-Fragen; der Absatz danach ist die Antwort. Wird automatisch als FAQPage ausgezeichnet. Nur Fragen, die in der Suche vorkommen oder in Kommentaren gestellt wurden.
6. `## Quelle und Methode` – Quelle mit Link, Zeitraum, was berechnet ist.

Länge: 500 bis 900 Wörter. Länger nur, wenn die Zahlen es tragen.

## Regeln

- **Jede Zahl steht in `src/samples/data.ts`, `docs/DATASETS.md` oder im Redaktionsplan.** Nichts schätzen, nichts runden, was nicht gerundet ist. Berechnete Werte (Anteile, Faktoren) als berechnet kenntlich machen.
- Suchwörter statt Branchenwörter in Überschriften: „Haustiere“ statt „Heimtiere“, „Tierärzte“ in Überschriften, „Tierärztinnen und Tierärzte“ im Fließtext.
- Keine Werbung, keine Firmennennung als Absender. Die Seite wird privat betrieben.
- Unterstützt: Absätze, `##`, `###`, `- ` Listen, `1. ` Listen, Tabellen mit Kopfzeile (`---:` = rechtsbündig), `> ` Zitate, `**fett**`, `*kursiv*`, `[Link](url)`.
