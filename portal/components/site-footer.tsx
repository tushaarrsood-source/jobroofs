'use client';
import { useState } from 'react';
import Link from '@/components/ui/link';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { DeleteAccountModal } from '@/components/delete-account-modal';
import { AuthModal } from '@/components/auth-modal';
import { openCookieSettings } from '@/components/cookie-banner';

export function SiteFooter() {
  const { isDe } = useTranslation();
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 md:px-10 md:py-14">
        {/* Main Grid: 2 columns on mobile, 4-5 on tablet/desktop */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Purpose Col - full width on mobile */}
          <div className="col-span-2 space-y-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900">
                JOB<span className="text-blue-600">ROOFS</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 rounded px-1.5 py-0.2 uppercase">
                BERLIN
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 max-w-sm">
              {isDe
                ? 'Das Berliner Portal für flexible Jobs, Minijobs (603 €) und Kiez-Wohnungen. 100% Direktkontakt ohne Maklergebühren.'
                : 'The Berlin portal for flexible work, minijobs (€603), and neighbourhood rooms. 100% direct contact with zero broker fees.'}
            </p>
          </div>

          {/* Districts Col - 1 col on mobile */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              {isDe ? 'Bezirke' : 'Districts'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <Link href="/?district=kreuzberg" className="hover:text-blue-600 transition-colors">
                  Kreuzberg
                </Link>
              </li>
              <li>
                <Link href="/?district=friedrichshain" className="hover:text-blue-600 transition-colors">
                  Friedrichshain
                </Link>
              </li>
              <li>
                <Link href="/?district=neukölln" className="hover:text-blue-600 transition-colors">
                  Neukölln
                </Link>
              </li>
              <li>
                <Link href="/?district=mitte" className="hover:text-blue-600 transition-colors">
                  Mitte & Tiergarten
                </Link>
              </li>
              <li>
                <Link href="/?district=prenzlauer%20berg" className="hover:text-blue-600 transition-colors">
                  Prenzlauer Berg
                </Link>
              </li>
              <li>
                <Link href="/?district=schöneberg" className="hover:text-blue-600 transition-colors">
                  Schöneberg
                </Link>
              </li>
              <li>
                <Link href="/karte" className="text-blue-600 hover:underline font-medium">
                  {isDe ? 'Alle auf Karte →' : 'All on map →'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Col - 1 col on mobile */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              {isDe ? 'Bereiche' : 'Categories'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <Link href="/categories/temp-shifts" className="hover:text-blue-600 transition-colors">
                  {isDe ? 'Minijobs (603 €)' : 'Minijobs (€603)'}
                </Link>
              </li>
              <li>
                <Link href="/categories/gastronomy" className="hover:text-blue-600 transition-colors">
                  {isDe ? 'Gastronomie & Bar' : 'Hospitality & Bar'}
                </Link>
              </li>
              <li>
                <Link href="/categories/events" className="hover:text-blue-600 transition-colors">
                  {isDe ? 'Events & Festivals' : 'Events & Festivals'}
                </Link>
              </li>
              <li>
                <Link href="/categories/retail" className="hover:text-blue-600 transition-colors">
                  {isDe ? 'Verkauf & Retail' : 'Retail & Sales'}
                </Link>
              </li>
              <li>
                <Link href="/wohnen" className="hover:text-blue-600 transition-colors font-semibold text-slate-900">
                  {isDe ? 'Wohnen & Zimmer' : 'Housing & Rooms'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 transition-colors">
                  {isDe ? 'Preise & Tarife' : 'Pricing & Plans'}
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="hover:text-blue-600 transition-colors">
                  {isDe ? 'Job inserieren' : 'Post a Job'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col - spans 2 cols on mobile with horizontal flow, column on desktop */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 sm:mb-2.5">
              {isDe ? 'Rechtliches' : 'Legal'}
            </h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 md:block md:space-y-1.5">
              <li>
                <Link href="/impressum" className="hover:text-blue-600 transition-colors">
                  Impressum (§ 5 DDG)
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-blue-600 transition-colors">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-blue-600 transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-600 transition-colors">
                  {isDe ? 'Haftungsausschluss' : 'Disclaimer'}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="text-left text-slate-500 hover:text-blue-600 transition-colors text-xs cursor-pointer"
                >
                  {isDe ? 'Cookie-Einstellungen' : 'Cookie Settings'}
                </button>
              </li>
              {user && (
                <li>
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="text-left text-slate-400 hover:text-red-500 transition-colors text-xs cursor-pointer"
                  >
                    {isDe ? 'Konto löschen' : 'Delete account'}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200/80 pt-4 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between md:mt-12 md:pt-6 md:text-xs">
          <p>© {new Date().getFullYear()} JOBROOFS Berlin. Alle Rechte vorbehalten.</p>
          <p className="flex items-center gap-2 text-slate-400">
            <span>100% DSGVO-konform</span>
            <span>·</span>
            <span>Made in Berlin</span>
          </p>
        </div>
      </div>

      {user && (
        <>
          <DeleteAccountModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onRequiresReauth={() => setAuthOpen(true)}
          />
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </>
      )}
    </footer>
  );
}
