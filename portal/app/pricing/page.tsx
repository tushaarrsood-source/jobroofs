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
    <main className="min-h-screen bg-[#fafaf9] text-black flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Preise & Tarife', href: '/pricing' },
          ]}
        />
        <SiteHeader />

        <div className="mx-auto max-w-5xl px-4 sm:px-5 md:px-6 py-10 md:py-14">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-light sm:font-normal tracking-[-0.025em] text-black leading-tight"
              style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              Faire Konditionen für unabhängige Betriebe in ganz Deutschland.
            </h1>
            <p className="text-sm md:text-base text-zinc-700 font-light leading-relaxed">
              Für Jobsuchende dauerhaft <strong className="text-black font-medium">100% kostenlos</strong>.
              Für Betriebe bis zu <strong>75% günstiger als andere Plattformen</strong> — inklusive 1-Klick WhatsApp Direktkontakt.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free / Private Job */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 flex flex-col justify-between transition-shadow hover:shadow-xs">
              <div>
                <div className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-emerald-800">
                  ERSTINSERAT & PRIVAT
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-normal tracking-tight text-emerald-900"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    0 €
                  </span>
                  <span className="text-xs text-zinc-600 font-light">dauerhaft privat / 1. Job gratis</span>
                </div>
                <p className="mt-2 text-[13px] text-zinc-700 font-light leading-relaxed">
                  Perfekt für Nachhilfe, Babysitting, Umzugshilfe oder das allererste Inserat deines Kiez-Betriebs.
                </p>
                <div className="w-full h-px bg-zinc-200 my-6" />
                <ul className="space-y-3 text-[13px] text-zinc-700 font-light">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-600 shrink-0 stroke-[1.5]" />
                    <span><strong>15 Tage</strong> aktive Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-600 shrink-0 stroke-[1.5]" />
                    <span><strong>100% Direktkontakt</strong> per WhatsApp & E-Mail</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-600 shrink-0 stroke-[1.5]" />
                    <span>Sofort live <strong>ohne Zahlungsdaten</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-500">
                    <span>(Andere Portale verlangen oft über 70 € für gewerbliche Anzeigen)</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press block w-full text-center py-3 px-4 rounded-xl border border-emerald-300 bg-emerald-50 text-[13px] font-medium text-emerald-900 hover:bg-emerald-100 transition-colors"
                >
                  Kostenlos inserieren
                </Link>
              </div>
            </div>

            {/* Standard Job */}
            <div className="rounded-2xl border-2 border-black bg-white p-7 relative flex flex-col justify-between shadow-xs">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3.5 py-0.5 text-[10px] font-mono font-medium text-white uppercase tracking-[0.16em]">
                EMPFOHLEN &middot; BESTE PREISLEISTUNG
              </div>
              <div>
                <div className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-black">
                  STANDARD INSERAT
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-normal tracking-tight text-black"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    14,99 €
                  </span>
                  <span className="text-xs text-zinc-600 font-light">einmalig inkl. MwSt. (über 75% günstiger als andere Portale)</span>
                </div>
                <p className="mt-2 text-[13px] text-zinc-700 font-light leading-relaxed">
                  Ideal für Cafés, Bars, Kiez-Läden, Handwerker und Ateliers mit regulärem Einstellungsbedarf.
                </p>
                <div className="w-full h-px bg-zinc-200 my-6" />
                <ul className="space-y-3 text-[13px] text-zinc-700 font-light">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span><strong>30 Tage</strong> volle Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span><strong>1-Klick WhatsApp Chat</strong> für höchste Rücklaufquote</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span>Präsenz im Kiez-Filter & Stadtteil-Suche</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span><strong>Über 75% günstiger</strong> als andere Portale</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press flex items-center justify-center gap-2 w-full text-center py-3 px-4 rounded-xl bg-black text-[13px] font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  <span>Standard Job inserieren</span>
                  <ArrowRight className="size-3.5 stroke-[1.5]" />
                </Link>
              </div>
            </div>

            {/* Extended Job */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-600">
                  EXTENDED INSERAT
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-normal tracking-tight text-black"
                    style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    24,99 €
                  </span>
                  <span className="text-xs text-zinc-600 font-light">einmalig inkl. MwSt. (60 Tage)</span>
                </div>
                <p className="mt-2 text-[13px] text-zinc-700 font-light leading-relaxed">
                  Für maximale Sichtbarkeit und langfristig suchende Betriebe.
                </p>
                <div className="w-full h-px bg-zinc-200 my-6" />
                <ul className="space-y-3 text-[13px] text-zinc-700 font-light">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span><strong>60 Tage</strong> doppelte Laufzeit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span><strong>Top-Platzierung</strong> ganz oben in der Liste</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span>Hervorgehobenes Inserat-Badge</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-black shrink-0 stroke-[1.5]" />
                    <span>Direktkontakt per WhatsApp, Tel & Mail</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <Link
                  href="/post-a-job"
                  className="apple-press block w-full text-center py-3 px-4 rounded-xl border border-zinc-200 text-[13px] font-medium text-black hover:bg-zinc-100 transition-colors"
                >
                  Extended Job inserieren
                </Link>
              </div>
            </div>
          </div>

          {/* Strategic Competitor Comparison Matrix */}
          <CompetitorComparison />

          {/* Support & Enquiry Callout */}
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 text-center space-y-2">
            <h3 className="text-[15px] font-medium text-black">
              Fragen zu Inseraten oder Kooperationen?
            </h3>
            <p className="text-[13px] text-zinc-700 font-light max-w-xl mx-auto">
              Unser Support-Team hilft dir gerne bei der Veröffentlichung oder individuellen Anfragen:
            </p>
            <div className="pt-2">
              <a
                href="mailto:jobroofs@gmail.com"
                className="apple-press inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[13px] font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                <Mail className="size-3.5" />
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
