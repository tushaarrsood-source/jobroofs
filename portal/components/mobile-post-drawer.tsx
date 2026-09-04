'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, Home, X, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Up Bottom Sheet */}
      <div className="relative z-10 rounded-t-3xl border-t border-slate-700/80 bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur-2xl animate-in slide-in-from-bottom duration-250">
        {/* Pull Handle */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700" />

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold tracking-wide text-white">
                {isDe ? 'NEUES INSERAT ERSTELLEN' : 'CREATE NEW LISTING'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {isDe ? 'BERLIN KIEZ DIRECT MARKETPLACE' : 'BERLIN DIRECT KIEZ PLATFORM'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col gap-3">
          {/* 1. Job Inserat */}
          <Link
            href="/post-a-job"
            onClick={onClose}
            className="group relative flex items-start gap-3.5 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/50 to-slate-900/60 p-4 transition-all active:scale-[0.98] hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Briefcase className="size-5.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                  {isDe ? 'Job inserieren' : 'Post a Job'}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-300 font-mono">
                  <Zap className="size-2.5" /> 603 € / Aushilfe
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                {isDe
                  ? 'Aushilfe, Minijob, Teilzeit oder Werkstudent in deinem Kiez ausschreiben.'
                  : 'Hire local helpers, minijobbers, or working students across your neighborhood.'}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-blue-400">
                <span>{isDe ? 'In 2 Minuten online' : 'Live in 2 minutes'}</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* 2. Wohnung Inserat */}
          <Link
            href="/wohnen/list"
            onClick={onClose}
            className="group relative flex items-start gap-3.5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 to-slate-900/60 p-4 transition-all active:scale-[0.98] hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
              <Home className="size-5.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  {isDe ? 'Wohnung / WG inserieren' : 'List Room / Apartment'}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 font-mono">
                  <ShieldCheck className="size-2.5" /> 100% Kostenlos
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                {isDe
                  ? 'WG-Zimmer, Nachmieter oder Zwischenmiete ohne Maklergebühren vermitteln.'
                  : 'Find reliable flatmates, successor tenants or sublets with no agent fees.'}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span>{isDe ? 'Direktkontakt mit Bewerbern' : 'Direct contact with applicants'}</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Safety Spacing for iPhone Navigation bar */}
        <div className="h-6" />
      </div>
    </div>
  );
}
