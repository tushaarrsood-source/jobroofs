'use client';

import React from 'react';
import Link from '@/components/ui/link';
import { Briefcase, Home, X, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

interface MobilePostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobilePostDrawer({ isOpen, onClose }: MobilePostDrawerProps) {
  const { isDe } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Apple Sheet */}
      <div className="relative z-10 rounded-t-[28px] border-t border-black/[0.06] bg-white p-6 text-[#1d1d1f] shadow-2xl drawer-enter">
        {/* Grab bar */}
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-black/15" />

        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-black/[0.04] pb-3.5">
          <div>
            <h3 className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">
              {isDe ? 'Inserat aufgeben' : 'Create Listing'}
            </h3>
            <p className="text-xs text-[#86868b]">
              {isDe ? 'Wähle die passende Kategorie für dein Angebot' : 'Select listing category'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="flex size-7.5 items-center justify-center rounded-full bg-black/[0.05] text-[#86868b] hover:bg-black/[0.1] hover:text-[#1d1d1f] transition-all active:scale-[0.92] cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Action Options */}
        <div className="flex flex-col gap-3">
          {/* 1. Job Inserat */}
          <Link
            href="/post-a-job"
            onClick={onClose}
            className="group flex items-center justify-between rounded-[20px] border border-black/[0.06] bg-[#f5f5f7]/60 p-4 transition-all duration-200 hover:border-black/[0.12] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white shadow-xs transition-transform duration-150 group-hover:scale-[1.04]">
                <Briefcase className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                    {isDe ? 'Job inserieren' : 'Post a Job'}
                  </span>
                  <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-[#1d1d1f]">
                    ab 29 € · 30d
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#86868b] line-clamp-1">
                  {isDe
                    ? 'Aushilfen, Schichten oder Minijobs im Kiez finden.'
                    : 'Find helpers, shifts or minijobbers in your kiez.'}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-[#86868b] group-hover:text-[#0071e3] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>

          {/* 2. Wohnung Inserat */}
          <Link
            href="/wohnen/list"
            onClick={onClose}
            className="group flex items-center justify-between rounded-[20px] border border-black/[0.06] bg-[#f5f5f7]/60 p-4 transition-all duration-200 hover:border-black/[0.12] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white shadow-xs transition-transform duration-150 group-hover:scale-[1.04]">
                <Home className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                    {isDe ? 'Wohnung / WG inserieren' : 'List Apartment or Room'}
                  </span>
                  <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-[#1d1d1f]">
                    ab 29 € · 30d
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#86868b] line-clamp-1">
                  {isDe
                    ? 'WG-Zimmer, Nachmieter oder Zwischenmiete ohne Makler.'
                    : 'List flatshares, successor tenants or sublets.'}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-[#86868b] group-hover:text-[#0071e3] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Bottom Spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
