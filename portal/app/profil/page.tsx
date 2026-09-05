import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { User, Globe, Briefcase, Home, HelpCircle, Shield, ChevronRight, ArrowRight } from 'lucide-react';
import { ProfileAccountCard } from '@/components/profile-account-card';
import { MyListings } from '@/components/my-listings';

export const metadata: Metadata = {
  title: 'Mein Bereich · JOBROOFS',
  description: 'Verwalte deine Inserate, Spracheinstellungen und gespeicherte Angebote auf JOBROOFS.',
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <SiteHeader />
        
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
          {/* User Account & Privacy (DSGVO) Card */}
          <ProfileAccountCard />

          {/* User's Listings Section */}
          <MyListings />

          {/* Quick actions */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#86868b] px-1">
              Aktionen & Services
            </h2>

            <div className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white divide-y divide-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <Link
                href="/post-a-job"
                className="flex items-center justify-between p-4.5 text-sm font-medium text-[#1d1d1f] hover:bg-black/[0.02] transition-colors active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-black/[0.04] text-[#1d1d1f]">
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <div className="text-[#1d1d1f] font-semibold">Job inserieren</div>
                    <div className="text-xs text-[#86868b] font-normal">Aushilfe, Minijob 603 €, Teilzeit</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#86868b]" />
              </Link>

              <Link
                href="/wohnen/list"
                className="flex items-center justify-between p-4.5 text-sm font-medium text-[#1d1d1f] hover:bg-black/[0.02] transition-colors active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-black/[0.04] text-[#1d1d1f]">
                    <Home className="size-5" />
                  </div>
                  <div>
                    <div className="text-[#1d1d1f] font-semibold">Wohnung oder WG inserieren</div>
                    <div className="text-xs text-[#86868b] font-normal">WG-Zimmer, Nachmieter, Zwischenmiete</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#86868b]" />
              </Link>

              <a
                href="mailto:kontakt@jobroofs.com"
                className="flex items-center justify-between p-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-[background-color,transform] duration-150 active:scale-[0.99] cursor-pointer"
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
                className="flex items-center justify-between p-4 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-[background-color,transform] duration-150 active:scale-[0.99] cursor-pointer"
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
