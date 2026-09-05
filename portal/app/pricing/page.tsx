import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { Check, Sparkles, Zap, Building2, Home } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Preise & Tarife — Transparent für Arbeitgeber & Vermieter in Berlin | JOBROOFS',
  description:
    'Einfache und transparente Preise für Job- und Wohnungsanzeigen in Berlin. Kostenlos für Bewerber und Mieter. Einzelanzeigen ab 29 € oder Jahrestarif für Unternehmen.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Preise & Tarife · JOBROOFS Berlin',
    description: 'Transparente Konditionen für Arbeitgeber und Vermieter in Berlin.',
    url: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Preise & Tarife', href: '/pricing' },
          ]}
        />
        <SiteHeader />

        <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0071e3]">
              <Sparkles className="size-3.5" /> 100% transparent &middot; Keine versteckten Gebühren
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-zinc-950">
              Preise für Arbeitgeber & Vermieter
            </h1>
            <p className="mt-3 text-sm md:text-base text-zinc-500 leading-relaxed">
              Für Jobsuchende und Wohnungssuchende ist JOBROOFS dauerhaft <strong className="text-zinc-800">100% kostenlos</strong>.
              Unternehmen und Gastgeber zahlen transparente Pauschalpreise ohne Abo-Fallen.
            </p>
          </div>

          {/* Job Postings Section */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="size-5 text-[#0071e3]" />
              <h2 className="text-xl font-semibold text-zinc-950">Jobanzeigen für Berliner Arbeitgeber</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Standard Job */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Standard Inserat</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-zinc-950">29 €</span>
                    <span className="text-xs text-zinc-500">einmalig</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Ideal für die schnelle Besetzung einzelner Minijobs, Werkstudenten- oder Aushilfsstellen.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-700">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span><strong>30 Tage</strong> aktive Laufzeit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>Präsenz auf der Kiez-Karte & Filter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>Direktkontakt per E-Mail / Telefon</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>Google for Jobs & SEO Indexierung</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/post-a-job"
                    className="block w-full text-center py-2.5 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition"
                  >
                    Job inserieren
                  </Link>
                </div>
              </div>

              {/* Premium Job */}
              <div className="rounded-2xl border-2 border-[#0071e3] bg-white p-6 shadow-md relative flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0071e3] px-3 py-0.5 text-[11px] font-semibold text-white uppercase tracking-wider">
                  Beliebteste Wahl
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#0071e3]">Premium Inserat</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-zinc-950">49 €</span>
                    <span className="text-xs text-zinc-500">einmalig</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Maximale Reichweite und Top-Platzierung in deiner Kiez-Kategorie.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-700">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-[#0071e3] shrink-0" />
                      <span><strong>60 Tage</strong> doppelte Laufzeit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-[#0071e3] shrink-0" />
                      <span><strong>Top-Platzierung</strong> ganz oben in der Liste</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-[#0071e3] shrink-0" />
                      <span>Hervorgehobenes Premium-Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-[#0071e3] shrink-0" />
                      <span>Präsenz auf der Kiez-Karte & Newsfeed</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/post-a-job"
                    className="block w-full text-center py-2.5 px-4 rounded-xl bg-[#0071e3] text-xs font-semibold text-white hover:bg-[#0077ed] transition shadow-sm"
                  >
                    Premium Job inserieren
                  </Link>
                </div>
              </div>

              {/* Annual Unlimited */}
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-900 text-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">Jahres-Flatrate</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-white">499 €</span>
                    <span className="text-xs text-zinc-400">/ Jahr</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    Für Gastronomie, Einzelhandel, Hotels und Agenturen mit kontinuierlichem Personalbedarf.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Zap className="size-4 text-amber-400 shrink-0" />
                      <span><strong>Unbegrenzte</strong> Stellenanzeigen (365 Tage)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-400 shrink-0" />
                      <span>Prioritäre Indexierung & Google Jobs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-400 shrink-0" />
                      <span>Verifiziertes Arbeitgeber-Profil</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-400 shrink-0" />
                      <span>Persönlicher Berliner Ansprechpartner</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/post-a-job"
                    className="block w-full text-center py-2.5 px-4 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition"
                  >
                    Jahres-Flatrate anfragen
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Housing Section */}
          <div className="mt-16 border-t border-zinc-200/80 pt-12">
            <div className="flex items-center gap-2 mb-6">
              <Home className="size-5 text-emerald-600" />
              <h2 className="text-xl font-semibold text-zinc-950">Wohnen & WG-Zimmer inserieren</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {/* Standard Housing */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Standard Zimmer / Wohnung</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-zinc-950">29 €</span>
                    <span className="text-xs text-zinc-500">einmalig</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Für WG-Zimmer, Zwischenmieten, Nachmieter-Suchen und Wohnungen.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-700">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span><strong>30 Tage</strong> aktive Laufzeit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>Live Warmmiete-Pin auf der Berlin-Karte</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>Klarer Nachweis über Anmeldung & Kaution</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/wohnen/list"
                    className="block w-full text-center py-2.5 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition"
                  >
                    Wohnung inserieren
                  </Link>
                </div>
              </div>

              {/* Premium Housing */}
              <div className="rounded-2xl border-2 border-emerald-600 bg-white p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Premium Platzierung</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-zinc-950">49 €</span>
                    <span className="text-xs text-zinc-500">einmalig</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Empfohlen bei dringenden Nachmieter-Suchen oder hochwertigen Wohnungen.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-700">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span><strong>60 Tage</strong> Laufzeit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>Hervorgehobene Platzierung in Wohnen-Listen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>Verifizierter Inserenten-Status</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href="/wohnen/list"
                    className="block w-full text-center py-2.5 px-4 rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    Premium Inserat aufgeben
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
