import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';

export const metadata = {
  title: 'AGB — Allgemeine Geschäftsbedingungen',
  description: 'Nutzungsbedingungen für KIEZJOB Berlin.',
};

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-3xl px-5 py-12 md:py-16 text-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Rechtliche Rahmenbedingungen
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Nutzungs- und Inseratsbedingungen für KIEZJOB Berlin
          </p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed border-t border-zinc-200 pt-6">
            <div>
              <h2 className="font-bold text-zinc-950 text-base">§ 1 Vertragsgegenstand & Status</h2>
              <p className="mt-1 text-zinc-600">
                KIEZJOB betreibt ein reines Online-Anzeigenportal und Schwarzes Brett für Stellenanzeigen (Minijobs, Teilzeit, Aushilfen) sowie Wohnungs- und Zimmerangebote in Berlin. KIEZJOB vermittelt keine Arbeits- oder Mietverhältnisse und wird zu keinem Zeitpunkt Vertragspartei zwischen Suchenden und Inserierenden.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">§ 2 Veröffentlichung & Gebühren</h2>
              <p className="mt-1 text-zinc-600">
                Die Veröffentlichung eines Einzelinserats (Job oder Wohnung) erfolgt nach Zahlung der angegebenen Einstellgebühr (29 €) für eine feste Laufzeit von 30 Tagen. Eine automatische Verlängerung oder ein Abonnement findet nicht statt.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">§ 3 Pflichten der Inserenten & Verbotene Inhalte</h2>
              <p className="mt-1 text-zinc-600">
                Inserenten sind verpflichtet, wahrheitsgemäße Angaben zu machen. Untersagt sind betrügerische Angebote, Vorkasse-Forderungen für Schlüssel oder Besichtigungen, diskriminierende Inserate oder Verstöße gegen Mietpreis- oder Arbeitszeitgesetze. KIEZJOB behält sich das Recht vor, unzulässige Inserate fristlos zu entfernen.
              </p>
            </div>

            <div className="pt-4">
              <PlatformDisclaimer type="housing" />
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
