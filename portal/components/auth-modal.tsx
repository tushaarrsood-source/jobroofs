'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle,
}: AuthModalProps) {
  const { isDe } = useTranslation();
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    clearError();
    setLocalError(null);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      setLocalError(err.message || 'Google Anmeldung fehlgeschlagen');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError(isDe ? 'Bitte fülle alle Pflichtfelder aus.' : 'Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      setLocalError(err.message || 'Anmeldung fehlgeschlagen');
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveTitle =
    title ||
    (mode === 'signin'
      ? isDe
        ? 'Willkommen zurück'
        : 'Welcome Back'
      : isDe
      ? 'Konto erstellen'
      : 'Create Account');

  const effectiveSubtitle =
    subtitle ||
    (isDe
      ? 'Melde dich an, um Inserate zu verwalten und direkt zu veröffentlichen.'
      : 'Sign in to manage and publish your listings.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-black/[0.08] bg-white p-6 sm:p-7 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f] transition cursor-pointer"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-[#1d1d1f]">
            {effectiveTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-[#86868b] leading-relaxed">
            {effectiveSubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {(error || localError) && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 leading-snug">
            {localError || error}
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-black/[0.12] bg-white px-4 py-2.5 text-[13px] sm:text-sm font-semibold text-[#1d1d1f] shadow-2xs transition hover:bg-black/[0.02] hover:border-black/[0.2] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {/* Google SVG */}
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isDe ? 'Mit Google fortfahren' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.06]" />
          </div>
          <span className="relative bg-white px-2.5 text-[11px] font-medium text-[#86868b] uppercase tracking-wider">
            {isDe ? 'oder mit E-Mail' : 'or with email'}
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmitEmail} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                {isDe ? 'Name / Betrieb' : 'Name / Company'}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#86868b]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isDe ? 'z. B. Café Morgenstern' : 'e.g. Café Morgenstern'}
                  className="w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7]/60 py-2 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-[#0071e3] focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
              E-Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#86868b]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                className="w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7]/60 py-2 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-[#0071e3] focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#86868b]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7]/60 py-2 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-[#0071e3] focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="apple-btn-primary w-full !h-10 !text-xs font-semibold mt-1"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === 'signin' ? (
              isDe ? 'Anmelden' : 'Sign In'
            ) : (
              isDe ? 'Konto erstellen' : 'Register'
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-4 text-center text-xs text-[#86868b]">
          {mode === 'signin' ? (
            <p>
              {isDe ? 'Noch kein Konto? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  clearError();
                  setLocalError(null);
                }}
                className="font-semibold text-[#0071e3] hover:underline cursor-pointer"
              >
                {isDe ? 'Jetzt registrieren' : 'Register now'}
              </button>
            </p>
          ) : (
            <p>
              {isDe ? 'Bereits registriert? ' : 'Already registered? '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  clearError();
                  setLocalError(null);
                }}
                className="font-semibold text-[#0071e3] hover:underline cursor-pointer"
              >
                {isDe ? 'Hier anmelden' : 'Sign in here'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
