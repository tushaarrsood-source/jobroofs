import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung nach der DSGVO für JOBROOFS Berlin.',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-3xl px-5 py-12 md:py-16 text-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Datenschutz & Privatsphäre
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Information über die Verarbeitung personenbezogener Daten gemäß Art. 13 & 14 EU-DSGVO und § 25 TDDDG
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed border-t border-zinc-200 pt-6">
            {/* 1. Verantwortlicher */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">1. Name und Anschrift des Verantwortlichen</h2>
              <p className="mt-1 text-zinc-600">
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze ist:
              </p>
              <div className="mt-2 p-3 bg-zinc-100/80 rounded-xl border border-zinc-200 text-zinc-700 font-mono text-xs">
                JOBROOFS Deutschland<br />
                Tushaar Sood<br />
                Berlin, Deutschland<br />
                E-Mail: jobroofs@gmail.com<br />
                Website: https://jobroofs.com
              </div>
            </div>

            {/* 2. Allgemeine Hinweise und Rechtsgrundlagen */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">2. Rechtsgrundlagen der Verarbeitung</h2>
              <p className="mt-1 text-zinc-600">
                Wir verarbeiten personenbezogene Daten stets im Einklang mit den Vorgaben der DSGVO:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-zinc-600">
                <li><strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong> Für freiwillig aktivierte Analyse-Cookies oder Benachrichtigungen.</li>
                <li><strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung & vorvertragliche Maßnahmen):</strong> Zur Erstellung, Veröffentlichung und Verwaltung von Stellenanzeigen sowie Durchführung von Zahlungsvorgängen.</li>
                <li><strong>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung):</strong> Zur Erfüllung handels- und steuerrechtlicher Aufbewahrungspflichten (§ 147 AO, § 257 HGB).</li>
                <li><strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):</strong> Zur Gewährleistung der IT-Sicherheit, Betrugsprävention und Stabilität unseres Anzeigenportals.</li>
              </ul>
            </div>

            {/* 3. Datenerfassung bei Inseraten */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">3. Datenerfassung bei Inseraten & Nutzerkonten</h2>
              <p className="mt-1 text-zinc-600">
                Beim Veröffentlichen eines Inserats erheben wir Angaben wie Stellenbezeichnung, Arbeitgebername, Tätigkeitsort, Vergütung sowie die von dir gewählten Kontaktkanäle (z. B. WhatsApp-Nummer, E-Mail-Adresse, Telefon).
              </p>
              <p className="mt-2 text-zinc-600">
                Zweck der Verarbeitung ist die Darstellung des Inserats und die Ermöglichung der direkten Kontaktaufnahme zwischen Bewerbern und Inserenten ohne Zwischenschaltung Dritter. Daten werden nicht an unbefugte Dritte weitergegeben oder zu Werbezwecken verkauft.
              </p>
            </div>

            {/* 4. Zahlungsabwicklung via Stripe */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">4. Zahlungsabwicklung (Stripe)</h2>
              <p className="mt-1 text-zinc-600">
                Für kostenpflichtige Inserate nutzen wir die Dienste der Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland (&bdquo;Stripe&ldquo;).
              </p>
              <p className="mt-2 text-zinc-600">
                Beim Bezahlvorgang werden deine Zahlungsdaten (Kreditkarte, SEPA-Informationen, Name, Rechnungsadresse) verschlüsselt direkt an Stripe übermittelt. Wir speichern zu keinem Zeitpunkt vollständige Kreditkartendaten auf unseren Servern. Die Datenübertragung an die Stripe Inc. (USA) erfolgt auf Grundlage der Standardvertragsklauseln der EU-Kommission bzw. des EU-U.S. Data Privacy Frameworks. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </div>

            {/* 5. Hosting & Datenbank (Firebase / Google Cloud) */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">5. Hosting & Datenbanken (Google Firebase)</h2>
              <p className="mt-1 text-zinc-600">
                Wir nutzen Google Firebase (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) für Authentifizierung, Cloud Firestore Datenbanken und Hosting. 
              </p>
              <p className="mt-2 text-zinc-600">
                Google verarbeitet die Daten in unserem Auftrag auf Grundlage eines Auftragsverarbeitungsvertrages (Data Processing Addendum) gemäß Art. 28 DSGVO. Soweit Daten in Drittstaaten übermittelt werden, greifen Standardvertragsklauseln sowie Zertifizierungen nach dem Data Privacy Framework.
              </p>
            </div>

            {/* 6. Cookies & Local Storage */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">6. Cookies & Local Storage (§ 25 TDDDG)</h2>
              <p className="mt-1 text-zinc-600">
                Unsere Website nutzt Local Storage und Cookies. Technisch notwendige Einträge (z. B. Authentifizierungs-Token, gewählte Sprache, Cookie-Zustimmungsstatus) werden gemäß § 25 Abs. 2 TDDDG ohne gesonderte Einwilligung verarbeitet, da sie für den Betrieb zwingend erforderlich sind.
              </p>
              <p className="mt-2 text-zinc-600">
                Optionale Analyse-Dienste (Google Analytics) werden <strong>ausschließlich nach deiner ausdrücklichen Einwilligung</strong> im Cookie-Banner aktiviert (§ 25 Abs. 1 TDDDG i. V. m. Art. 6 Abs. 1 lit. a DSGVO). Du kannst deine Cookie-Präferenzen jederzeit über den Link &bdquo;Cookie-Einstellungen&ldquo; in unserer Fußzeile widerrufen oder anpassen.
              </p>
            </div>

            {/* 7. Speicherdauer & Löschung */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">7. Speicherdauer & Löschung (Art. 17 DSGVO)</h2>
              <p className="mt-1 text-zinc-600">
                Inserate werden für die gebuchte Laufzeit (15, 30 oder 60 Tage) aktiv gehalten und nach Ablauf automatisch archiviert. Inserenten können ihre Inserate jederzeit im Bereich &bdquo;Meine Inserate&ldquo; eigenhändig vorzeitig löschen. Gesetzliche steuer- und handelsrechtliche Aufbewahrungspflichten für Rechnungsunterlagen bleiben unberührt.
              </p>
            </div>

            {/* 8. Deine Rechte als betroffene Person */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">8. Deine Rechte als betroffene Person</h2>
              <p className="mt-1 text-zinc-600">
                Als betroffene Person stehen dir nach der DSGVO umfassende Rechte zu:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-zinc-600">
                <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Recht auf Auskunft über deine bei uns gespeicherten personenbezogenen Daten.</li>
                <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Recht auf Berichtigung unrichtiger oder Vervollständigung deiner Daten.</li>
                <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Recht auf Löschung deiner Daten (&bdquo;Recht auf Vergessenwerden&ldquo;).</li>
                <li><strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO).</strong></li>
                <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO).</strong></li>
                <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</li>
                <li><strong>Widerruf von Einwilligungen (Art. 7 Abs. 3 DSGVO):</strong> Einmal erteilte Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden.</li>
              </ul>
              <p className="mt-2 text-zinc-600">
                Zur Ausübung deiner Rechte genügt eine formlose E-Mail an <span className="font-mono text-zinc-900 font-semibold">jobroofs@gmail.com</span>.
              </p>
            </div>

            {/* 9. Beschwerderecht bei der Aufsichtsbehörde */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">9. Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO)</h2>
              <p className="mt-1 text-zinc-600">
                Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht dir das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes (z. B. Berliner Beauftragte für Datenschutz und Informationsfreiheit).
              </p>
            </div>

            {/* 10. Datensicherheit */}
            <div>
              <h2 className="font-bold text-zinc-950 text-base">10. Datensicherheit & SSL/TLS-Verschlüsselung</h2>
              <p className="mt-1 text-zinc-600">
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL/TLS-Verschlüsselung sowie HTTP Strict Transport Security (HSTS). Eine verschlüsselte Verbindung erkennst du daran, dass die Adresszeile des Browsers von &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt und an dem Schloss-Symbol in deiner Browserzeile.
              </p>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
