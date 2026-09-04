import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { User, Globe, Briefcase, Home, HelpCircle, Shield, ChevronRight, ArrowRight } from 'lucide-react';
import { LanguageToggle } from '@/components/language-toggle';

export const metadata: Metadata = {
  title: 'Mein Bereich � JOBROOFS',
  description: 'Verwalte deine Inserate, Spracheinstellungen und gespeicherte Angebote auf JOBROOFS.',
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <SiteHeader />
        
        <div className="mx-auto max-w-xl px-5 py-8 sm:py-12">
          {/* User card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <User className="size-7" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-slate-900">
                  Mein Bereich
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  JOBROOFS � Berlin Direkt-Marktplatz
                </p>
              </div>
            </div>

            {/* Language toggle row */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <Globe className="size-4 text-slate-400" />
                <span>Sprache / Language</span>
              </div>
              <LanguageToggle />
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Aktionen & Inserate
            </h2>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
              <Link
                href="/post-a-job"
                className="flex items-center justify-between p-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-semibold">Job inserieren</div>
                    <div className="text-xs text-slate-500 font-normal">Aushilfe, Minijob 603 �, Teilzeit</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>

              <Link
                href="/wohnen/list"
                className="flex items-center justify-between p-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Home className="size-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-semibold">Wohnung oder WG inserieren</div>
                    <div className="text-xs text-slate-500 font-normal">WG-Zimmer, Nachmieter, Zwischenmiete</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>

              <a
                href="mailto:kontakt@jobroofs.com"
                className="flex items-center justify-between p-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    <HelpCircle className="size-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-semibold">Hilfe & Support</div>
                    <div className="text-xs text-slate-500 font-normal">kontakt@jobroofs.com</div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-slate-400" />
              </a>

              <Link
                href="/impressum"
                className="flex items-center justify-between p-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-semibold">Impressum & Datenschutz</div>
                    <div className="text-xs text-slate-500 font-normal">Rechtliche Angaben und Richtlinien</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
