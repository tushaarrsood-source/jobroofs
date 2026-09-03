import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';

export const metadata = {
  title: 'Impressum',
  description: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) für KIEZJOB Berlin.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-3xl px-5 py-12 md:py-16 text-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Rechtliche Angaben
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Impressum
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
          </p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed border-t border-zinc-200 pt-6">
            <div>
              <h2 className="font-bold text-zinc-950 text-base">Dienstanbieter / Betreiber</h2>
              <p className="mt-1 text-zinc-600">
                KIEZJOB Portal<br />
                Berlin, Deutschland
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">Kontakt</h2>
              <p className="mt-1 text-zinc-600">
                E-Mail: <span className="font-mono text-zinc-900">kontakt@kiezjob.de</span><br />
                Web: <span className="font-mono text-zinc-900">https://kiezjob.de</span>
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">Art des Dienstes</h2>
              <p className="mt-1 text-zinc-600">
                KIEZJOB ist ein reines Online-Anzeigenportal und Schwarzes Brett für Minijobs, flexible Beschäftigungen und studentische/private Wohnungs- und Zimmerinserate im Raum Berlin. KIEZJOB vermittelt keine Arbeits- oder Mietverträge und tritt weder als Arbeitgeber, Arbeitsvermittler, Personalagentur noch als Vermieter oder Makler auf.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-zinc-950 text-base">Verbraucherstreitbeilegung</h2>
              <p className="mt-1 text-zinc-600">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline">https://ec.europa.eu/consumers/odr</a>. Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
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
