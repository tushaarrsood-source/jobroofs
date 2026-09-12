'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from '@/components/ui/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getMyListings, type UserListing } from '@/lib/storage/my-listings';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';

export function EditorialHero() {
  const router = useRouter();
  const { isDe } = useTranslation();
  const { user } = useAuth();
  const [userPremiumListings, setUserPremiumListings] = useState<UserListing[]>([]);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const checkPremium = () => {
      const all = getMyListings();
      const premiums = all.filter((l) => l.type === 'job' && l.tier === 'premium' && l.status !== 'expired');
      setUserPremiumListings(premiums);
    };

    checkPremium();
    window.addEventListener('jobroofs_listings_updated', checkPremium);
    return () => window.removeEventListener('jobroofs_listings_updated', checkPremium);
  }, []);

  const handlePostJobClick = () => {
    if (!user) {
      setAuthOpen(true);
    } else {
      router.push('/post-a-job');
    }
  };

  return (
    <section className="relative pt-8 pb-10 sm:pt-14 sm:pb-16">
      {/* Top Headline Section */}
      <div className="max-w-4xl">
        {/* Slender Editorial Headline */}
        <h1
          className="text-3xl sm:text-6xl lg:text-[70px] font-light sm:font-normal tracking-[-0.025em] text-[#202a31] leading-[1.1] sm:leading-[1.08] break-words"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe ? 'Das Portal für flexible Jobs.' : 'The portal for temp jobs.'}
        </h1>

        {/* Crisp Single-Sentence Subtitle */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#5a6460] font-light max-w-2xl leading-relaxed tracking-[-0.01em]">
          {isDe
            ? 'Direktkontakt zu Berliner Betrieben — Minijobs, flexible Schichten und Aushilfen ohne Vermittler.'
            : 'Direct connection to Berlin businesses — minijobs, flexible shifts and temp work without agencies.'}
        </p>
      </div>

      {/* Hairline Divider */}
      <div className="w-full h-px bg-[#d8ded9] my-7 sm:my-10" />

      {/* Split Grid: Left = Single Clean "Post a Job" Hub, Right = Premium Spotlight Ledger */}
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Ultra-Clean Single "Post a Job" CTA Hub */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[10px] font-mono font-medium uppercase tracking-[0.16em] sm:tracking-[0.24em] text-[#7e8a84]">
            {isDe ? 'FÜR ARBEITGEBER · DIREKTE INSERATE' : 'FOR EMPLOYERS · DIRECT LISTINGS'}
          </div>

          <h2
            className="text-3xl sm:text-5xl lg:text-[56px] font-light sm:font-normal text-[#202a31] tracking-[-0.025em] leading-[1.1] sm:leading-[1.08]"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {isDe ? 'Job inserieren.' : 'Post a job.'}
          </h2>

          <div className="pt-2">
            <button
              type="button"
              onClick={handlePostJobClick}
              className="apple-press group inline-flex items-center justify-between gap-4 rounded-xl bg-[#202a31] hover:bg-[#161D22] text-[#fbfbf8] px-6 py-3.5 text-[14px] font-medium tracking-[0.02em] transition-all cursor-pointer shadow-xs w-full sm:w-auto min-w-[200px]"
            >
              <span>{isDe ? 'Job inserieren' : 'Post a job'}</span>
              <ArrowRight className="size-4 stroke-[1.5] group-hover:translate-x-0.5 transition-transform" />
            </button>
            <p className="mt-2 text-[12px] text-[#7e8a84] font-light">
              {isDe ? 'In wenigen Schritten online inserieren' : 'Online in just a few steps'}
            </p>
          </div>
        </div>

        {/* Right Column: Dedicated PREMIUM SPOTLIGHT (Display-only ledger, no extra CTA button) */}
        <div className="lg:col-span-6 lg:pl-4">
          <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#7e8a84] mb-3">
            <span className="flex items-center gap-1.5 text-[#202a31] font-semibold">
              <Sparkles className="size-3 text-[#9e7d3b]" />
              <span>PREMIUM SPOTLIGHT &middot; BERLIN</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#202a31] bg-[#ecece4] px-2 py-0.5 rounded-sm font-semibold border border-[#d8ded9]">
              ★ PREMIUM
            </span>
          </div>

          {/* Architectural Hairline-Divided Ledger */}
          <div className="border-t border-[#d8ded9]">
            {/* User-submitted Premium Listings (if active) */}
            {userPremiumListings.map((userJob) => (
              <Link
                key={userJob.id}
                href={userJob.linkUrl}
                className="group flex items-baseline justify-between py-3.5 border-b border-[#d8ded9] hover:bg-[#f4f4ee]/70 transition-colors px-1 sm:px-2 sm:-mx-2 cursor-pointer bg-[#fcfcf9]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] sm:text-[14.5px] font-normal text-[#202a31] group-hover:text-[#4a5751] transition-colors">
                      {userJob.title}
                    </span>
                    <span className="font-mono text-[9px] uppercase bg-[#202a31] text-[#fbfbf8] px-1.5 py-0.2 rounded-xs font-medium">
                      ★ SPOTLIGHT
                    </span>
                  </div>
                  <div className="text-[12px] text-[#7e8a84] font-light mt-0.5">
                    {userJob.subtitle}
                  </div>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <div className="text-[13.5px] font-normal text-[#202a31] font-mono">
                    {userJob.badgeLabel}
                  </div>
                  <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                    {isDe ? 'Dein Inserat' : 'Your listing'}
                  </div>
                </div>
              </Link>
            ))}

            {userPremiumListings.length === 0 && (
              <div className="py-7 px-4 text-center">
                <p className="text-[13.5px] font-medium text-[#202a31]">
                  {isDe ? 'Aktuell noch keine Spotlight-Inserate.' : 'No spotlight listings yet.'}
                </p>
                <p className="mt-1 text-[12px] text-[#7e8a84] font-light max-w-sm mx-auto">
                  {isDe
                    ? '60 Tage maximale Sichtbarkeit ganz oben auf JOBROOFS für Berliner Betriebe.'
                    : '60 days of maximum visibility at the top of JOBROOFS for Berlin businesses.'}
                </p>
              </div>
            )}
          </div>

          {/* Minimal Ledger Sub-meta */}
          <div className="flex items-center justify-between pt-3 border-t border-[#d8ded9] text-[11px] text-[#7e8a84] font-light">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#202a31]" />
              <span>{isDe ? 'Berliner Betriebe im Spotlight' : 'Berlin businesses in spotlight'}</span>
            </span>
            <span className="font-mono text-[10px] text-[#7e8a84]">
              {isDe ? 'Top-Platzierung' : 'Top placement'}
            </span>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => router.push('/post-a-job')}
      />
    </section>
  );
}
