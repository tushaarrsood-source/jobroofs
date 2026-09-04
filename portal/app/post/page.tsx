import type { Metadata } from 'next';
import Link from 'next/link';
import { BriefcaseBusiness, Home, ArrowRight, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Inserat aufgeben — Job oder Wohnung inserieren · KIEZJOB Berlin',
  description:
    'Wähle deine Kategorie: Stellenanzeige für flexible Minijobs schalten oder Wohnung/WG-Zimmer in Berlin inserieren. 29 € für 30 Tage.',
  alternates: {
    canonical: '/post',
  },
};

export default function PostChooserPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <SiteHeader />

        <main className="mx-auto max-w-4xl px-5 py-10 md:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[0.98]">
              WAS MÖCHTEST DU INSERIEREN?
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed sm:text-base">
              Erreiche tausende Berliner Minijobber, Aushilfen und Wohnungssuchende.
              Einmalig 29 € für 30 Tage Laufzeit — kein Abo, kein Vermittler.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Option 1: Job */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-blue-600 transition duration-150">
              <div>
                <div className="grid size-11 place-items-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                  <BriefcaseBusiness className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
                  Stellenanzeige / Job
                </h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Finde Minijobber (603 €), Baristas, Kellner, Kuriere, Eventhelfer oder Werkstudenten in deinem Kiez.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 30 Tage aktiv auf KIEZJOB & OpenStreetMap
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Direkte Bewerbungen per E-Mail oder Link
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 0 % Provision / keine Personalagentur
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-5 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black font-mono text-slate-900">29 €</span>
                  <span className="block text-[10px] text-slate-400">einmalig / 30 Tage</span>
                </div>
                <Link
                  href="/post-a-job"
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-blue-600 px-5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                >
                  <span>Job inserieren</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Option 2: Housing */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-emerald-600 transition duration-150">
              <div>
                <div className="grid size-11 place-items-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <Home className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
                  Wohnung / WG-Zimmer
                </h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Finde verlässliche Nachmieter, Zwischenmieter oder WG-Mitbewohner in Berlin ohne Maklergebühren.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-500">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 30 Tage aktiv · Geprüft gegen Fake-Profile
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> Anmeldung & Wohnungsgeberbestätigung Flag
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> 100% Direktkontakt ohne Maklerprovision
                  </li>
                </ul>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-5 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black font-mono text-slate-900">29 €</span>
                  <span className="block text-[10px] text-slate-400">einmalig / 30 Tage</span>
                </div>
                <Link
                  href="/wohnen/list"
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition hover:bg-black shadow-sm"
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
