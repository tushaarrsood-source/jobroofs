'use client';

import Link from '@/components/ui/link';
import { useTranslation } from '@/lib/i18n/language-context';
import { BrandLogo } from '@/components/brand-logo';

export function SiteFooter() {
  const { isDe } = useTranslation();

  return (
    <footer className="bg-[#182026] text-[#a0aaa4] border-t border-[#2a363f] mt-24">
      <div className="mx-auto max-w-5xl px-6 md:px-8 py-16">
        <div className="grid gap-12 sm:grid-cols-3">
          {/* Brand Col */}
          <div className="sm:col-span-1">
            <BrandLogo variant="dark" size="md" />
            <p className="mt-4 text-[12.5px] leading-relaxed text-[#8fa099] font-light">
              {isDe
                ? 'Das Berliner Portal für Minijobs, Aushilfen und flexible Schichten. 100% Direktkontakt zum Betrieb ohne Vermittlungsgebühren.'
                : 'The Berlin portal for temp jobs, minijobs, and flexible shifts. 100% direct contact with local employers without middlemen.'}
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-[10px] font-medium text-[#fbfbf8] uppercase tracking-[0.2em] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-[12.5px] font-light">
              <li>
                <Link href="/" className="hover:text-[#fbfbf8] transition-colors">
                  Alle 1.600 Stellenangebote
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="text-[#fbfbf8] hover:underline underline-offset-4">
                  Job in Berlin inserieren (ab 0 €)
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-[#fbfbf8] transition-colors">
                  Kontakt & Impressum
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-[10px] font-medium text-[#fbfbf8] uppercase tracking-[0.2em] mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-2.5 text-[12.5px] font-light">
              <li>
                <Link href="/datenschutz" className="hover:text-[#fbfbf8] transition-colors">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-[#fbfbf8] transition-colors">
                  Allgemeine Geschäftsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-[#fbfbf8] transition-colors">
                  Haftungsausschluss
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[#2a363f] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7e8a84] font-light gap-2">
          <p>© {new Date().getFullYear()} JOBROOFS Berlin &middot; The portal for Temp Jobs.</p>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#7e8a84]" />
            <span>1.600+ verifizierte Berliner Kiez-Jobs aktiv</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
