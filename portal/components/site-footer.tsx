'use client';

import Link from '@/components/ui/link';
import { useTranslation } from '@/lib/i18n/language-context';

export function SiteFooter() {
  const { isDe } = useTranslation();

  return (
    <footer className="bg-[#111816] text-[#8fa099] border-t border-black/10 mt-20">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand Col */}
          <div className="sm:col-span-1">
            <Link href="/" className="inline-flex items-baseline gap-2 text-white">
              <span className="text-xl font-extrabold tracking-tight">
                KIEZJOB<span className="text-[#34d399]">.</span>
              </span>
              <span className="text-[11px] font-bold text-[#8fa099] uppercase tracking-widest">
                Berlin
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-[#8fa099]">
              {isDe
                ? 'Das moderne Berliner Portal für Studierende, Minijobs und Aushilfsjobs. 100% Direktkontakt ohne Zeitarbeit und ohne Vermittlungsgebühren.'
                : 'The modern Berlin portal for students, minijobs, and part-time jobs. 100% direct contact without temp agencies.'}
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-[11px] font-extrabold text-white uppercase tracking-widest mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Alle 1.600 Stellenangebote
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="text-[#34d399] font-semibold hover:underline">
                  + Job in Berlin schalten
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-white transition-colors">
                  Kontakt & Impressum
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-[11px] font-extrabold text-white uppercase tracking-widest mb-3">
              Rechtliches
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-white transition-colors">
                  Allgemeine Geschäftsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Haftungsausschluss
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5c6863] gap-2">
          <p>© {new Date().getFullYear()} KIEZJOB Berlin. Designed with craft in Berlin.</p>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#34d399]" />
            <span className="text-[#8fa099]">1.600+ verifizierte Kiez-Jobs aktiv</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
