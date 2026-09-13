import type { Metadata } from 'next';
import Link from '@/components/ui/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { User, Globe, Briefcase, Home, HelpCircle, Shield, ChevronRight, ArrowRight } from 'lucide-react';
import { ProfileAccountCard } from '@/components/profile-account-card';
import { MyListings } from '@/components/my-listings';
import { ProfileAppTrigger } from '@/components/profile-app-trigger';

export const metadata: Metadata = {
  title: 'Mein Bereich · JOBROOFS',
  description: 'Verwalte deine Inserate, Spracheinstellungen und gespeicherte Angebote auf JOBROOFS.',
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-black flex flex-col justify-between">
      <div>
        <SiteHeader />
        
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          {/* User Account & Privacy Card */}
          <ProfileAccountCard />

          {/* User's Listings Section */}
          <MyListings />

          {/* Quick actions */}
          <div className="space-y-2.5">
            <h2 className="text-[10.5px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-600 px-1">
              Aktionen & Services
            </h2>

            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white divide-y divide-zinc-200 shadow-xs">
              {/* App Install Trigger */}
              <ProfileAppTrigger />

              <Link
                href="/post-a-job"
                className="apple-press flex items-center justify-between p-4 text-sm font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                    <Briefcase className="size-4.5" />
                  </div>
                  <div>
                    <div className="text-black font-semibold text-sm">Job inserieren</div>
                    <div className="text-xs text-zinc-600 font-light">Aushilfe, Minijob 603 €, Teilzeit</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-zinc-400" />
              </Link>

              <a
                href="mailto:jobroofs@gmail.com"
                className="apple-press flex items-center justify-between p-4.5 text-sm font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                    <HelpCircle className="size-5" />
                  </div>
                  <div>
                    <div className="text-black font-semibold">Hilfe & Support</div>
                    <div className="text-xs text-zinc-600 font-light">jobroofs@gmail.com</div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-zinc-400" />
              </a>

              <Link
                href="/impressum"
                className="apple-press flex items-center justify-between p-4.5 text-sm font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <div className="text-black font-semibold">Impressum & Datenschutz</div>
                    <div className="text-xs text-zinc-600 font-light">Rechtliche Angaben und Richtlinien</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
