'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User as UserIcon, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
  defaultMode?: 'signin' | 'signup';
}

function formatAuthError(err: any, isDe: boolean): string {
  const code = err?.code || '';
  const message = err?.message || '';

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    message.includes('INVALID_LOGIN_CREDENTIALS') ||
    message.includes('invalid-credential')
  ) {
    return isDe
      ? 'E-Mail oder Passwort nicht korrekt. Falls du noch kein Konto hast, klicke bitte oben auf „Registrieren“.'
      : 'Incorrect email or password. If you do not have an account yet, please click "Register" above.';
  }
  if (code === 'auth/user-not-found') {
    return isDe
      ? 'Kein Konto mit dieser E-Mail gefunden. Bitte erstelle zuerst ein kostenloses Konto (oben auf „Registrieren“ klicken).'
      : 'No account found with this email. Please click "Register" above to create one.';
  }
  if (code === 'auth/email-already-in-use') {
    return isDe
      ? 'Für diese E-Mail existiert bereits ein Konto. Bitte klicke oben auf „Anmelden“.'
      : 'An account already exists with this email. Please switch to "Sign In" above.';
  }
  if (code === 'auth/weak-password') {
    return isDe
      ? 'Das Passwort ist zu kurz. Es muss mindestens 6 Zeichen lang sein.'
      : 'Password is too weak. It must be at least 6 characters long.';
  }
  if (code === 'auth/invalid-email') {
    return isDe
      ? 'Bitte gib eine gültige E-Mail-Adresse ein.'
      : 'Please enter a valid email address.';
  }
  if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
    return isDe
      ? 'Domain in Firebase Authentication noch nicht autorisiert. Bitte in der Firebase Console unter Authentication -> Settings -> Authorized domains „jobroofs.com“ und „www.jobroofs.com“ hinzufügen.'
      : 'Domain not authorized in Firebase Console -> Authentication -> Settings -> Authorized domains. Please add "jobroofs.com".';
  }
  if (code === 'auth/popup-closed-by-user') {
    return isDe
      ? 'Das Google-Anmeldefenster wurde vor dem Abschluss geschlossen.'
      : 'Google sign-in popup was closed before completion.';
  }
  if (code === 'auth/popup-blocked') {
    return isDe
      ? 'Das Pop-up-Fenster wurde vom Browser blockiert. Bitte Pop-ups für jobroofs.com erlauben.'
      : 'Popup was blocked by your browser. Please allow popups for jobroofs.com.';
  }
  if (code === 'auth/too-many-requests') {
    return isDe
      ? 'Zu viele Fehlversuche. Bitte warte einen Moment oder setze dein Passwort zurück.'
      : 'Too many attempts. Please wait a moment or reset your password.';
  }

  return message || (isDe ? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' : 'An error occurred. Please try again.');
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle,
  defaultMode = 'signin',
}: AuthModalProps) {
  const { isDe } = useTranslation();
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    error,
    clearError,
  } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setLocalError(null);
      setResetSent(false);
      clearError();
    }
  }, [isOpen, defaultMode]);

  if (!isOpen || !mounted) return null;

  const handleClose = () => {
    clearError();
    setLocalError(null);
    setResetSent(false);
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
      setLocalError(formatAuthError(err, isDe));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setLocalError(isDe ? 'Bitte gib deine E-Mail-Adresse ein.' : 'Please enter your email.');
      return;
    }

    if (mode === 'reset') {
      setIsSubmitting(true);
      setLocalError(null);
      try {
        await sendPasswordReset(email);
        setResetSent(true);
      } catch (err: any) {
        setLocalError(formatAuthError(err, isDe));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setLocalError(isDe ? 'Bitte gib dein Passwort ein.' : 'Please enter your password.');
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
      setLocalError(formatAuthError(err, isDe));
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
      : mode === 'signup'
      ? isDe
        ? 'Konto erstellen'
        : 'Create Account'
      : isDe
      ? 'Passwort zurücksetzen'
      : 'Reset Password');

  const effectiveSubtitle =
    subtitle ||
    (mode === 'signin'
      ? isDe
        ? 'Melde dich an, um Inserate zu verwalten und direkt zu veröffentlichen.'
        : 'Sign in to manage and publish your listings.'
      : mode === 'signup'
      ? isDe
        ? 'Kostenlos registrieren und sofort Minijobs oder Temp-Jobs inserieren.'
        : 'Sign up for free to post temp jobs and manage your profile.'
      : isDe
      ? 'Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum Zurücksetzen deines Passworts.'
      : 'Enter your email address and we will send you a reset link.');

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-black/[0.08] bg-white p-6 sm:p-7 shadow-2xl transition-all my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f] transition cursor-pointer"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Mode Switcher Segmented Control */}
        {mode !== 'reset' ? (
          <div className="mb-5 flex rounded-full bg-[#f5f5f7] p-1 border border-black/[0.04]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setLocalError(null);
                clearError();
              }}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#1d1d1f] shadow-xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              {isDe ? 'Anmelden' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setLocalError(null);
                clearError();
              }}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#1d1d1f] shadow-xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              {isDe ? 'Konto erstellen' : 'Register'}
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setLocalError(null);
                setResetSent(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3] hover:underline cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>{isDe ? 'Zurück zur Anmeldung' : 'Back to sign in'}</span>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-1">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-[#1d1d1f]">
            {effectiveTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-[#86868b] leading-relaxed">
            {effectiveSubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {(localError || error) && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 leading-snug">
            {localError || (error ? formatAuthError({ message: error }, isDe) : null)}
          </div>
        )}

        {/* Password Reset Confirmation Banner */}
        {resetSent && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 leading-snug flex items-start gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {isDe ? 'E-Mail wurde versendet!' : 'Reset email sent!'}
              </p>
              <p className="mt-0.5 text-[#5c6863]">
                {isDe
                  ? 'Prüfe bitte deinen Posteingang (und ggf. Spam-Ordner) und folge den Anweisungen.'
                  : 'Please check your inbox (and spam folder) and follow the instructions.'}
              </p>
            </div>
          </div>
        )}

        {/* Google Sign-In Button (shown for signin & signup) */}
        {mode !== 'reset' && (
          <>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-black/[0.12] bg-white px-4 py-2.5 text-[13px] sm:text-sm font-semibold text-[#1d1d1f] shadow-2xs transition hover:bg-black/[0.02] hover:border-black/[0.2] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
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
                <span>
                  {mode === 'signin'
                    ? isDe
                      ? 'Mit Google anmelden'
                      : 'Continue with Google'
                    : isDe
                    ? 'Mit Google registrieren'
                    : 'Sign up with Google'}
                </span>
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
          </>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmitEmail} className="space-y-3 mt-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                {isDe ? 'Name oder Unternehmen (optional)' : 'Name or Company (optional)'}
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

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  Passwort
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      setLocalError(null);
                      setResetSent(false);
                    }}
                    className="text-[11px] font-medium text-[#0071e3] hover:underline cursor-pointer"
                  >
                    {isDe ? 'Passwort vergessen?' : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#86868b]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? (isDe ? 'Mindestens 6 Zeichen' : 'Min. 6 characters') : '••••••••'}
                  className="w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7]/60 py-2 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:border-[#0071e3] focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="apple-btn-primary w-full !h-10 !text-xs font-semibold mt-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === 'signin' ? (
              isDe ? 'Anmelden' : 'Sign In'
            ) : mode === 'signup' ? (
              isDe ? 'Konto kostenlos erstellen' : 'Create Free Account'
            ) : (
              isDe ? 'Link anfordern' : 'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer info & toggle */}
        {mode !== 'reset' && (
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
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
