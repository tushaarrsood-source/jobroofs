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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 rounded-t-2xl border-t border-slate-200 bg-white p-5 text-slate-900 shadow-2xl drawer-enter">
        {/* Grab bar */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-display text-base font-bold tracking-tight text-slate-900">
              {isDe ? 'Inserat aufgeben' : 'Create Listing'}
            </h3>
            <p className="text-xs text-slate-500">
              {isDe ? 'Wähle die passende Kategorie für dein Angebot' : 'Select listing category'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.92] cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Action Options */}
        <div className="flex flex-col gap-3">
          {/* 1. Job Inserat */}
          <Link
            href="/post-a-job"
            onClick={onClose}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-[border-color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-blue-300 hover:bg-blue-50/40 active:scale-[0.98] card-tactile"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]">
                <Briefcase className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {isDe ? 'Job inserieren' : 'Post a Job'}
                  </span>
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">
                    ab 29 € · 30 Tage
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                  {isDe
                    ? 'Aushilfen, Schichten oder Minijobs im Kiez finden.'
                    : 'Find helpers, shifts or minijobbers in your kiez.'}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-blue-600 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>

          {/* 2. Wohnung Inserat */}
          <Link
            href="/wohnen/list"
            onClick={onClose}
            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-[border-color,background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-emerald-300 hover:bg-emerald-50/40 active:scale-[0.98] card-tactile"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]">
                <Home className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {isDe ? 'Wohnung / WG inserieren' : 'List Apartment or Room'}
                  </span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                    ab 29 € · 30 Tage
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                  {isDe
                    ? 'WG-Zimmer, Nachmieter oder Zwischenmiete ohne Makler.'
                    : 'List flatshares, successor tenants or sublets.'}
                </p>
              </div>
            </div>
            <ChevronRight className="size-4 text-slate-400 group-hover:text-emerald-600 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Bottom Spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
