'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { isDe } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-[28px] border border-black/[0.06] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] text-center">
        {/* Apple Success Badge */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#34c759]/10 flex items-center justify-center text-[#34c759]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] text-[12px] font-medium text-[#1d1d1f] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isDe ? 'Inserat Aktiviert' : 'Listing Activated'}</span>
        </div>

        <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
          {isDe ? 'Zahlung erfolgreich!' : 'Payment Successful!'}
        </h1>

        <p className="text-[14.5px] text-[#6e6e73] leading-relaxed mb-6">
          {isDe
            ? 'Vielen Dank! Dein Inserat wurde erfolgreich bezahlt und ist jetzt auf JOBROOFS Berlin live geschaltet.'
            : 'Thank you! Your listing has been paid successfully and is now live across Berlin on JOBROOFS.'}
        </p>

        {sessionId && (
          <div className="rounded-xl bg-[#f5f5f7] px-3.5 py-2.5 mb-6 text-left">
            <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block mb-0.5">
              {isDe ? 'Referenz-ID' : 'Reference ID'}
            </span>
            <span className="text-[12px] font-mono text-[#1d1d1f] truncate block">
              {sessionId}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <Link
            href="/profil"
            className="apple-btn-primary w-full py-3 rounded-full font-medium text-[14px] flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{isDe ? 'Zu Meinen Inseraten' : 'Go to My Listings'}</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3 rounded-full text-[14px] font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{isDe ? 'Zurück zur Übersicht' : 'Back to Home'}</span>
            <ArrowRight className="w-4 h-4 text-[#86868b]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#0071e3] border-t-transparent animate-spin" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
