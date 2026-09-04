import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { BriefcaseBusiness, Home, ArrowRight, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Inserat aufgeben — Job oder Wohnung inserieren · JOBROOFS Berlin',
  description:
    'Wähle deine Kategorie: Stellenanzeige für flexible Minijobs schalten oder Wohnung/WG-Zimmer in Berlin inserieren. 30 Tage Laufzeit.',
  alternates: {
    canonical: '/post',
  },
};

export default function PostChooserPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
              Was möchtest du inserieren?
            </h1>
            <p className="mt-2 text-sm text-[#86868b] leading-relaxed sm:text-base">
              Erreiche tausende Berliner Minijobber, Aushilfen und Wohnungssuchende.
              30 Tage Laufzeit — kein Abo, 100% Direktkontakt.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Option 1: Job */}
            <div className="flex flex-col justify-between rounded-[24px] border border-black/[0.06] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-black/[0.12] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-black/[0.04] text-[#1d1d1f]">
                  <BriefcaseBusiness className="size-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">
                  Stellenanzeige / Job
                </h2>
                <p className="mt-2 text-xs text-[#86868b] leading-relaxed">
                  Finde Minijobber (603 €), Baristas, Kellner, Kuriere, Eventhelfer oder Werkstudenten in deinem Kiez.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-[#86868b]">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 30 Tage (29 €) oder 60 Tage (49 €) auf JOBROOFS Kiezkarte
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Direkte Bewerbungen per E-Mail oder Link
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 0 % Provision / keine Personalagentur
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-black/[0.04] pt-5 flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-semibold text-[#1d1d1f]">
                    ab 29 € · 30 / 60 Tage
                  </span>
                  <span className="block text-[10px] text-[#86868b] mt-0.5">Kein Abo · Einmalzahlung</span>
                </div>
                <Link
                  href="/post-a-job"
                  className="apple-btn-primary"
                >
                  <span>Job inserieren</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Option 2: Housing */}
            <div className="flex flex-col justify-between rounded-[24px] border border-black/[0.06] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-black/[0.12] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-black/[0.04] text-[#1d1d1f]">
                  <Home className="size-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-[#1d1d1f]">
                  Wohnung / WG-Zimmer
                </h2>
                <p className="mt-2 text-xs text-[#86868b] leading-relaxed">
                  Finde verlässliche Nachmieter, Zwischenmieter oder WG-Mitbewohner in Berlin ohne Maklergebühren.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-[#86868b]">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 30 Tage (29 €) oder 60 Tage (49 €) · Kiezkarte & Liste
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Anmeldung & Wohnungsgeberbestätigung Flag
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 100% Direktkontakt ohne Maklerprovision
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-black/[0.04] pt-5 flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-semibold text-[#1d1d1f]">
                    ab 29 € · 30 / 60 Tage
                  </span>
                  <span className="block text-[10px] text-[#86868b] mt-0.5">Kein Abo · Einmalzahlung</span>
                </div>
                <Link
                  href="/wohnen/list"
                  className="apple-btn-primary"
                >
                  <span>Wohnung inserieren</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
