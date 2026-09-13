'use client';

import Link from '@/components/ui/link';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
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
    <section className="my-10">
      {/* Header */}
      <div className="max-w-2xl mb-6">
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.2em] font-bold text-zinc-600 mb-2">
          <Sparkles className="size-3 text-amber-500" />
          <span>{isDe ? 'JOBROOFS VS. ANDERE PLATTFORMEN' : 'JOBROOFS VS. OTHER PLATFORMS'}</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-bold text-black tracking-tight leading-snug"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe
            ? 'Der Unterschied im Detail.'
            : 'The difference in detail.'}
        </h2>
        <p className="mt-1.5 text-[14px] text-zinc-600 font-normal leading-relaxed">
          {isDe
            ? 'Ein transparenter, faktenbasierter Vergleich der Konditionen, Vermittlungsmodelle und Bewerbungswege in Deutschland.'
            : 'A transparent, fact-based comparison of pricing, hiring models, and applicant communication in Germany.'}
        </p>
      </div>

      {/* Responsive Clean Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <table className="w-full border-collapse text-left text-[13px] min-w-[620px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/70">
              <th className="py-3 px-4 font-mono text-[10.5px] font-bold text-zinc-600 uppercase tracking-wider w-1/4">
                {isDe ? 'Kriterium' : 'Feature'}
              </th>
              <th className="py-3 px-4 font-bold text-black bg-zinc-100/70 border-x border-zinc-200 w-2/5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-extrabold text-black">JOBROOFS</span>
                  <span className="font-mono text-[9px] bg-black text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    DIREKT
                  </span>
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-zinc-600 w-1/3">
                {isDe ? 'Andere Plattformen' : 'Other Platforms'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-black">
                  {row.feature}
                </td>
                <td className="py-3.5 px-4 font-medium text-black bg-zinc-50/40 border-x border-zinc-200">
                  <div className="font-semibold text-black">{row.jobroofs}</div>
                  <div className="text-[11px] text-emerald-800 font-mono font-medium mt-0.5">
                    ✓ {row.jobroofsNote}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-zinc-700 font-normal">
                  <div>{row.otherPlatforms}</div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    — {row.otherNote}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Minimal Footer Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-zinc-600">
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
          className="apple-press inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-2xs"
        >
          <span>{isDe ? 'Job inserieren' : 'Post a Job'}</span>
          <ArrowRight className="size-3.5 stroke-[2]" />
        </Link>
      </div>
    </section>
  );
}

