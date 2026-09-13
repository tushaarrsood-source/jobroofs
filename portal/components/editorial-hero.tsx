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
            <span>{isDe ? 'Job kostenlos inserieren' : 'Post your job (free)'}</span>
            <ArrowRight className="size-4 stroke-[2] group-hover:translate-x-0.5 transition-transform" />
          </button>

          <Link
            href="/pricing"
            className="apple-press inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white hover:border-black hover:bg-zinc-50 text-black px-4 py-3 text-[14px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <span>{isDe ? 'Preise & Tarife' : 'Pricing'}</span>
          </Link>
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
