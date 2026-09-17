import { FEATURES, LEGAL, SITE, hatAnschrift } from '@/content/site'

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-base font-semibold text-ink">{children}</h2>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{children}</p>
}

export function Impressum() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-8 lg:px-8 lg:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Impressum</h1>

      <H2>Angaben gemäß § 5 DDG</H2>
      {hatAnschrift() ? (
        <P>
          {LEGAL.operator}<br />
          {LEGAL.companyName && <>{LEGAL.companyName}<br /></>}
          {LEGAL.street}<br />
          {LEGAL.zip} {LEGAL.city}<br />
          {LEGAL.country}
        </P>
      ) : (
        <p className="mt-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-[13px] leading-relaxed text-accent">
          Anschrift fehlt. Vor dem öffentlichen Betrieb in <code>src/content/site.ts</code> eintragen –
          § 5 DDG verlangt eine ladungsfähige Anschrift. <code>npm run check:launch</code> meldet das als Blocker.
        </p>
      )}

      <H2>Kontakt</H2>
      <P>
        E-Mail: <a className="underline hover:text-ink" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        {LEGAL.phone && <><br />Telefon: {LEGAL.phone}</>}
      </P>

      {LEGAL.vatId && (<><H2>Umsatzsteuer-Identifikationsnummer</H2><P>{LEGAL.vatId}</P></>)}

      <H2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</H2>
      <P>{LEGAL.responsible}{hatAnschrift() && <>, {LEGAL.street}, {LEGAL.zip} {LEGAL.city}</>}</P>

      <H2>Verbraucherstreitbeilegung</H2>
      <P>Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</P>

      <H2>Haftung für Inhalte</H2>
      <P>
        Als Diensteanbieter bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
        Die mitgelieferten Beispieldatensätze sind mit Sorgfalt recherchiert und mit Quelle sowie Dateninfo versehen;
        sie ersetzen keine amtliche Statistik. Lücken, Methodenbrüche und berechnete Werte sind je Datensatz offengelegt.
      </P>

      <H2>Haftung für Links</H2>
      <P>
        Diese Seite verlinkt auf externe Quellen, auf deren Inhalte ich keinen Einfluss habe. Zum Zeitpunkt der
        Verlinkung waren keine rechtswidrigen Inhalte erkennbar.
      </P>

      <H2>Urheberrecht</H2>
      <P>
        Der Programmcode steht unter der MIT-Lizenz. Die Diagramm-Animation basiert auf{' '}
        <a className="underline hover:text-ink" href="https://github.com/hatemhosny/racing-bars" target="_blank" rel="noreferrer">racing-bars</a> (MIT).
        Die Rechte an den zitierten Statistiken liegen bei den jeweils genannten Herausgebern.
      </P>
    </article>
  )
}

export function Datenschutz() {
  const ga = Boolean(FEATURES.gaId)
  const cf = Boolean(FEATURES.cloudflareToken)
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-8 lg:px-8 lg:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Datenschutzerklärung</h1>

      <H2>Das Wichtigste zuerst</H2>
      <P>
        {SITE.name} läuft vollständig im Browser. Tabellen, die du hochlädst oder eingibst, die erzeugten Videos und
        deine Einstellungen verlassen dein Gerät nicht. Es gibt keinen Server, der sie entgegennimmt, und keine
        Verarbeitung deiner Inhalte durch mich oder Dritte.
      </P>

      <H2>Verantwortlicher</H2>
      <P>
        {LEGAL.operator}{LEGAL.companyName && `, ${LEGAL.companyName}`}
        {hatAnschrift() && <>, {LEGAL.street}, {LEGAL.zip} {LEGAL.city}</>}<br />
        E-Mail: <a className="underline hover:text-ink" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
      </P>

      <H2>Aufruf der Seite</H2>
      <P>
        Die Seite wird über GitHub Pages ausgeliefert (GitHub, Inc., 88 Colin P Kelly Jr Street, San Francisco, CA 94107,
        USA). Beim Abruf verarbeitet der Hoster technisch notwendige Zugriffsdaten wie IP-Adresse, Zeitpunkt, abgerufene
        Datei und User-Agent. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einer sicheren und
        stabilen Auslieferung. Darauf habe ich keinen Einfluss und erhalte davon keine Kopie.
      </P>

      <H2>Speicherung im Browser</H2>
      <P>
        Deine Einstellungen und – falls du sie triffst – deine Entscheidung zur Statistik werden im lokalen Speicher
        (localStorage) deines Browsers abgelegt, damit sie beim nächsten Besuch noch da sind. Sie werden nicht übertragen
        und lassen sich jederzeit über die Browser-Einstellungen löschen.
      </P>

      <H2>Schriften und Programmcode</H2>
      <P>
        Schriften und Programmcode werden mit der Seite selbst ausgeliefert. Es findet keine Nachladung von Google Fonts
        oder einem anderen fremden Server statt.
      </P>

      {(ga || cf) && <H2>Reichweitenmessung</H2>}

      {cf && (
        <P>
          <strong className="text-ink">Cloudflare Web Analytics</strong> (Cloudflare, Inc., 101 Townsend St, San Francisco,
          CA 94107, USA) misst Seitenaufrufe ohne Cookies und ohne geräteübergreifende Wiedererkennung. Es werden keine
          Profile gebildet und keine Daten zu Werbezwecken genutzt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO,
          berechtigtes Interesse an einer groben Reichweitenmessung. Weil dabei keine Informationen auf deinem Gerät
          gespeichert oder ausgelesen werden, ist dafür keine Einwilligung nach § 25 TDDDG erforderlich.
        </P>
      )}

      {ga && (
        <P>
          <strong className="text-ink">Google Analytics 4</strong> (Google Ireland Limited, Gordon House, Barrow Street,
          Dublin 4, Irland) wird ausschließlich nach deiner ausdrücklichen Einwilligung geladen. Erst dann werden Cookies
          gesetzt. Die IP-Adresse wird gekürzt, Google Signals und die Personalisierung von Werbung sind abgeschaltet.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO in Verbindung mit § 25 Abs. 1 TDDDG. Eine Übermittlung in die USA
          ist nicht ausgeschlossen; Google ist unter dem EU-US Data Privacy Framework zertifiziert. Du kannst deine
          Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen:{' '}
          <button type="button" data-consent-reset className="underline hover:text-ink">Auswahl erneut treffen</button>.
        </P>
      )}

      {!ga && !cf && (
        <>
          <H2>Reichweitenmessung</H2>
          <P>Es findet keine Reichweitenmessung statt. Es sind keine Analyse-Skripte eingebunden und es werden keine Cookies zu Statistikzwecken gesetzt.</P>
        </>
      )}

      <H2>Deine Rechte</H2>
      <P>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und
        Widerspruch sowie das Recht, dich bei einer Aufsichtsbehörde zu beschweren. Zuständig ist die Aufsichtsbehörde
        deines Wohnorts oder das Bayerische Landesamt für Datenschutzaufsicht.
      </P>

      <H2>Stand</H2>
      <P>Diese Erklärung beschreibt den Stand der Seite zum Zeitpunkt des letzten Deployments.</P>
    </article>
  )
}
