import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { Check, Zap, ArrowRight, Mail } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { CompetitorComparison } from '@/components/competitor-comparison';

export const metadata: Metadata = {
  title: 'Preise & Tarife — Transparent für Betriebe in Deutschland | JOBROOFS',
  description:
    'Einfache und transparente Konditionen für Stellenanzeigen in ganz Deutschland. Kostenlos für Jobsuchende. Direkte Veröffentlichung, kein Abo-Zwang.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Preise & Tarife · JOBROOFS',
    description: 'Transparente Konditionen für unabhängige Betriebe in Deutschland.',
    url: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-[#222222] flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Preise & Tarife', href: '/pricing' },
          ]}
        />
        <SiteHeader />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight"
              style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              Faire Konditionen für unabhängige Betriebe in ganz Deutschland.
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
              Für Jobsuchende dauerhaft <strong className="text-black font-semibold">100% kostenlos</strong>.
              Für Betriebe bis zu <strong className="text-black font-semibold">75% günstiger als andere Plattformen</strong> — inklusive 1-Klick WhatsApp Direktkontakt.
            </p>
          </div>

          {/* Pricing Grid - Flat Soft Surfaces */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free / Private Job */}
            <div className="rounded-3xl bg-zinc-50 p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
                  ERSTINSERAT & PRIVAT
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="text-4xl sm:text-5xl font-bold tracking-tight text-emerald-950 font-mono"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    0 €
                  </span>
                  <span className="text-sm text-zinc-600 font-normal">1. Job gratis</span>
                </div>
                <p className="mt-3 text-base text-zinc-600 font-normal leading-relaxed">
                  Perfekt für Nachhilfe, Babysitting, Umzugshilfe oder das allererste Inserat deines Kiez-Betriebs.
                </p>
                <div className="w-full h-px bg-zinc-200 my-6" />
                <ul className="space-y-3.5 text-base text-zinc-700 font-normal">
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-emerald-600 shrink-0 stroke-[2]" />
                    <span><strong className="font-semibold text-black">15 Tage</strong> aktive Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-emerald-600 shrink-0 stroke-[2]" />
                    <span><strong className="font-semibold text-black">100% Direktkontakt</strong> per WhatsApp & E-Mail</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-emerald-600 shrink-0 stroke-[2]" />
                    <span>Sofort live <strong className="font-semibold text-black">ohne Zahlungsdaten</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-zinc-500 text-sm">
                    <span>(Andere Portale verlangen oft über 70 €)</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press block w-full text-center py-4 px-5 rounded-2xl bg-emerald-100/80 hover:bg-emerald-200/80 text-base font-semibold text-emerald-950 transition-colors"
                >
                  Kostenlos inserieren
                </Link>
              </div>
            </div>

            {/* Standard Job - Highlight Card */}
            <div className="rounded-3xl bg-zinc-900 text-white p-7 sm:p-8 relative flex flex-col justify-between shadow-sm">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1 text-xs font-bold text-white uppercase tracking-[0.14em]">
                EMPFOHLEN &middot; BESTE PREISLEISTUNG
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  STANDARD INSERAT
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    14,99 €
                  </span>
                  <span className="text-sm text-zinc-400 font-normal">einmalig inkl. MwSt.</span>
                </div>
                <p className="mt-3 text-base text-zinc-300 font-normal leading-relaxed">
                  Ideal für Cafés, Bars, Kiez-Läden, Handwerker und Ateliers mit regulärem Einstellungsbedarf.
                </p>
                <div className="w-full h-px bg-zinc-800 my-6" />
                <ul className="space-y-3.5 text-base text-zinc-300 font-normal">
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-emerald-400 shrink-0 stroke-[2]" />
                    <span><strong className="font-semibold text-white">30 Tage</strong> volle Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-emerald-400 shrink-0 stroke-[2]" />
                    <span><strong className="font-semibold text-white">1-Klick WhatsApp Chat</strong> direkt zum Team</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-emerald-400 shrink-0 stroke-[2]" />
                    <span>Präsenz im Kiez-Filter & Stadtteil-Suche</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-emerald-400 shrink-0 stroke-[2]" />
                    <span><strong className="font-semibold text-white">Über 75% günstiger</strong> als andere Portale</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press flex items-center justify-center gap-2 w-full text-center py-4 px-5 rounded-2xl bg-white text-base font-semibold text-black hover:bg-zinc-100 transition-colors"
                >
                  <span>Standard Job inserieren</span>
                  <ArrowRight className="size-4 stroke-[2]" />
                </Link>
              </div>
            </div>

            {/* Extended Job */}
            <div className="rounded-3xl bg-zinc-50 p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  EXTENDED INSERAT
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-mono"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    24,99 €
                  </span>
                  <span className="text-sm text-zinc-600 font-normal">einmalig (60 Tage)</span>
                </div>
                <p className="mt-3 text-base text-zinc-600 font-normal leading-relaxed">
                  Für maximale Sichtbarkeit und langfristig suchende Betriebe.
                </p>
                <div className="w-full h-px bg-zinc-200 my-6" />
                <ul className="space-y-3.5 text-base text-zinc-700 font-normal">
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-black shrink-0 stroke-[2]" />
                    <span><strong className="font-semibold text-black">60 Tage</strong> doppelte Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-black shrink-0 stroke-[2]" />
                    <span><strong className="font-semibold text-black">Top-Platzierung</strong> ganz oben in der Liste</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-black shrink-0 stroke-[2]" />
                    <span>Hervorgehobenes Inserat-Badge</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-5 text-black shrink-0 stroke-[2]" />
                    <span>Direktkontakt per WhatsApp, Tel & Mail</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press block w-full text-center py-4 px-5 rounded-2xl bg-zinc-200 hover:bg-zinc-300 text-base font-semibold text-black transition-colors"
                >
                  Extended Job inserieren
                </Link>
              </div>
            </div>
          </div>

          {/* Strategic Competitor Comparison Matrix */}
          <CompetitorComparison />

          {/* Support & Enquiry Callout */}
          <div className="mt-12 rounded-3xl bg-zinc-50 p-8 text-center space-y-3">
            <h3 className="text-xl font-bold text-black">
              Fragen zu Inseraten oder Kooperationen?
            </h3>
            <p className="text-base text-zinc-600 font-normal max-w-xl mx-auto">
              Unser Support-Team hilft dir gerne bei der Veröffentlichung oder individuellen Anfragen:
            </p>
            <div className="pt-2">
              <a
                href="mailto:jobroofs@gmail.com"
                className="apple-press inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-base font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                <Mail className="size-4" />
                <span>jobroofs@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
