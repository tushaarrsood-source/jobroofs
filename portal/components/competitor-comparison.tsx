'use client';

import Link from '@/components/ui/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export function CompetitorComparison() {
  const { isDe } = useTranslation();

  const comparisonData = [
    {
      feature: isDe ? 'Preise für Betriebe' : 'Pricing for Employers',
      jobroofs: isDe ? '1. Job 0 € · danach ab 14,99 € (einmalig)' : '1st Job Free (0 €) · then from €14.99 (one-time)',
      jobroofsNote: isDe ? 'Kein Abo' : 'No subscription',
      otherPlatforms: isDe ? '70 € bis über 500 € pro Anzeige' : '€70 to €500+ per listing',
      otherNote: isDe ? 'Teuer & starre Verträge' : 'Expensive & rigid',
    },
    {
      feature: isDe ? 'Bewerbung & Kontakt' : 'Contact & Applying',
      jobroofs: isDe ? '1-Klick WhatsApp, Telefon oder E-Mail direkt zum Betrieb' : '1-Click WhatsApp, phone, or email direct to employer',
      jobroofsNote: isDe ? '100% Direkt' : '100% Direct',
      otherPlatforms: isDe ? 'Bewerbungsformulare, CV-Pflicht & ATS-Portale' : 'Multi-step forms, mandatory CVs & ATS portals',
      otherNote: isDe ? 'Hohe Bewerbungsbarriere' : 'High application friction',
    },
    {
      feature: isDe ? 'Zeitarbeit & Vermittler' : 'Staffing Agencies',
      jobroofs: isDe ? '0% Zeitarbeit – nur echte, lokale Betriebe & Inserenten' : '0% Temp agencies — only genuine employers',
      jobroofsNote: isDe ? 'Echte Arbeitgeber' : 'Direct employers',
      otherPlatforms: isDe ? 'Häufig dominiert von Zeitarbeitsfirmen & Vermittlern' : 'Often dominated by staffing & temp agencies',
      otherNote: isDe ? 'Überlaufen' : 'Agency dominated',
    },
    {
      feature: isDe ? 'Vertragsbindung' : 'Contract & Commitment',
      jobroofs: isDe ? 'Kein Abonnement, keine automatische Verlängerung' : 'No recurring subscription, no auto-renewal',
      jobroofsNote: isDe ? 'Volle Kostenkontrolle' : 'Full cost control',
      otherPlatforms: isDe ? 'Oft automatische Verlängerungen & Kündigungsfristen' : 'Often auto-renewing subscriptions or lock-ins',
      otherNote: isDe ? 'Abo-Fallen' : 'Recurring lock-in',
    },
    {
      feature: isDe ? 'Fokus & Stellenarten' : 'Focus & Job Types',
      jobroofs: isDe ? 'Minijobs, Aushilfen, Teilzeit & flexible Kiez-Jobs' : 'Minijobs, temp gigs, part-time & flexible local work',
      jobroofsNote: isDe ? 'Kiez & Flexibel' : 'Local & flexible',
      otherPlatforms: isDe ? 'Primär Vollzeit-Bürostellen & Konzernkarrieren' : 'Primarily full-time corporate office positions',
      otherNote: isDe ? 'Konzernfokus' : 'Corporate focus',
    },
    {
      feature: isDe ? 'Standortgenauigkeit' : 'Location Accuracy',
      jobroofs: isDe ? 'Ganz Deutschland mit Stadtteil- und Bezirksfilterung' : 'Entire Germany with district-level filtering',
      jobroofsNote: isDe ? 'Kiezgenau' : 'District precision',
      otherPlatforms: isDe ? 'Großraum-Suche ohne Stadtteilbezug' : 'Metro search without neighborhood granularity',
      otherNote: isDe ? 'Ungenau' : 'Broad metro only',
    },
  ];

  return (
    <section className="my-12 sm:my-16">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black tracking-tight leading-tight"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe ? 'JOBROOFS vs. andere Plattformen' : 'JOBROOFS vs. other platforms'}
        </h2>
      </div>

      {/* Open, Borderless Table on White Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[620px]">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider w-1/4">
                {isDe ? 'Kriterium' : 'Feature'}
              </th>
              <th className="py-3.5 px-4 text-base font-bold text-black w-2/5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight">JOBROOFS</span>
                  <span className="text-[11px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    DIREKT
                  </span>
                </div>
              </th>
              <th className="py-3.5 px-4 text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wider w-1/3">
                {isDe ? 'Andere Plattformen' : 'Other Platforms'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                <td className="py-4 sm:py-5 px-3 text-base font-semibold text-black align-top">
                  {row.feature}
                </td>
                <td className="py-4 sm:py-5 px-4 align-top">
                  <div className="text-base sm:text-[17px] font-semibold text-black leading-snug">
                    {row.jobroofs}
                  </div>
                  <div className="text-sm text-emerald-800 font-medium mt-1">
                    ✓ {row.jobroofsNote}
                  </div>
                </td>
                <td className="py-4 sm:py-5 px-4 text-zinc-700 align-top">
                  <div className="text-base sm:text-[17px] font-normal leading-snug text-zinc-700">
                    {row.otherPlatforms}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1">
                    — {row.otherNote}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Minimal Open Footer Row */}
      <div className="mt-6 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-base text-zinc-600">
        <div>
          <span>{isDe ? 'Fragen oder individueller Bedarf?' : 'Questions or custom requests?'} </span>
          <a
            href="mailto:jobroofs@gmail.com"
            className="font-semibold text-black underline hover:text-zinc-700 ml-1"
          >
            jobroofs@gmail.com
          </a>
        </div>

        <Link
          href="/post-a-job"
          className="apple-press inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-base font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
        >
          <span>{isDe ? 'Job jetzt inserieren' : 'Post a Job'}</span>
          <ArrowRight className="size-4 stroke-[2]" />
        </Link>
      </div>
    </section>
  );
}

