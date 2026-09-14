'use client';

import Link from '@/components/ui/link';
import { useTranslation } from '@/lib/i18n/language-context';
import { BrandLogo } from '@/components/brand-logo';
import { openAppInstallModal } from '@/components/pwa-install-prompt';
import { openCookieSettings } from '@/components/cookie-banner';

export function SiteFooter() {
  const { isDe } = useTranslation();

  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-800 mt-12 sm:mt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Col */}
          <div className="col-span-2 sm:col-span-1">
            <BrandLogo variant="dark" size="sm" />
            <p className="mt-2.5 text-xs text-zinc-300 leading-relaxed max-w-xs font-normal">
              {isDe
                ? 'Flexible Jobs, Minijobs & Teilzeit in ganz Deutschland.'
                : 'Flexible jobs, minijobs & part-time opportunities in Germany.'}
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              Jobs
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {isDe ? 'Alle Jobs' : 'All Jobs'}
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="text-white hover:underline underline-offset-2 font-medium">
                  {isDe ? 'Job inserieren (1. Job 0 €)' : 'Post a Job (1st free)'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {isDe ? 'Preise & Tarife' : 'Pricing'}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openAppInstallModal}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {isDe ? 'App installieren' : 'Install App'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              {isDe ? 'Rechtliches' : 'Legal'}
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/impressum" className="hover:text-white transition-colors">
                  Impressum (§ 5 DDG)
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutz
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
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {isDe ? 'Cookie-Einstellungen' : 'Cookie Preferences'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              Kontakt
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="mailto:jobroofs@gmail.com"
                  className="text-white hover:underline font-mono font-medium"
                >
                  jobroofs@gmail.com
                </a>
              </li>
              <li className="text-zinc-300">
                {isDe ? 'Direkter Support' : 'Direct Support'}
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-300 gap-2">
          <p>© {new Date().getFullYear()} JOBROOFS Deutschland</p>
          <p className="text-zinc-400 font-mono">jobroofs.com</p>
        </div>
      </div>
    </footer>
  );
}
