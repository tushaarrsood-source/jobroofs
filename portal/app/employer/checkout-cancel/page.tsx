'use client';

import Link from 'next/link';
import { HelpCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';

export default function CheckoutCancelPage() {
  const { isDe } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-[28px] border border-black/[0.06] bg-white p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black/[0.04] flex items-center justify-center text-[#86868b]">
          <HelpCircle className="w-9 h-9" />
        </div>

        <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
          {isDe ? 'Zahlung abgebrochen' : 'Payment Cancelled'}
        </h1>

        <p className="text-[14.5px] text-[#6e6e73] leading-relaxed mb-8">
          {isDe
            ? 'Der Bezahlvorgang wurde abgebrochen. Es wurde kein Betrag abgebucht. Du kannst den Vorgang jederzeit erneut starten.'
            : 'The checkout process was cancelled. Your card was not charged. You can retry whenever you are ready.'}
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/post"
            className="apple-btn-primary w-full py-3 rounded-full font-medium text-[14px] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isDe ? 'Erneut versuchen' : 'Try Again'}</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3 rounded-full text-[14px] font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#86868b]" />
            <span>{isDe ? 'Zurück zur Startseite' : 'Back to Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
