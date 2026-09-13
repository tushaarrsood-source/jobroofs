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
    <section className="my-12 rounded-3xl border border-[#d8ded9] bg-white p-6 sm:p-10 shadow-xs">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#202a31] text-[#fbfbf8] px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.18em]">
          <Sparkles className="size-3 text-amber-300" />
          <span>{isDe ? 'JOBROOFS VS. ANDERE PLATTFORMEN' : 'JOBROOFS VS. OTHER PLATFORMS'}</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#202a31] tracking-[-0.02em] leading-tight"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe
            ? 'Warum unabhängige Betriebe JOBROOFS wählen.'
            : 'Why independent businesses choose JOBROOFS.'}
        </h2>
        <p className="text-[13.5px] sm:text-[15px] text-[#5a6460] font-light leading-relaxed">
          {isDe
            ? 'Herkömmliche Jobportale sind entweder teuer, unpersönlich oder veraltet. JOBROOFS macht unabhängiges Inserieren schnell, günstig und direkt.'
            : 'Conventional job platforms are expensive, impersonal, or outdated. JOBROOFS makes independent hiring fast, affordable, and direct.'}
        </p>
      </div>

      {/* Comparison Table for Desktop */}
      <div className="mt-8 hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#d8ded9]">
              <th className="py-4 pr-4 font-normal text-[#7e8a84] w-1/4">
                {isDe ? 'Kriterium' : 'Feature'}
              </th>
              <th className="py-4 px-5 font-medium text-[#202a31] bg-[#fbfbf8] rounded-t-2xl border-x border-t border-[#d8ded9] w-2/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold tracking-tight text-[15px] text-[#202a31]">
                      JOBROOFS
                    </span>
                    <span className="rounded-full bg-emerald-600 text-white text-[9.5px] font-bold px-2 py-0.5 uppercase tracking-wide">
                      NEUER STANDARD
                    </span>
                  </div>
                </div>
              </th>
              <th className="py-4 pl-5 font-normal text-[#7e8a84] w-1/3">
                {isDe ? 'Andere Plattformen & Portale' : 'Other Platforms & Portals'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d8ded9]">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#fbfbf8]/50 transition-colors">
                <td className="py-4 pr-4 font-medium text-[#202a31]">
                  {row.feature}
                </td>
                <td className="py-4 px-5 font-medium text-[#202a31] bg-[#fbfbf8] border-x border-[#d8ded9]">
                  <div className="flex items-baseline justify-between gap-2">
                    <span>{row.jobroofs}</span>
                    <span className="shrink-0 text-[10px] font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-sm">
                      {row.jobroofsBadge}
                    </span>
                  </div>
                </td>
                <td className="py-4 pl-5 text-[#5a6460] font-light">
                  <div className="flex items-baseline justify-between gap-2">
                    <span>{row.otherPlatforms}</span>
                    <span className="shrink-0 text-[10px] font-medium text-[#7e8a84] bg-[#f4f4ee] px-2 py-0.5 rounded-sm">
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
            className="rounded-2xl border border-[#d8ded9] bg-[#fbfbf8] p-4 space-y-2.5"
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#7e8a84]">
              {row.feature}
            </div>
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wide">
                  JOBROOFS
                </span>
                <span className="text-[9.5px] font-medium text-emerald-800 bg-emerald-200/60 px-1.5 py-0.5 rounded-sm">
                  {row.jobroofsBadge}
                </span>
              </div>
              <p className="mt-1 text-[13px] font-medium text-emerald-950">
                {row.jobroofs}
              </p>
            </div>
            <div className="rounded-xl border border-[#d8ded9] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#7e8a84] uppercase tracking-wide">
                  {isDe ? 'Andere Plattformen' : 'Other Platforms'}
                </span>
                <span className="text-[9.5px] text-[#7e8a84] bg-[#f4f4ee] px-1.5 py-0.5 rounded-sm">
                  {row.otherBadge}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-[#5a6460] font-light">
                {row.otherPlatforms}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Mission & Support Banner */}
      <div className="mt-8 pt-6 border-t border-[#d8ded9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
            <ShieldCheck className="size-5 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#202a31]">
              Empowering Independent Listers across Germany
            </p>
            <p className="text-[12px] text-[#7e8a84] font-light">
              {isDe
                ? 'Inserieren soll für jeden Betrieb und jede Privatperson einfach & günstig sein.'
                : 'Listing must be effortless, fast, and affordable for everyone.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:jobroofs@gmail.com"
            className="apple-press inline-flex items-center gap-1.5 text-[12.5px] text-[#5a6460] hover:text-[#202a31] border border-[#d8ded9] rounded-xl px-3.5 py-2 transition-colors cursor-pointer bg-white"
          >
            <Mail className="size-3.5" />
            <span>jobroofs@gmail.com</span>
          </a>
          <Link
            href="/post-a-job"
            className="apple-press inline-flex items-center gap-2 rounded-xl bg-[#202a31] px-5 py-2 text-[12.5px] font-medium text-[#fbfbf8] hover:bg-[#161D22] transition-colors cursor-pointer"
          >
            <span>{isDe ? 'Jetzt 1. Job kostenlos inserieren' : 'Post 1st Job for Free'}</span>
            <ArrowRight className="size-3.5 stroke-[1.5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}

