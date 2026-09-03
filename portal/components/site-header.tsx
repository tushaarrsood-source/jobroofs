'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Home,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export function SiteHeader({ control = false }: { control?: boolean }) {
  const { t, isDe } = useTranslation();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isJobsActive = pathname === '/' || pathname.startsWith('/jobs') || pathname.startsWith('/categories');
  const isHousingActive = pathname.startsWith('/wohnen');

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-10">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-95"
        >
          <span className="flex items-center font-black text-xl tracking-tight text-slate-900 font-sans">
            KIEZ<span className="text-blue-600">JOB</span>
          </span>
          <span className="rounded bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 uppercase">
            BERLIN
          </span>
          {control ? (
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600 border border-slate-200">
              {t('controlRoom')}
            </span>
          ) : null}
        </Link>

        {/* Right: Navigation & Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-semibold sm:text-sm">
            {control ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-600 hover:underline"
              >
                {t('publicPortal')} <ArrowUpRight className="size-3.5" />
              </Link>
            ) : (
              <>
                {/* 1. All Jobs Link */}
                <Link
                  href="/"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isJobsActive
                      ? 'text-blue-600 font-bold bg-blue-50/70'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {isDe ? 'Jobs' : 'All Jobs'}
                </Link>

                {/* 2. Housing Link */}
                <Link
                  href="/wohnen"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    isHousingActive
                      ? 'text-blue-600 font-bold bg-blue-50/70'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{isDe ? 'Wohnen' : 'Housing'}</span>
                  <span className="rounded bg-blue-600 text-white px-1.5 py-0.2 text-[9px] font-bold tracking-wide uppercase">
                    Neu
                  </span>
                </Link>

                {/* 3. Post a Listing Dropdown CTA Button */}
                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center">
                    <Link
                      href="/post"
                      className="inline-flex h-9 items-center gap-1.5 rounded-l-lg bg-blue-600 pl-3.5 pr-2.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm shadow-blue-500/20"
                    >
                      <Plus className="size-3.5" />
                      <span>{isDe ? 'Inserieren' : 'Post a listing'}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="inline-flex h-9 items-center rounded-r-lg border-l border-blue-500 bg-blue-600 px-2 text-white transition hover:bg-blue-700 shadow-sm shadow-blue-500/20 cursor-pointer"
                      aria-label="Listing options"
                    >
                      <ChevronDown className={`size-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {isDe ? 'Inserat aufgeben (je 29 €)' : 'Post a listing (€29 each)'}
                      </div>

                      <Link
                        href="/post-a-job"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-start gap-2.5 rounded-xl p-2.5 text-left transition hover:bg-blue-50/80 group cursor-pointer"
                      >
                        <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-blue-100/70 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <BriefcaseBusiness className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                            {isDe ? 'Job inserieren' : 'Post a Job'}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {isDe ? 'Minijob, Teilzeit oder Schichten' : 'Minijob, part-time or shifts'}
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/wohnen/list"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-start gap-2.5 rounded-xl p-2.5 text-left transition hover:bg-emerald-50/80 group cursor-pointer mt-1"
                      >
                        <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100/70 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Home className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                            {isDe ? 'Wohnung / WG inserieren' : 'List Housing / Room'}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {isDe ? 'WG-Zimmer, Wohnung, Zwischenmiete' : 'Flatshare, sublet, apartment'}
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          <div className="border-l border-slate-200 pl-3 sm:pl-5">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
