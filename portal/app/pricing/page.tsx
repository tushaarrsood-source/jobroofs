import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';

export const metadata: Metadata = {
  title: 'Preise & Tarife — Transparent für Arbeitgeber in Berlin | JOBROOFS',
  description:
    'Einfache und transparente Konditionen für Stellenanzeigen in Berlin. Kostenlos für Jobsuchende. Direkte Veröffentlichung, kein Abo-Zwang.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Preise & Tarife · JOBROOFS Berlin',
    description: 'Transparente Konditionen für Arbeitgeber in Berlin.',
    url: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#FBFBF8] text-[#202A31] flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Preise & Tarife', href: '/pricing' },
          ]}
        />
        <SiteHeader />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-[10px] font-mono font-medium uppercase tracking-[0.24em] text-[#7e8a84]">
              PRICING &middot; TRANSPARENT ARCHITECTURE
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-light sm:font-normal tracking-[-0.025em] text-[#202a31] leading-tight"
              style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              Konditionen für Berliner Arbeitgeber.
            </h1>
            <p className="text-sm md:text-base text-[#5a6460] font-light leading-relaxed">
              Für Jobsuchende ist JOBROOFS dauerhaft <strong className="text-[#202a31] font-medium">100% kostenlos</strong>.
              Unternehmen wählen zwischen flexiblen Einzelinseraten und Jahres-Flatrates.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Job */}
            <div className="rounded-2xl border border-[#d8ded9] bg-white p-7 flex flex-col justify-between transition-shadow hover:shadow-xs">
              <div>
                <div className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#7e8a84]">
                  STANDARD INSERAT
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-normal tracking-tight text-[#202a31]"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    29 €
                  </span>
                  <span className="text-xs text-[#7e8a84] font-light">einmalig</span>
                </div>
                <p className="mt-2 text-[13px] text-[#5a6460] font-light leading-relaxed">
                  Ideal für die schnelle Besetzung einzelner Schichten, Minijobs oder Aushilfsstellen im Kiez.
                </p>
                <div className="w-full h-px bg-[#d8ded9] my-6" />
                <ul className="space-y-3 text-[13px] text-[#5a6460] font-light">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span><strong>30 Tage</strong> aktive Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span>Präsenz auf der Kiez-Karte & Filter</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span>100% Direktkontakt (E-Mail / Tel.)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span>Google for Jobs & SEO Indexierung</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press block w-full text-center py-3 px-4 rounded-xl border border-[#d8ded9] text-[13px] font-medium text-[#202a31] hover:bg-[#f4f4ee] transition-colors"
                >
                  Job inserieren
                </Link>
              </div>
            </div>

            {/* Premium Job */}
            <div className="rounded-2xl border-2 border-[#202a31] bg-white p-7 relative flex flex-col justify-between shadow-xs">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#202a31] px-3.5 py-0.5 text-[10px] font-mono font-medium text-[#fbfbf8] uppercase tracking-[0.16em]">
                EMPFOHLEN
              </div>
              <div>
                <div className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#202a31]">
                  PREMIUM INSERAT
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-normal tracking-tight text-[#202a31]"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    49 €
                  </span>
                  <span className="text-xs text-[#7e8a84] font-light">einmalig</span>
                </div>
                <p className="mt-2 text-[13px] text-[#5a6460] font-light leading-relaxed">
                  Maximale Sichtbarkeit und Top-Platzierung in deiner Kiez-Kategorie für schnelles Hiring.
                </p>
                <div className="w-full h-px bg-[#d8ded9] my-6" />
                <ul className="space-y-3 text-[13px] text-[#5a6460] font-light">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span><strong>60 Tage</strong> doppelte Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span><strong>Top-Platzierung</strong> ganz oben in der Liste</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span>Hervorgehobenes Premium-Badge</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#202a31] shrink-0 stroke-[1.5]" />
                    <span>Präsenz auf der Kiez-Karte & Newsfeed</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press flex items-center justify-center gap-2 w-full text-center py-3 px-4 rounded-xl bg-[#202a31] text-[13px] font-medium text-[#fbfbf8] hover:bg-[#161D22] transition-colors"
                >
                  <span>Premium Job inserieren</span>
                  <ArrowRight className="size-3.5 stroke-[1.5]" />
                </Link>
              </div>
            </div>

            {/* Annual Unlimited */}
            <div className="rounded-2xl border border-[#d8ded9] bg-[#202a31] text-[#fbfbf8] p-7 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#d8ded9]">
                  JAHRES-FLATRATE
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-normal tracking-tight text-[#fbfbf8]"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    499 €
                  </span>
                  <span className="text-xs text-[#a0aba5] font-light">/ Jahr</span>
                </div>
                <p className="mt-2 text-[13px] text-[#d8ded9] font-light leading-relaxed">
                  Für Gastronomie, Einzelhandel, Clubs & Betriebe mit kontinuierlichem Personalbedarf.
                </p>
                <div className="w-full h-px bg-white/10 my-6" />
                <ul className="space-y-3 text-[13px] text-[#e0e4e1] font-light">
                  <li className="flex items-center gap-2.5">
                    <Zap className="size-4 text-amber-400 shrink-0 stroke-[1.5]" />
                    <span><strong>Unbegrenzte</strong> Inserate (365 Tage)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0 stroke-[1.5]" />
                    <span>Prioritäre Indexierung & Google Jobs</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0 stroke-[1.5]" />
                    <span>Verifiziertes Arbeitgeber-Profil</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0 stroke-[1.5]" />
                    <span>Persönlicher Berliner Support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press block w-full text-center py-3 px-4 rounded-xl bg-[#fbfbf8] text-[13px] font-medium text-[#202a31] hover:bg-white transition-colors"
                >
                  Jahres-Flatrate wählen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
