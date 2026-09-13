'use client';

import Link from '@/components/ui/link';
import {
  Check,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export function CompetitorComparison() {
  const { isDe } = useTranslation();

  const comparisonData = [
    {
      feature: isDe ? 'Preise für Betriebe' : 'Pricing for Employers',
      jobroofs: isDe ? '1. Job 0 € (Gratis) · Danach ab 14,99 €' : '1st Job Free (0 €) · Then from 14.99 €',
      jobroofsBadge: isDe ? 'Fair & Bezahlbar' : 'Fair & Affordable',
      otherPlatforms: isDe ? '70 € bis über 500 € pro Einzelanzeige' : '70 € to 500 €+ per single listing',
      otherBadge: isDe ? 'Teuer & Starre Verträge' : 'Expensive & Rigid',
    },
    {
      feature: isDe ? 'Private Inserate (Nachhilfe, Babysitter, Hilfe)' : 'Private Gigs (Tutoring, Babysitting, Help)',
      jobroofs: isDe ? 'Dauerhaft 0 € (Kostenlos & sofort live)' : 'Permanently 0 € (Free & instant live)',
      jobroofsBadge: isDe ? 'Sofort online' : 'Instant live',
      otherPlatforms: isDe ? 'Wartezeiten, Freigabeschleifen oder voller Spam' : 'Review delays, paywalls, or spam',
      otherBadge: isDe ? 'Unflexibel' : 'Inflexible',
    },
    {
      feature: isDe ? 'Direktkontakt & Bewerbung' : 'Direct Contact & Application',
      jobroofs: isDe ? '1-Klick WhatsApp Chat · Tel · Mail' : '1-Click WhatsApp Chat · Phone · Email',
      jobroofsBadge: isDe ? 'Antwort in Min.' : 'Reply in mins',
      otherPlatforms: isDe ? 'Veraltete Formulare oder 5-stufige ATS-Systeme' : 'Outdated email forms or complex ATS portals',
      otherBadge: isDe ? 'Wochenlange Wartezeit' : 'Weeks of waiting',
    },
    {
      feature: isDe ? 'Reichweite & Städte' : 'Geographic Coverage',
      jobroofs: isDe ? 'Ganz Deutschland mit Stadtteil- & Kiez-Genauigkeit' : 'Entire Germany with district-level accuracy',
      jobroofsBadge: isDe ? 'Bundesweit vernetzt' : 'Nationwide',
      otherPlatforms: isDe ? 'Entweder auf eine Stadt beschränkt oder lokale Betriebe gehen unter' : 'Either restricted to one city or local spots get lost',
      otherBadge: isDe ? 'Kein Kiez-Fokus' : 'No neighborhood focus',
    },
    {
      feature: isDe ? 'Fokus & Zielgruppe' : 'Target & Focus',
      jobroofs: isDe ? '100% Unabhängige Betriebe, Cafés, Macher & Nachbarn' : '100% Independent Businesses, Cafés & Creators',
      jobroofsBadge: isDe ? '0% Zeitarbeit' : '0% Temp agencies',
      otherPlatforms: isDe ? 'Dominiert von Großkonzernen, Zeitarbeit & Headhuntern' : 'Dominated by corporations, agencies & headhunters',
      otherBadge: isDe ? 'Überlaufen' : 'Overcrowded',
    },
    {
      feature: isDe ? 'Bedienung & Design' : 'User Experience & Design',
      jobroofs: isDe ? 'Minimalistisches Apple/Editorial Design (Mobile-First)' : 'Minimalist Apple/Editorial Design (Mobile-First)',
      jobroofsBadge: isDe ? 'In 60 Sek. live' : 'Live in 60s',
      otherPlatforms: isDe ? 'Veraltete 2000er-Tabellen oder überladene Banner' : 'Outdated 2000s tables or ad-heavy clutter',
      otherBadge: isDe ? 'Schlechte UX' : 'Poor UX',
    },
  ];

  return (
    <section className="my-12 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-black text-white px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] font-bold shadow-xs">
          <Sparkles className="size-3.5 text-amber-400" />
          <span>{isDe ? 'JOBROOFS VS. ANDERE PLATTFORMEN' : 'JOBROOFS VS. OTHER PLATFORMS'}</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-[-0.025em] leading-tight"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe
            ? 'Warum unabhängige Betriebe JOBROOFS wählen.'
            : 'Why independent businesses choose JOBROOFS.'}
        </h2>
        <p className="text-[14px] sm:text-[15.5px] text-zinc-700 font-normal leading-relaxed">
          {isDe
            ? 'Herkömmliche Jobportale sind entweder teuer, unpersönlich oder veraltet. JOBROOFS macht unabhängiges Inserieren schnell, günstig und direkt.'
            : 'Conventional job platforms are expensive, impersonal, or outdated. JOBROOFS makes independent hiring fast, affordable, and direct.'}
        </p>
      </div>

      {/* Comparison Table for Desktop */}
      <div className="mt-8 hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="py-4 pr-4 font-mono text-[11px] font-bold text-zinc-600 uppercase tracking-wider w-1/4">
                {isDe ? 'Kriterium' : 'Feature'}
              </th>
              <th className="py-4 px-5 font-bold text-black bg-zinc-50 rounded-t-2xl border-x border-t border-zinc-200 w-2/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold tracking-tight text-[16px] text-black">
                      JOBROOFS
                    </span>
                    <span className="rounded-full bg-emerald-600 text-white text-[9.5px] font-bold px-2 py-0.5 uppercase tracking-wide">
                      NEUER STANDARD
                    </span>
                  </div>
                </div>
              </th>
              <th className="py-4 pl-5 font-medium text-zinc-600 w-1/3">
                {isDe ? 'Andere Plattformen & Portale' : 'Other Platforms & Portals'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-4 pr-4 font-semibold text-black">
                  {row.feature}
                </td>
                <td className="py-4 px-5 font-bold text-black bg-zinc-50/70 border-x border-zinc-200">
                  <div className="flex items-baseline justify-between gap-2">
                    <span>{row.jobroofs}</span>
                    <span className="shrink-0 text-[10.5px] font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-md">
                      {row.jobroofsBadge}
                    </span>
                  </div>
                </td>
                <td className="py-4 pl-5 text-zinc-600 font-normal">
                  <div className="flex items-baseline justify-between gap-2">
                    <span>{row.otherPlatforms}</span>
                    <span className="shrink-0 text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                      {row.otherBadge}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison Cards for Mobile */}
      <div className="mt-8 space-y-4 md:hidden">
        {comparisonData.map((row, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-2.5 shadow-2xs"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600">
              {row.feature}
            </div>
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-bold text-emerald-950 uppercase tracking-wide">
                  JOBROOFS
                </span>
                <span className="text-[9.5px] font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  {row.jobroofsBadge}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] font-bold text-emerald-950">
                {row.jobroofs}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-600 uppercase tracking-wide font-semibold">
                  {isDe ? 'Andere Plattformen' : 'Other Platforms'}
                </span>
                <span className="text-[9.5px] font-medium text-zinc-600 bg-zinc-200/80 px-2 py-0.5 rounded-md">
                  {row.otherBadge}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-zinc-600 font-normal">
                {row.otherPlatforms}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Mission & Support Banner */}
      <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
            <ShieldCheck className="size-5 stroke-[2]" />
          </div>
          <div>
            <p className="text-[13.5px] font-bold text-black">
              Empowering Independent Listers across Germany
            </p>
            <p className="text-[12.5px] text-zinc-600 font-normal">
              {isDe
                ? 'Inserieren soll für jeden Betrieb und jede Privatperson einfach & günstig sein.'
                : 'Listing must be effortless, fast, and affordable for everyone.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:jobroofs@gmail.com"
            className="apple-press inline-flex items-center gap-1.5 text-[13px] text-black hover:text-black border border-zinc-300 hover:border-black rounded-xl px-4 py-2 font-medium transition-colors cursor-pointer bg-white shadow-2xs"
          >
            <Mail className="size-3.5 stroke-[1.5]" />
            <span>jobroofs@gmail.com</span>
          </a>
          <Link
            href="/post-a-job"
            className="apple-press inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
          >
            <span>{isDe ? 'Jetzt 1. Job kostenlos inserieren' : 'Post 1st Job for Free'}</span>
            <ArrowRight className="size-3.5 stroke-[2]" />
          </Link>
        </div>
      </div>
    </section>
  );
}

