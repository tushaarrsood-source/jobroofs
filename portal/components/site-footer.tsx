'use client';

import Link from '@/components/ui/link';
import { useTranslation } from '@/lib/i18n/language-context';
import { BrandLogo } from '@/components/brand-logo';
import { openAppInstallModal } from '@/components/pwa-install-prompt';

export function SiteFooter() {
  const { isDe } = useTranslation();

  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-800 mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo variant="dark" size="md" />
            <p className="mt-4 text-[13px] leading-relaxed text-zinc-300 font-normal">
              {isDe
                ? 'Das Portal für unabhängige Betriebe, Macher und Minijobs in ganz Deutschland. 100% Direktkontakt ohne Vermittler.'
                : 'The platform for independent businesses, creators, and temp jobs across Germany. 100% direct contact with zero middlemen.'}
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-[10.5px] font-bold text-white uppercase tracking-[0.2em] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-[13px] font-medium">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {isDe ? 'Alle Jobs in Deutschland' : 'All Jobs in Germany'}
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="text-white hover:underline underline-offset-4 font-semibold">
                  {isDe ? 'Job inserieren (1. Job 0 €)' : 'Post a Job (1st free)'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {isDe ? 'Preise & Tarife' : 'Pricing & Plans'}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openAppInstallModal}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {isDe ? 'JOBROOFS als App laden (PWA)' : 'Install JOBROOFS App (PWA)'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support Col */}
          <div>
            <h4 className="text-[10.5px] font-bold text-white uppercase tracking-[0.2em] mb-4">
              {isDe ? 'Kontakt & Support' : 'Contact & Support'}
            </h4>
            <ul className="space-y-2.5 text-[13px] font-medium">
              <li>
                <a
                  href="mailto:jobroofs@gmail.com"
                  className="text-white hover:underline font-mono text-[12.5px] font-semibold"
                >
                  jobroofs@gmail.com
                </a>
              </li>
              <li className="text-[12px] text-zinc-400 font-normal">
                {isDe
                  ? 'Offizielle Anfragen, Inserate & Partnerbetreuung'
                  : 'Official inquiries, listings & employer support'}
              </li>
              <li className="pt-1">
                <Link href="/impressum" className="hover:text-white transition-colors">
                  {isDe ? 'Kontakt & Impressum' : 'Contact & Legal Notice'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-[10.5px] font-bold text-white uppercase tracking-[0.2em] mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-2.5 text-[13px] font-medium">
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

        <div className="mt-14 border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11.5px] text-zinc-400 font-medium gap-2">
          <p>© {new Date().getFullYear()} JOBROOFS Deutschland &middot; The Independent Job Portal.</p>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-300">100% Unabhängige Betriebe · Bundesweit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
