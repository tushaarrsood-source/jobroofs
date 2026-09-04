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
            Verarbeitung personenbezogener Daten gemäß EU-DSGVO
          </p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed border-t border-zinc-200 pt-6">
            <div>
              <h2 className="font-bold text-zinc-950 text-base">1. Datenschutz auf einen Blick</h2>
              <p className="mt-1 text-zinc-600">
                Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Wir behandeln deine personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">2. Datenerfassung auf dieser Website</h2>
              <p className="mt-1 text-zinc-600">
                Beim Veröffentlichen von Job- oder Wohnungsanzeigen erheben wir die von dir angegebenen Kontaktdaten (z. B. E-Mail-Adresse, Telefonnummer), um die Anzeige darzustellen und den Direktkontakt zwischen Inserent und Interessent zu ermöglichen. Eine Weitergabe an unbeteiligte Dritte zu Werbezwecken findet nicht statt.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">3. Zahlungsabwicklung</h2>
              <p className="mt-1 text-zinc-600">
                Für kostenpflichtige Inserate nutzen wir den Zahlungsdienstleister Stripe. Deine Zahlungsdaten werden direkt von Stripe verschlüsselt verarbeitet und nicht auf unseren Servern gespeichert.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">4. Deine Rechte</h2>
              <p className="mt-1 text-zinc-600">
                Du hast jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck deiner gespeicherten personenbezogenen Daten sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu kannst du dich jederzeit an uns wenden.
              </p>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
