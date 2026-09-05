'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2, ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRequiresReauth?: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onSuccess,
  onRequiresReauth,
}: DeleteAccountModalProps) {
  const { isDe } = useTranslation();
  const { user, deleteAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage(null);
    setNeedsReauth(false);

    try {
      await deleteAccount();
      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      console.error('Delete account error in modal:', err);
      if (err.code === 'auth/requires-recent-login') {
        setNeedsReauth(true);
        setErrorMessage(
          isDe
            ? 'Aus Sicherheitsgründen erfordert Firebase eine frische Anmeldung. Bitte melde dich kurz erneut an und wiederhole den Schritt.'
            : 'For security reasons, Firebase requires a recent sign-in. Please sign in again, then retry deletion.',
        );
      } else {
        setErrorMessage(
          err.message ||
            (isDe
              ? 'Fehler beim Löschen des Kontos. Bitte versuche es später erneut.'
              : 'Failed to delete account. Please try again later.'),
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-200"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.15)] text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        {!loading && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[#86868b] hover:bg-black/[0.05] hover:text-[#1d1d1f] transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Warning Icon (Apple Destructive Red) */}
        <div className="size-13 rounded-2xl bg-red-50 flex items-center justify-center text-[#ff3b30] mb-5">
          <Trash2 className="size-6.5" />
        </div>

        {/* Title */}
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
          {isDe ? 'Konto unwiderruflich löschen?' : 'Permanently Delete Account?'}
        </h2>

        {/* GDPR Compliance Note */}
        <p className="text-[13.5px] text-[#6e6e73] leading-relaxed mb-4">
          {isDe
            ? 'Gemäß Art. 17 DSGVO (Recht auf Vergessenwerden) werden deine Profildaten, E-Mail-Verknüpfungen sowie alle aktiven Inserate dauerhaft aus unserer Datenbank entfernt.'
            : 'In compliance with Art. 17 GDPR (Right to erasure), your profile data, email link, and all active listings will be permanently erased from our database.'}
        </p>

        {/* Bullet points */}
        <div className="rounded-2xl bg-[#f5f5f7] p-3.5 space-y-2 mb-5 text-[12.5px] text-[#1d1d1f]">
          <div className="flex items-start gap-2">
            <span className="text-[#ff3b30] font-bold">•</span>
            <span>
              {isDe
                ? 'Dein Benutzerkonto (' + (user?.email || 'Konto') + ') wird gelöscht.'
                : 'Your account (' + (user?.email || 'Account') + ') will be deleted.'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#ff3b30] font-bold">•</span>
            <span>
              {isDe
                ? 'Alle deine Stellen- und Wohnungsanzeigen werden sofort offline genommen.'
                : 'All your job and housing listings will be immediately taken offline.'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#ff3b30] font-bold">•</span>
            <span>
              {isDe
                ? 'Dieser Schritt kann nicht rückgängig gemacht werden.'
                : 'This action cannot be undone.'}
            </span>
          </div>
        </div>

        {/* Error / Reauth message */}
        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-200/60 p-3 mb-5 text-[12.5px] text-red-700 flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {needsReauth ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onRequiresReauth) onRequiresReauth();
              }}
              className="w-full py-3 rounded-full bg-[#0071e3] text-white font-medium text-[14px] hover:bg-[#0077ed] transition active:scale-[0.98] cursor-pointer"
            >
              <span>{isDe ? 'Neu anmelden & bestätigen' : 'Sign in again & confirm'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#ff3b30] text-white font-medium text-[14px] hover:bg-[#e03126] transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(255,59,48,0.25)]"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{isDe ? 'Wird gelöscht...' : 'Deleting...'}</span>
                </>
              ) : (
                <span>{isDe ? 'Konto endgültig löschen' : 'Permanently Delete Account'}</span>
              )}
            </button>
          )}

          {!loading && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-full text-[13.5px] font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition active:scale-[0.98] cursor-pointer"
            >
              <span>{isDe ? 'Abbrechen' : 'Cancel'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
