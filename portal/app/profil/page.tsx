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
    <main className="min-h-screen bg-white text-black flex flex-col justify-between">
      <div>
        <SiteHeader />
        
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* User Account & Privacy Card */}
          <ProfileAccountCard />

          {/* User's Listings Section */}
          <MyListings />

          {/* Quick actions */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 px-1">
              Aktionen & Services
            </h2>

            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
              {/* App Install Trigger */}
              <ProfileAppTrigger />

              <Link
                href="/post-a-job"
                className="apple-press flex items-center justify-between py-4.5 px-2 text-base font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-zinc-100 text-black">
                    <Briefcase className="size-5" />
                  </div>
                  <div>
                    <div className="text-black font-bold text-base">Job inserieren</div>
                    <div className="text-sm text-zinc-600 font-normal">Aushilfe, Minijob 603 €, Teilzeit</div>
                  </div>
                </div>
                <ChevronRight className="size-5 text-zinc-400" />
              </Link>

              <a
                href="mailto:jobroofs@gmail.com"
                className="apple-press flex items-center justify-between py-4.5 px-2 text-base font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-zinc-100 text-black">
                    <HelpCircle className="size-5" />
                  </div>
                  <div>
                    <div className="text-black font-bold text-base">Hilfe & Support</div>
                    <div className="text-sm text-zinc-600 font-normal">jobroofs@gmail.com</div>
                  </div>
                </div>
                <ArrowRight className="size-5 text-zinc-400" />
              </a>

              <Link
                href="/impressum"
                className="apple-press flex items-center justify-between py-4.5 px-2 text-base font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-zinc-100 text-black">
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <div className="text-black font-bold text-base">Impressum & Datenschutz</div>
                    <div className="text-sm text-zinc-600 font-normal">Rechtliche Angaben und Richtlinien</div>
                  </div>
                </div>
                <ChevronRight className="size-5 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
