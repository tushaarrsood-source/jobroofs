import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';

export const metadata = {
  title: 'Haftungsausschluss / Disclaimer',
  description: 'Haftungsausschluss für JOBROOFS Berlin.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-3xl px-5 py-12 md:py-16 text-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Rechtlicher Hinweis
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Haftungsausschluss (Disclaimer)
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Reines Schwarzes Brett / Anzeigenportal für Berlin
          </p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed border-t border-zinc-200 pt-6">
            <PlatformDisclaimer type="housing" />

            <div className="pt-4 space-y-4 text-zinc-600">
              <h2 className="font-bold text-zinc-950 text-base">Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG / § 7 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG / §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <h2 className="font-bold text-zinc-950 text-base">Haftung für Links</h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
