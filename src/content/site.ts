/**
 * ═══════════════════════════════════════════════════════════════════
 *  ANGABEN ZUR SEITE — eine Quelle für Impressum, Datenschutz und Footer
 * ═══════════════════════════════════════════════════════════════════
 * Gleiche Struktur wie `LEGAL` in der Waterfasting-App, damit beide Projekte
 * gleich zu pflegen sind.
 *
 * BLOCKER VOR DEM LIVEGANG: `street` und `zip` sind Pflicht. § 5 DDG verlangt
 * eine ladungsfähige Anschrift; ein unvollständiges Impressum ist in Deutschland
 * abmahnfähig. `npm run check:launch` meldet das als Blocker.
 */
export const LEGAL = {
  operator: 'Thomas Freimoser',
  companyName: 'Petleo',
  street: '', // BLOCKER: Straße und Hausnummer
  zip: '', // BLOCKER: PLZ
  city: 'München',
  country: 'Deutschland',
  email: 'thomas.freimoser@petleo.net',
  phone: '',
  vatId: '',
  /** Inhaltlich verantwortlich nach § 18 Abs. 2 MStV. */
  responsible: 'Thomas Freimoser',
} as const

export const SITE = {
  name: 'Chart Race Studio',
  tagline: 'Aus einer Tabelle wird ein Video für den Feed.',
  /** Wird für Sitemap, robots.txt und die kanonische URL gebraucht. Nach dem ersten Deploy eintragen. */
  url: import.meta.env.VITE_SITE_URL ?? '',
} as const

/**
 * Integrationen. Alles optional: Was nicht konfiguriert ist, erscheint nicht –
 * kein „wird gerade eingerichtet“, sondern schlicht nichts.
 * Gesetzt werden die Werte als Build-Variablen (.env.local lokal, Repository-Variablen in Actions).
 */
export const FEATURES = {
  /** Google Analytics 4, Messkennung „G-XXXXXXX“. Setzt Cookies → nur nach Einwilligung. */
  gaId: import.meta.env.VITE_GA_ID ?? '',
  /** Cloudflare Web Analytics, Token aus dem Dashboard. Cookielos → ohne Einwilligung, aber in der Datenschutzerklärung genannt. */
  cloudflareToken: import.meta.env.VITE_CF_BEACON ?? '',
  /** Inhalt des google-site-verification-Meta-Tags für die Search Console. */
  searchConsole: import.meta.env.VITE_GSC_VERIFICATION ?? '',
} as const

export const hatAnschrift = () => Boolean(LEGAL.street && LEGAL.zip)
