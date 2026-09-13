'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from '@/components/ui/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';

export function EditorialHero() {
  const router = useRouter();
  const { isDe } = useTranslation();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const handlePostJobClick = () => {
    if (!user) {
      setAuthOpen(true);
    } else {
      router.push('/post-a-job');
    }
  };

  return (
    <section className="pt-8 pb-6 sm:pt-12 sm:pb-8">
      {/* Top Headline & Single Direct CTA */}
      <div className="max-w-3xl space-y-4">
        <h1
          className="text-3xl sm:text-5xl lg:text-[58px] font-bold tracking-[-0.03em] text-black leading-[1.08]"
          style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
        >
          {isDe ? 'Das Portal für unabhängige Inserate.' : 'The portal for independent listings.'}
        </h1>

        <p className="text-[15px] sm:text-[17px] text-zinc-700 font-normal leading-relaxed max-w-2xl">
          {isDe
            ? 'Minijobs, Aushilfen & Teilzeitstellen in ganz Deutschland. 100% direkter Kontakt zu echten Betrieben – ohne Zeitarbeit, ohne Vermittler.'
            : 'Minijobs, temp gigs & part-time work across Germany. 100% direct contact with real employers — no agencies, no middlemen.'}
        </p>

        {/* Clean, Prominent CTA */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePostJobClick}
            className="apple-press group inline-flex items-center justify-center gap-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white px-5 py-3 text-[14px] font-semibold tracking-[0.01em] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>{isDe ? 'Job inserieren' : 'Post a Job'}</span>
            <ArrowRight className="size-4 stroke-[2] group-hover:translate-x-0.5 transition-transform" />
          </button>

          <Link
            href="/pricing"
            className="apple-press inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white hover:border-black hover:bg-zinc-50 text-black px-4 py-3 text-[14px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <span>{isDe ? 'Preise & Tarife' : 'Pricing'}</span>
          </Link>

          <span className="text-[12.5px] text-zinc-600 font-medium sm:ml-2">
            {isDe ? '1. Job kostenlos · Danach ab 14,99 €' : '1st job free · Then from €14.99'}
          </span>
        </div>
      </div>

      {/* Signature Dark Brand Banner Section with Pure Black BG & Crisp White Text */}
      <div className="mt-8 rounded-2xl bg-black text-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 border border-black">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-400">
            <Sparkles className="size-3 text-amber-400" />
            <span>JOBROOFS · BUNDESWEIT</span>
          </div>
          <p className="text-[16px] sm:text-[18px] font-bold tracking-tight text-white">
            {isDe
              ? 'Unabhängig inserieren. Einfach, günstig und direkt.'
              : 'Independent hiring. Fast, affordable, and direct.'}
          </p>
          <p className="text-[13px] sm:text-[13.5px] text-zinc-300 font-normal leading-relaxed max-w-2xl">
            {isDe
              ? 'Kein Abo-Zwang, keine Personalvermittler. Ob Kiez-Café, Handwerksbetrieb oder private Nachbarschaftshilfe – schalte deine Anzeige in 2 Minuten live.'
              : 'No subscriptions, zero agency markups. Whether for a local café, workshop, or private help — publish your listing live in 2 minutes.'}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={handlePostJobClick}
            className="apple-press inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2.5 text-[13px] font-semibold hover:bg-zinc-100 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>{isDe ? 'Jetzt inserieren' : 'Post a Job'}</span>
            <ArrowRight className="size-3.5 stroke-[2]" />
          </button>
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
