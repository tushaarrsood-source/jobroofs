'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { isDe } = useTranslation();
  const [verifying, setVerifying] = useState(Boolean(sessionId));

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/employer/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .catch((err) => console.error('Verification ping error:', err))
      .finally(() => setVerifying(false));
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-3xl bg-zinc-50 p-8 sm:p-10 text-center">
        {/* Success Badge */}
        <div className="size-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
          <CheckCircle2 className="size-9 stroke-[2]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-semibold text-emerald-900 mb-3">
          <span>{isDe ? 'Inserat Aktiviert' : 'Listing Activated'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-3">
          {isDe ? 'Zahlung erfolgreich!' : 'Payment Successful!'}
        </h1>

        <p className="text-base text-zinc-600 leading-relaxed mb-6">
          {isDe
            ? 'Vielen Dank! Dein Inserat wurde erfolgreich bezahlt und ist jetzt auf JOBROOFS live geschaltet.'
            : 'Thank you! Your listing has been paid successfully and is now live on JOBROOFS.'}
        </p>

        {sessionId && (
          <div className="rounded-2xl bg-white px-4 py-3 mb-6 text-left border border-zinc-200/80">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-0.5">
              {isDe ? 'Referenz-ID' : 'Reference ID'}
            </span>
            <span className="text-sm font-mono text-black truncate block">
              {sessionId}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/profil"
            className="apple-press w-full py-4 rounded-2xl bg-black hover:bg-zinc-800 text-white font-semibold text-base flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LayoutDashboard className="size-5" />
            <span>{isDe ? 'Zu Meinen Inseraten' : 'Go to My Listings'}</span>
          </Link>

          <Link
            href="/"
            className="apple-press w-full py-3.5 rounded-2xl text-base font-semibold text-zinc-800 hover:bg-zinc-200/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isDe ? 'Zurück zur Übersicht' : 'Back to Home'}</span>
            <ArrowRight className="size-4 text-zinc-500" />
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
