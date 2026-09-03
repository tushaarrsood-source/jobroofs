'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/language-context';

export function SiteFooter() {
  const { isDe } = useTranslation();

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Purpose Col */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-zinc-950">
                KIEZJOB
              </span>
              <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                · BERLIN
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 max-w-sm">
              {isDe
                ? 'Das unabhängige Berliner Schwarze Brett für flexible Jobs, Minijobs (538 €), Teilzeitstellen und Kiez-Wohnungen. 100% Direktkontakt ohne Agenturen oder Vermittlungsgebühren.'
                : 'The independent Berlin bulletin board for flexible work, minijobs, part-time shifts and neighbourhood housing. 100% direct contact with zero broker fees.'}
            </p>
            <div className="pt-2">
              <p className="text-[11px] text-zinc-400 leading-snug max-w-sm">
                {isDe
                  ? 'Reines Schwarzes Brett / Anzeigenportal. KIEZJOB ist kein Makler, Vermieter oder Arbeitgeber und haftet nicht für Miet-, Arbeitsverträge oder Zahlungen.'
                  : 'Classifieds directory only. KIEZJOB is not a broker, landlord, or employer and assumes zero liability for tenancy agreements, job contracts, or payments.'}
              </p>
            </div>
          </div>

          {/* Districts Col */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-3">
              {isDe ? 'Berliner Bezirke' : 'Berlin Districts'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/?district=kreuzberg" className="hover:text-zinc-950 transition-colors">
                  Kreuzberg
                </Link>
              </li>
              <li>
                <Link href="/?district=friedrichshain" className="hover:text-zinc-950 transition-colors">
                  Friedrichshain
                </Link>
              </li>
              <li>
                <Link href="/?district=neukölln" className="hover:text-zinc-950 transition-colors">
                  Neukölln
                </Link>
              </li>
              <li>
                <Link href="/?district=mitte" className="hover:text-zinc-950 transition-colors">
                  Mitte & Tiergarten
                </Link>
              </li>
              <li>
                <Link href="/?district=prenzlauer%20berg" className="hover:text-zinc-950 transition-colors">
                  Prenzlauer Berg
                </Link>
              </li>
              <li>
                <Link href="/?district=schöneberg" className="hover:text-zinc-950 transition-colors">
                  Schöneberg
                </Link>
              </li>
              <li>
                <Link href="/?district=wedding" className="hover:text-zinc-950 transition-colors">
                  Wedding & Moabit
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-3">
              {isDe ? 'Bereiche' : 'Categories'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categories/temp-shifts" className="hover:text-zinc-950 transition-colors">
                  {isDe ? 'Minijobs (538 €)' : 'Minijobs (€538)'}
                </Link>
              </li>
              <li>
                <Link href="/categories/gastronomy" className="hover:text-zinc-950 transition-colors">
                  {isDe ? 'Gastronomie & Bar' : 'Hospitality & Bar'}
                </Link>
              </li>
              <li>
                <Link href="/categories/events" className="hover:text-zinc-950 transition-colors">
                  {isDe ? 'Events & Festivals' : 'Events & Festivals'}
                </Link>
              </li>
              <li>
                <Link href="/categories/retail" className="hover:text-zinc-950 transition-colors">
                  {isDe ? 'Verkauf & Retail' : 'Retail & Sales'}
                </Link>
              </li>
              <li>
                <Link href="/wohnen" className="hover:text-zinc-950 transition-colors font-semibold text-zinc-900">
                  {isDe ? 'Wohnen & WG-Zimmer' : 'Housing & Flatshares'}
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="hover:text-zinc-950 transition-colors">
                  {isDe ? 'Job inserieren (29 €)' : 'Post a Job (€29)'}
                </Link>
              </li>
              <li>
                <Link href="/wohnen/list" className="hover:text-zinc-950 transition-colors">
                  {isDe ? 'Wohnung inserieren (29 €)' : 'List Housing (€29)'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider mb-3">
              {isDe ? 'Rechtliches' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/impressum" className="hover:text-zinc-950 transition-colors">
                  Impressum (§ 5 DDG)
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-zinc-950 transition-colors">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-zinc-950 transition-colors">
                  AGB (Nutzungsbedingungen)
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-zinc-950 transition-colors">
                  {isDe ? 'Haftungsausschluss' : 'Liability Disclaimer'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KIEZJOB Berlin. Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-2">
            <span>100% DSGVO-konform</span>
            <span>·</span>
            <span>Made in Berlin</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
