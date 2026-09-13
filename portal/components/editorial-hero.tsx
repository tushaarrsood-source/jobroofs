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
  const [directListings, setDirectListings] = useState<UserListing[]>([]);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const checkListings = () => {
      const all = getMyListings();
      const active = all.filter((l) => l.type === 'job' && l.status !== 'expired');
      setDirectListings(active);
    };

    checkListings();
    window.addEventListener('jobroofs_listings_updated', checkListings);
    return () => window.removeEventListener('jobroofs_listings_updated', checkListings);
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
      {/* Social Proof Trust Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#d8ded9] bg-white px-3.5 py-1 text-[11.5px] font-medium text-[#202a31] shadow-2xs mb-4 sm:mb-5">
        <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
        <span>Trusted by 50+ employers and over 500+ workers</span>
        <span className="text-[#d8ded9]">&middot;</span>
        <span className="text-[#7e8a84] font-light">{isDe ? 'Deutschlandweites Netzwerk' : 'Nationwide Network'}</span>
      </div>

      {/* Top Headline Section */}
      <div className="max-w-4xl">
        {/* Slender Editorial Headline */}
        <h1
          className="text-3xl sm:text-6xl lg:text-[70px] font-light sm:font-normal tracking-[-0.025em] text-[#202a31] leading-[1.1] sm:leading-[1.08] break-words"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe ? 'Das Portal für unabhängige Betriebe & Macher.' : 'The portal for independent listers.'}
        </h1>

        {/* Crisp Single-Sentence Subtitle */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#5a6460] font-light max-w-2xl leading-relaxed tracking-[-0.01em]">
          {isDe
            ? '100% Direktkontakt zu Cafés, Boutiquen, Werkstätten & Machern in Berlin, Hamburg, München, Köln & ganz Deutschland — ohne Zeitarbeitsfirmen, ohne Scraper.'
            : '100% direct contact with cafés, boutiques, studios & creators across Germany — no staffing agencies, no scrapers.'}
        </p>
      </div>

      {/* Hairline Divider */}
      <div className="w-full h-px bg-[#d8ded9] my-7 sm:my-10" />

      {/* Split Grid: Left = Single Clean "Post a Job" Hub, Right = Direct Listings Ledger */}
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Ultra-Clean Single "Post a Job" CTA Hub */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[10px] font-mono font-medium uppercase tracking-[0.16em] sm:tracking-[0.24em] text-[#7e8a84]">
            {isDe ? 'FÜR UNABHÄNGIGE BETRIEBE & MACHER' : 'FOR INDEPENDENT LISTERS & EMPLOYERS'}
          </div>

          <h2
            className="text-3xl sm:text-5xl lg:text-[56px] font-light sm:font-normal text-[#202a31] tracking-[-0.025em] leading-[1.1] sm:leading-[1.08]"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {isDe ? 'Jetzt dein Team verstärken.' : 'Hire for your team.'}
          </h2>

          <p className="text-[13.5px] sm:text-[15px] text-[#5a6460] font-light leading-relaxed max-w-lg">
            {isDe
              ? 'Für Cafés, Läden, Handwerk, Ateliers oder private Nachbarschaftshilfe. 1-Klick WhatsApp Direktkontakt, faire Konditionen und kein Abo-Zwang.'
              : 'For cafés, shops, craft studios, or private gigs. 1-click WhatsApp direct contact, fair pricing, and zero subscriptions.'}
          </p>

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
              {isDe
                ? '1. Inserat 100% gratis · Danach ab 14,99 € (über 75% günstiger als andere Plattformen)'
                : '1st job 100% free · Then from 14.99 € (over 75% cheaper than other platforms)'}
            </p>
          </div>
        </div>

        {/* Right Column: Direct Listings Ledger (Every direct listing is already spotlighted) */}
        <div className="lg:col-span-6 lg:pl-4">
          <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#7e8a84] mb-3">
            <span className="flex items-center gap-1.5 text-[#202a31] font-semibold">
              <Sparkles className="size-3 text-[#9e7d3b]" />
              <span>
                {directListings.length > 0
                  ? (isDe ? 'UNABHÄNGIGE INSERATE · BUNDESWEIT' : 'INDEPENDENT LISTINGS · NATIONWIDE')
                  : (isDe ? 'UNABHÄNGIGE BETRIEBE · DEUTSCHLAND' : 'INDEPENDENT LISTERS · GERMANY')}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#202a31] bg-[#ecece4] px-2 py-0.5 rounded-sm font-semibold border border-[#d8ded9]">
              ★ UNABHÄNGIG
            </span>
          </div>

          {/* Architectural Hairline-Divided Ledger */}
          <div className="border-t border-[#d8ded9]">
            {/* User-submitted Direct Listings */}
            {directListings.map((userJob) => (
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
                      ★ UNABHÄNGIG
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

            {directListings.length === 0 && (
              <>
                <div className="group flex items-baseline justify-between py-3.5 border-b border-[#d8ded9] px-1 sm:px-2 sm:-mx-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] sm:text-[14.5px] font-normal text-[#202a31]">
                        {isDe ? '1-Tap Direktkontakt (WhatsApp & Tel.)' : '1-Tap Direct Contact (WhatsApp & Phone)'}
                      </span>
                      <span className="font-mono text-[9px] uppercase bg-[#1e4635] text-[#fbfbf8] px-1.5 py-0.2 rounded-xs font-medium">
                        WHATSAPP
                      </span>
                    </div>
                    <div className="text-[12px] text-[#7e8a84] font-light mt-0.5">
                      {isDe ? 'Direkter Chat oder Anruf beim Betrieb — ohne Zwischenagentur' : 'Direct chat or call with shop owners — no middleman'}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13.5px] font-normal text-[#202a31] font-mono">
                      100% Direkt
                    </div>
                    <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                      {isDe ? 'Garantie' : 'Guarantee'}
                    </div>
                  </div>
                </div>

                <div className="group flex items-baseline justify-between py-3.5 border-b border-[#d8ded9] px-1 sm:px-2 sm:-mx-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] sm:text-[14.5px] font-normal text-[#202a31]">
                        {isDe ? 'Echte unabhängige Betriebe & Macher' : 'Real independent businesses & creators'}
                      </span>
                      <span className="font-mono text-[9px] uppercase bg-[#202a31] text-[#fbfbf8] px-1.5 py-0.2 rounded-xs font-medium">
                        KEIN SCRAPING
                      </span>
                    </div>
                    <div className="text-[12px] text-[#7e8a84] font-light mt-0.5">
                      {isDe ? 'Nur verifizierte Kiez-Cafés, Läden, Werkstätten & Privatinserate' : 'Only verified neighborhood cafés, shops, studios & private ads'}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13.5px] font-normal text-[#202a31] font-mono">
                      0 € Scraper
                    </div>
                    <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                      {isDe ? 'Echte Jobs' : 'Real Jobs'}
                    </div>
                  </div>
                </div>

                <div className="group flex items-baseline justify-between py-3.5 border-b border-[#d8ded9] px-1 sm:px-2 sm:-mx-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] sm:text-[14.5px] font-normal text-[#202a31]">
                        {isDe ? 'Faire Stundenlöhne ab 15 €/h' : 'Fair hourly wages from €15/h'}
                      </span>
                      <span className="font-mono text-[9px] uppercase bg-[#9e7d3b] text-[#fbfbf8] px-1.5 py-0.2 rounded-xs font-medium">
                        FAIR PAY
                      </span>
                    </div>
                    <div className="text-[12px] text-[#7e8a84] font-light mt-0.5">
                      {isDe ? 'Transparente Konditionen & Trinkgeld-Boni im Kiez' : 'Transparent conditions & tips directly in your Kiez'}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13.5px] font-normal text-[#202a31] font-mono">
                      ab 15 €/h
                    </div>
                    <div className="text-[9.5px] uppercase tracking-[0.14em] text-[#7e8a84] mt-0.5">
                      {isDe ? 'Vergütung' : 'Pay'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Minimal Ledger Sub-meta */}
          <div className="flex items-center justify-between pt-3 border-t border-[#d8ded9] text-[11px] text-[#7e8a84] font-light">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#1e4635]" />
              <span>{isDe ? 'Direktkontakt zu Betrieben & Machern in ganz Deutschland' : 'Direct contact to independent businesses across Germany'}</span>
            </span>
            <span className="font-mono text-[10px] text-[#7e8a84]">
              {isDe ? 'Sofort live' : 'Instantly live'}
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
