import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HousingListingForm } from '@/components/housing-listing-form';

export const metadata = {
  title: 'Wohnung oder WG-Zimmer in Berlin inserieren (29 € / 30 Tage)',
  description:
    'Inseriere dein Zimmer, deine Zwischenmiete oder Wohnung in Berlin. 29 € für 30 Tage — direkter Marktplatz für Wohnungssuchende.',
  alternates: {
    canonical: '/wohnen/list',
  },
};

export default function HousingListPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <SiteHeader />

        <div className="mx-auto max-w-4xl px-5 py-8 md:px-10 md:py-12">
          <Link
            href="/wohnen"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition hover:text-zinc-950"
          >
            <ArrowLeft className="size-3.5" />
            Zurück zu allen Angeboten
          </Link>

          <div className="mt-5 border-b border-zinc-200 pb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-900">
              <ShieldCheck className="size-3.5 text-emerald-700" />
              29 € Einstellgebühr · 100% vor Fake-Interessenten geschützt
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
              Wohnung oder WG-Zimmer inserieren
            </h1>
            <p className="mt-1.5 text-xs text-zinc-500 max-w-2xl leading-relaxed">
              Erreiche tausende verifizierte Studierende, Praktikanten und Wohnungssuchende in Berlin.
              Dein Inserat bleibt 30 Tage aktiv. Direktkontakt per E-Mail ohne Maklerprovision.
            </p>
          </div>

          <div className="mt-8">
            <HousingListingForm />
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
