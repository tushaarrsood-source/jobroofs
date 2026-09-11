'use client';

import Link from '@/components/ui/link';
import { useTranslation } from '@/lib/i18n/language-context';

export function SiteFooter() {
  const { isDe } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand Col */}
          <div className="sm:col-span-1">
            <Link href="/" className="inline-flex items-baseline gap-1.5 text-white">
              <span className="text-xl font-black tracking-tight">
                KIEZ<span className="text-[#e33525]">JOB</span>
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Berlin
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              {isDe
                ? 'Das einfache Berliner Jobportal für Studierende, Minijobs und Aushilfsjobs. Direktkontakt zu lokalen Berliner Unternehmen ohne Zeitarbeit.'
                : 'The simple Berlin job portal for students, minijobs, and part-time jobs. Direct employer contact without temp agencies.'}
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Seiten
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Alle Jobs
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="text-[#e33525] font-semibold hover:underline">
                  + Job schalten
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
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
                  AGB
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

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KIEZJOB Berlin. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
