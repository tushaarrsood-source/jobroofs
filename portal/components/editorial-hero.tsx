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
      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-[12px] font-semibold text-black shadow-xs mb-4 sm:mb-5">
        <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
        <span>Trusted by 50+ employers and over 500+ workers</span>
        <span className="text-zinc-300">&middot;</span>
        <span className="text-zinc-600 font-medium">{isDe ? 'Deutschlandweites Netzwerk' : 'Nationwide Network'}</span>
      </div>

      {/* Top Headline Section */}
      <div className="max-w-4xl">
        {/* Slender Editorial Headline */}
        <h1
          className="text-3xl sm:text-6xl lg:text-[70px] font-semibold tracking-[-0.03em] text-black leading-[1.08] break-words"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe ? 'Das Portal für unabhängige Betriebe & Macher.' : 'The portal for independent listers.'}
        </h1>

        {/* Crisp Single-Sentence Subtitle */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-zinc-700 font-normal max-w-2xl leading-relaxed tracking-[-0.01em]">
          {isDe
            ? '100% Direktkontakt zu Cafés, Boutiquen, Werkstätten & Machern in Berlin, Hamburg, München, Köln & ganz Deutschland — ohne Zeitarbeitsfirmen, ohne Scraper.'
            : '100% direct contact with cafés, boutiques, studios & creators across Germany — no staffing agencies, no scrapers.'}
        </p>
      </div>

      {/* Hairline Divider */}
      <div className="w-full h-px bg-zinc-200 my-7 sm:my-10" />

      {/* Split Grid: Left = Single Clean "Post a Job" Hub, Right = Direct Listings Ledger */}
      <div className="grid gap-8 lg:gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Ultra-Clean Single "Post a Job" CTA Hub */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-600">
            {isDe ? 'FÜR UNABHÄNGIGE BETRIEBE & MACHER' : 'FOR INDEPENDENT LISTERS & EMPLOYERS'}
          </div>

          <h2
            className="text-3xl sm:text-5xl lg:text-[54px] font-semibold text-black tracking-[-0.025em] leading-[1.08]"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {isDe ? 'Jetzt dein Team verstärken.' : 'Hire for your team.'}
          </h2>

          <p className="text-[14px] sm:text-[15px] text-zinc-700 font-normal leading-relaxed max-w-lg">
            {isDe
              ? 'Für Cafés, Läden, Handwerk, Ateliers oder private Nachbarschaftshilfe. 1-Klick WhatsApp Direktkontakt, faire Konditionen und kein Abo-Zwang.'
              : 'For cafés, shops, craft studios, or private gigs. 1-click WhatsApp direct contact, fair pricing, and zero subscriptions.'}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handlePostJobClick}
              className="apple-press group inline-flex items-center justify-between gap-4 rounded-xl bg-black hover:bg-zinc-800 text-white px-6 py-3.5 text-[14px] font-semibold tracking-[0.02em] transition-all cursor-pointer shadow-sm hover:shadow-md w-full sm:w-auto min-w-[200px] active:scale-[0.98]"
            >
              <span>{isDe ? 'Job inserieren' : 'Post a job'}</span>
              <ArrowRight className="size-4 stroke-[2] group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-2.5 text-[12px] text-zinc-600 font-medium">
              {isDe
                ? '1. Inserat 100% gratis · Danach ab 14,99 € (über 75% günstiger als andere Plattformen)'
                : '1st job 100% free · Then from 14.99 € (over 75% cheaper than other platforms)'}
            </p>
          </div>
        </div>

        {/* Right Column: Direct Listings Ledger */}
        <div className="lg:col-span-6 lg:pl-4">
          <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.18em] text-zinc-600 mb-3">
            <span className="flex items-center gap-1.5 text-black font-bold">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>
                {directListings.length > 0
                  ? (isDe ? 'UNABHÄNGIGE INSERATE · BUNDESWEIT' : 'INDEPENDENT LISTINGS · NATIONWIDE')
                  : (isDe ? 'UNABHÄNGIGE BETRIEBE · DEUTSCHLAND' : 'INDEPENDENT LISTERS · GERMANY')}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-wider text-black bg-zinc-100 px-2.5 py-0.5 rounded-full font-bold border border-zinc-300">
              ★ UNABHÄNGIG
            </span>
          </div>

          {/* Architectural Hairline-Divided Ledger */}
          <div className="border-t border-zinc-200">
            {/* User-submitted Direct Listings */}
            {directListings.map((userJob) => (
              <Link
                key={userJob.id}
                href={userJob.linkUrl}
                className="group flex items-baseline justify-between py-3.5 border-b border-zinc-200 hover:bg-zinc-100/80 transition-all px-2 -mx-2 rounded-lg cursor-pointer bg-white"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14.5px] font-semibold text-black group-hover:text-zinc-800 transition-colors">
                      {userJob.title}
                    </span>
                    <span className="font-mono text-[9px] uppercase bg-black text-white px-1.5 py-0.2 rounded-xs font-semibold">
                      ★ UNABHÄNGIG
                    </span>
                  </div>
                  <div className="text-[12.5px] text-zinc-600 font-normal mt-0.5">
                    {userJob.subtitle}
                  </div>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <div className="text-[13.5px] font-bold text-black font-mono">
                    {userJob.badgeLabel}
                  </div>
                  <div className="text-[9.5px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mt-0.5">
                    {isDe ? 'Dein Inserat' : 'Your listing'}
                  </div>
                </div>
              </Link>
            ))}

            {directListings.length === 0 && (
              <>
                <div className="group flex items-baseline justify-between py-3.5 border-b border-zinc-200 px-2 -mx-2 hover:bg-zinc-50 transition-colors rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14.5px] font-semibold text-black">
                        {isDe ? '1-Tap Direktkontakt (WhatsApp & Tel.)' : '1-Tap Direct Contact (WhatsApp & Phone)'}
                      </span>
                      <span className="font-mono text-[9px] uppercase bg-emerald-700 text-white px-1.5 py-0.5 rounded-xs font-semibold">
                        WHATSAPP
                      </span>
                    </div>
                    <div className="text-[12.5px] text-zinc-600 font-normal mt-0.5">
                      {isDe ? 'Direkter Chat oder Anruf beim Betrieb — ohne Zwischenagentur' : 'Direct chat or call with shop owners — no middleman'}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13.5px] font-bold text-black font-mono">
                      100% Direkt
                    </div>
                    <div className="text-[9.5px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mt-0.5">
                      {isDe ? 'Garantie' : 'Guarantee'}
                    </div>
                  </div>
                </div>

                <div className="group flex items-baseline justify-between py-3.5 border-b border-zinc-200 px-2 -mx-2 hover:bg-zinc-50 transition-colors rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14.5px] font-semibold text-black">
                        {isDe ? 'Echte unabhängige Betriebe & Macher' : 'Real independent businesses & creators'}
                      </span>
                      <span className="font-mono text-[9px] uppercase bg-black text-white px-1.5 py-0.5 rounded-xs font-semibold">
                        KEIN SCRAPING
                      </span>
                    </div>
                    <div className="text-[12.5px] text-zinc-600 font-normal mt-0.5">
                      {isDe ? 'Nur verifizierte Kiez-Cafés, Läden, Werkstätten & Privatinserate' : 'Only verified neighborhood cafés, shops, studios & private ads'}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13.5px] font-bold text-black font-mono">
                      0 € Scraper
                    </div>
                    <div className="text-[9.5px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mt-0.5">
                      {isDe ? 'Echte Jobs' : 'Real Jobs'}
                    </div>
                  </div>
                </div>

                <div className="group flex items-baseline justify-between py-3.5 border-b border-zinc-200 px-2 -mx-2 hover:bg-zinc-50 transition-colors rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14.5px] font-semibold text-black">
                        {isDe ? 'Faire Stundenlöhne ab 15 €/h' : 'Fair hourly wages from €15/h'}
                      </span>
                      <span className="font-mono text-[9px] uppercase bg-amber-600 text-white px-1.5 py-0.5 rounded-xs font-semibold">
                        FAIR PAY
                      </span>
                    </div>
                    <div className="text-[12.5px] text-zinc-600 font-normal mt-0.5">
                      {isDe ? 'Transparente Konditionen & Trinkgeld-Boni im Kiez' : 'Transparent conditions & tips directly in your Kiez'}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-[13.5px] font-bold text-black font-mono">
                      ab 15 €/h
                    </div>
                    <div className="text-[9.5px] uppercase tracking-[0.14em] text-zinc-500 font-semibold mt-0.5">
                      {isDe ? 'Vergütung' : 'Pay'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Minimal Ledger Sub-meta */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-200 text-[11.5px] text-zinc-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-600" />
              <span>{isDe ? 'Direktkontakt zu Betrieben & Machern in ganz Deutschland' : 'Direct contact to independent businesses across Germany'}</span>
            </span>
            <span className="font-mono text-[10.5px] text-zinc-500 font-semibold">
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
