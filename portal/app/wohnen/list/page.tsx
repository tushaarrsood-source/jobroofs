import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { HousingListingForm } from '@/components/housing-listing-form';

export const metadata: Metadata = {
  title: 'Wohnung oder WG-Zimmer in Berlin inserieren (29 € / 30 Tage)',
  description:
    'Inseriere dein Zimmer, deine Zwischenmiete oder Wohnung in Berlin. 29 € für 30 Tage schützt vor Spam & Betrügern und garantiert echte Interessenten.',
  alternates: {
    canonical: '/wohnen/list',
  },
};

export default function HousingListPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#18221e]">
      <SiteHeader />

      <div className="mx-auto max-w-4xl px-5 py-8 md:px-10 md:py-12">
        <Link
          href="/wohnen"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Zurück zu allen Angeboten
        </Link>

        <div className="mt-6 border-b border-foreground/15 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c7d8cc] bg-[#e2f3e6] px-3 py-1 text-xs font-semibold text-[#285a39]">
            <ShieldCheck className="size-3.5" />
            29 € Einstellgebühr · 100% vor Fake-Interessenten geschützt
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-[#18221e] md:text-5xl">
            Wohnung oder WG-Zimmer inserieren
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Erreiche tausende verifizierte Studierende, Praktikanten und Wohnungssuchende in Berlin.
            Dein Inserat bleibt 30 Tage aktiv.
          </p>
        </div>

        <div className="mt-8">
          <HousingListingForm />
        </div>
      </div>
    </main>
  );
}
