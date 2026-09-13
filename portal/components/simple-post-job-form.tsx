'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from '@/components/ui/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Gift,
  Share2,
  Copy,
  Check,
  MessageCircle,
  User as UserIcon,
  Loader2,
  Phone,
} from 'lucide-react';
import { saveMyListing, getMyListings, upgradeMyListingLocally } from '@/lib/storage/my-listings';
import {
  createJobInFirestore,
  isUserEligibleForFreeJob,
  markFreeJobUsed,
} from '@/lib/firebase/firestore-service';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';
import { AuthModal } from '@/components/auth-modal';
import {
  SUPPORTED_CITIES,
  getDistrictsForCity,
  getPopularDistrictsForCity,
} from '@/lib/domain/cities';

const QUICK_CITIES = [
  'Berlin',
  'Hamburg',
  'München',
  'Köln',
  'Frankfurt am Main',
  'Leipzig',
];

const EMPLOYMENT_TYPES = [
  'Minijob (bis 603 €)',
  'Teilzeit',
  'Werkstudent:in',
  'Kurzfristige Aushilfe',
  'Event / Wochenende',
  'Vollzeit',
];

const QUICK_WAGES = [
  '14,50 € / Std.',
  '15,00 € / Std.',
  '16,00 € / Std.',
  '18,00 € / Std.',
  '20,00 € / Std.',
];

export function SimplePostJobForm() {
  const { user, loading: authLoading } = useAuth();
  const { isDe } = useTranslation();
  const [authOpen, setAuthOpen] = useState(false);
  const [isFreeEligible, setIsFreeEligible] = useState(true);
  const [lastCreatedJob, setLastCreatedJob] = useState<{ id: string; slug: string; title: string } | null>(null);
  const [successCopied, setSuccessCopied] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    city: 'Berlin',
    district: 'Mitte',
    employmentType: 'Minijob (bis 603 €)',
    wage: '16,00 € / Std.',
    applyUrl: '',
    contactEmail: '',
    whatsapp: '',
    phone: '',
    description: '',
    tier: 'free' as 'free' | 'starter' | 'standard' | 'premium',
  });

  const currentFormDistricts = useMemo(() => {
    return getDistrictsForCity(formData.city);
  }, [formData.city]);

  const currentFormPopularDistricts = useMemo(() => {
    return getPopularDistrictsForCity(formData.city);
  }, [formData.city]);

  const handleFormCityChange = (cityName: string) => {
    const dists = getDistrictsForCity(cityName);
    const firstDist = dists[0] || 'Zentrum';
    setFormData((prev) => ({
      ...prev,
      city: cityName,
      district: firstDist,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto pre-fill user email when logged in
  useEffect(() => {
    if (user?.email && !formData.contactEmail) {
      setFormData((prev) => ({ ...prev, contactEmail: user.email || '' }));
    }
  }, [user]);

  // If user is not logged in after auth loads, auto-prompt auth modal
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthOpen(true);
    }
  }, [authLoading, user]);

  // Check 1st free job eligibility
  useEffect(() => {
    async function checkEligibility() {
      if (user?.uid) {
        const eligible = await isUserEligibleForFreeJob(user.uid);
        setIsFreeEligible(eligible);
        if (!eligible && formData.tier === 'free') {
          setFormData((prev) => ({ ...prev, tier: 'starter' }));
        } else if (eligible && formData.tier === 'starter') {
          setFormData((prev) => ({ ...prev, tier: 'free' }));
        }
      }
    }
    checkEligibility();
  }, [user]);

  // Pre-select tier if ?tier=... in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tier');
      if (t === 'premium' || t === 'standard' || t === 'starter' || t === 'free') {
        setFormData((prev) => ({ ...prev, tier: t as any }));
      }
    }
  }, []);

  const goToStep = (targetStep: 1 | 2 | 3) => {
    setError(null);
    if (targetStep === 2) {
      if (!formData.title.trim() || !formData.company.trim()) {
        setError('Bitte gib zuerst die Stellenbezeichnung und dein Unternehmen in Schritt 1 an.');
        return;
      }
    }
    if (targetStep === 3) {
      if (!formData.title.trim() || !formData.company.trim()) {
        setError('Bitte fülle zuerst Schritt 1 (Basisdaten) aus.');
        return;
      }
      if (!formData.description.trim()) {
        setError('Bitte gib in Schritt 2 eine kurze Tätigkeitsbeschreibung an.');
        return;
      }
    }
    setStep(targetStep);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Bitte gib eine Stellenbezeichnung ein.');
        return;
      }
      if (!formData.company.trim()) {
        setError('Bitte gib deinen Unternehmensnamen ein.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.description.trim()) {
        setError('Bitte beschreibe kurz die Aufgaben und Voraussetzungen.');
        return;
      }
      setStep(3);
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    if (
      !formData.applyUrl.trim() &&
      !formData.contactEmail.trim() &&
      !formData.whatsapp.trim() &&
      !formData.phone.trim()
    ) {
      setError('Bitte gib mindestens eine Kontaktmethode an (WhatsApp, E-Mail, Telefon oder Link).');
      return;
    }

    if (!user) {
      setError(
        isDe
          ? 'Bitte melde dich an oder erstelle ein kostenloses Konto, um deine Stelle zu inserieren.'
          : 'Please sign in or create a free account to post your job.'
      );
      setAuthOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const companySlug = formData.company
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const titleSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const submissionId = `direct-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const jobSlug = `${companySlug}-${titleSlug}-${submissionId.slice(-4)}`;

      const tierDurationDays = formData.tier === 'premium' ? 60 : formData.tier === 'standard' ? 30 : 15;
      const tierPricePaid =
        formData.tier === 'premium'
          ? 24.99
          : formData.tier === 'standard'
          ? 14.99
          : formData.tier === 'free'
          ? 0
          : 9.99;
      const tierLabel =
        formData.tier === 'premium'
          ? 'Extended Inserat (60 Tage)'
          : formData.tier === 'free'
          ? '🎁 Erstinserat (Gratis)'
          : formData.tier === 'standard'
          ? 'Standard Inserat (30 Tage)'
          : 'Quick Inserat (15 Tage)';

      // 1. Save locally so it's safely stored for this employer
      saveMyListing({
        id: submissionId,
        type: 'job',
        title: formData.title,
        subtitle: `${formData.company} · ${formData.district}, ${formData.city}`,
        badgeLabel: formData.wage,
        tier: formData.tier,
        tierLabel: tierLabel,
        status: 'active',
        postedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + tierDurationDays * 86400000).toISOString(),
        linkUrl: `/jobs/${jobSlug}`,
        pricePaidEur: tierPricePaid,
      });

      setLastCreatedJob({ id: submissionId, slug: jobSlug, title: formData.title });

      // 2. Save to Firestore if configured
      const assignedUserId = user?.uid || 'employer-' + Date.now();
      createJobInFirestore(
        {
          userId: assignedUserId,
          title: formData.title,
          company: formData.company,
          city: formData.city,
          district: formData.district,
          description: formData.description,
          payText: formData.wage,
          employmentType: formData.employmentType,
          contactEmail: formData.contactEmail || undefined,
          contactPhone: formData.phone || undefined,
          whatsapp: formData.whatsapp || undefined,
          applyUrl: formData.applyUrl || undefined,
          tier: formData.tier,
          status: 'active',
          slug: jobSlug,
        },
        submissionId
      ).catch(console.error);

      // 3. If user used free tier, record in Firestore
      if (formData.tier === 'free' && user?.uid) {
        markFreeJobUsed(user.uid, submissionId).catch(console.error);
        setIsFreeEligible(false);
      }

      // 4. Automatically notify Googlebot Instant Indexing API in real-time
      fetch('/api/jobs/notify-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobSlug }),
      }).catch((err) => console.warn('[Google Indexing] Notify error:', err));

      // 5. Dispatch update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('jobroofs_listings_updated'));
      }

      // If free tier, no checkout needed
      if (formData.tier === 'free') {
        setSuccess(true);
        setLoading(false);
        return;
      }

      // 4. Create Stripe checkout session
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: formData.tier,
          jobData: {
            slug: jobSlug,
            title: formData.title,
            company: formData.company,
            district: formData.district,
            wage: formData.wage,
            contactEmail: formData.contactEmail || undefined,
            contactPhone: formData.phone || undefined,
            whatsapp: formData.whatsapp || undefined,
            applyUrl: formData.applyUrl || undefined,
          },
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (checkoutData.checkoutUrl) {
        // Direct seamless redirect to Stripe Checkout
        window.location.href = checkoutData.checkoutUrl;
        return;
      }

      if (checkoutData.error && !checkoutData.mock) {
        setError(checkoutData.error);
        setLoading(false);
        return;
      }

      // If mock/preview mode or Stripe keys not present, show instant success
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="size-6 animate-spin mx-auto text-zinc-500" />
        <p className="mt-3 text-[12.5px] text-zinc-600 font-medium">
          {isDe ? 'Lade Kontostatus...' : 'Checking account status...'}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-3 sm:my-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7 text-center shadow-xs">
          <div className="size-11 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-black mb-3.5">
            <UserIcon className="size-5 stroke-[2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
            {isDe ? 'Anmelden zum Inserieren' : 'Sign in to post a job'}
          </h2>

          <p className="mt-2 text-[13.5px] text-zinc-700 leading-relaxed max-w-sm mx-auto">
            {isDe
              ? 'Um eine Stelle zu inserieren und Bewerbungen zu empfangen, erstelle bitte ein kostenloses Konto oder melde dich an.'
              : 'To post a job and receive direct candidate applications, please sign in or create a free account.'}
          </p>

          <div className="my-5 border-t border-zinc-200 pt-4 space-y-2.5 text-left max-w-xs mx-auto">
            <div className="flex items-center gap-2.5 text-[12.5px] text-black font-medium">
              <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{isDe ? '1. Stellenanzeige 100% kostenlos' : '1st job posting 100% free'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px] text-black font-medium">
              <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{isDe ? 'Direkter Kontakt zu Bewerbern deutschlandweit' : 'Direct contact with candidates nationwide'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[12.5px] text-black font-medium">
              <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{isDe ? 'Jederzeit im Profil verwalten' : 'Manage anytime in your profile'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="apple-press inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[220px] px-5 py-3 rounded-xl bg-black text-white text-[13px] font-semibold tracking-[0.02em] hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>{isDe ? 'Jetzt anmelden / registrieren' : 'Sign in / Register now'}</span>
            <ArrowRight className="size-4 stroke-[2]" />
          </button>
        </div>

        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="border border-zinc-200 bg-white p-8 sm:p-14 text-center max-w-xl mx-auto rounded-2xl shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-black text-white">
          <CheckCircle2 className="size-6 stroke-[2]" />
        </div>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-black tracking-tight">
          {formData.tier === 'free' ? 'Job erfolgreich kostenlos inseriert!' : 'Job erfolgreich inseriert.'}
        </h2>
        <p className="mt-3 text-[14.5px] text-zinc-800 leading-relaxed max-w-md mx-auto">
          Deine Anzeige für <span className="font-bold text-black">{formData.title}</span> bei{' '}
          <span className="font-bold text-black">{formData.company}</span> ist eingegangen und wird sofort{' '}
          <span className="font-bold text-black">im Direktbereich über der Suche und im Hero</span> geschaltet.
        </p>

        {/* Share Section on Success */}
        {lastCreatedJob && (
          <div className="mt-6 p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-left">
            <div className="text-[13px] font-bold text-black flex items-center gap-1.5">
              <Share2 className="size-4 text-black" />
              <span>Inserat sofort mit deinem Netzwerk oder Helfern teilen:</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const url = `${window.location.origin}/jobs/${lastCreatedJob.slug}`;
                    const text = encodeURIComponent(`Wir suchen Unterstützung in ${formData.city}: ${formData.title} bei ${formData.company} (${formData.wage})\n${url}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }
                }}
                className="apple-press inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-black hover:bg-zinc-100 transition-colors cursor-pointer active:scale-[0.98]"
              >
                <MessageCircle className="size-3.5 text-emerald-600" />
                <span>Per WhatsApp teilen</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const url = `${window.location.origin}/jobs/${lastCreatedJob.slug}`;
                    navigator.clipboard.writeText(url);
                    setSuccessCopied(true);
                    setTimeout(() => setSuccessCopied(false), 2000);
                  }
                }}
                className="apple-press inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-black hover:bg-zinc-100 transition-colors cursor-pointer active:scale-[0.98]"
              >
                {successCopied ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-zinc-600" />
                    <span>Link kopieren</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={lastCreatedJob ? `/jobs/${lastCreatedJob.slug}` : '/'}
            className="apple-press inline-flex items-center justify-center rounded-xl bg-black px-6 py-3.5 text-[13px] font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
          >
            Inserat ansehen
          </Link>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setStep(1);
              setFormData({
                title: '',
                company: '',
                city: 'Berlin',
                district: 'Mitte',
                employmentType: 'Minijob (bis 603 €)',
                wage: '16,00 € / Std.',
                applyUrl: '',
                contactEmail: '',
                whatsapp: '',
                phone: '',
                description: '',
                tier: isFreeEligible ? 'free' : 'starter',
              });
            }}
            className="apple-press inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-[13px] font-semibold text-black hover:bg-zinc-50 transition-colors cursor-pointer active:scale-[0.98]"
          >
            Weiteren Job inserieren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header & Step Tracker */}
      <div className="border-b border-zinc-200 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.22em] text-zinc-600 mb-1 sm:mb-1.5">
              {isDe ? 'FÜR ARBEITGEBER · DIREKTE INSERATE' : 'EMPLOYER INTAKE · DIRECT LISTINGS'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
              {isDe ? 'Job jetzt inserieren.' : 'Post a job now.'}
            </h1>
            <p className="mt-1 text-[14px] text-zinc-800 font-normal">
              {isDe
                ? 'Erreiche motivierte Studierende, Aushilfen und Fachkräfte direkt in deinem Kiez — ohne Agenturen.'
                : 'Reach motivated students, helpers, and local talents directly in your neighborhood — without agencies.'}
            </p>
            <p className="mt-1 text-[12px] text-zinc-600">
              {isFreeEligible ? (
                <span className="text-emerald-800 font-semibold">
                  {isDe ? '1. Inserat 100% kostenlos · ' : '1st listing 100% free · '}
                </span>
              ) : null}
              {isDe
                ? '9,99 € für 15 Tage · 14,99 € für 30 Tage · 24,99 € für 60 Tage · Mit dem Fortfahren stimmst du den '
                : '9.99 € for 15 days · 14.99 € for 30 days · 24.99 € for 60 days · By continuing, you agree to the '}
              <Link href="/agb" className="underline underline-offset-2 text-black font-medium hover:text-zinc-700 transition-colors">
                {isDe ? 'AGB' : 'Terms'}
              </Link>{' '}
              {isDe ? 'und' : 'and'}{' '}
              <Link href="/datenschutz" className="underline underline-offset-2 text-black font-medium hover:text-zinc-700 transition-colors">
                {isDe ? 'Richtlinien' : 'Privacy Policy'}
              </Link>{' '}
              {isDe ? 'zu.' : '.'}
            </p>

            {/* 1st Job Free Welcome Banner */}
            {!user ? (
              <div className="mt-2.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-emerald-950">
                <div className="flex items-start gap-2">
                  <div className="size-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="size-3" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-emerald-900">
                      {isDe
                        ? '1. Inserat 100% kostenlos für jeden neuen Benutzeraccount'
                        : '1st job listing 100% free for every new user account'}
                    </div>
                    <div className="text-[11.5px] text-emerald-800/90 font-medium mt-0.5">
                      {isDe
                        ? 'Melde dich kurz an oder erstelle ein kostenloses Konto, um dein 1. Inserat gratis zu schalten.'
                        : 'Sign in or create a free account to post your 1st job for free.'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="apple-press shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-[11.5px] font-semibold hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <span>{isDe ? 'Kostenlos anmelden' : 'Sign in for free'}</span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            ) : isFreeEligible ? (
              <div className="mt-2.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-2.5 flex items-center gap-2 text-emerald-950">
                <div className="size-5 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-3" />
                </div>
                <div className="text-[12px] text-emerald-900 font-medium">
                  {isDe ? (
                    <>
                      Willkommens-Vorteil aktiv für <span className="font-bold">{user.email}</span>: Dein 1. Job ist <strong>100% kostenlos</strong> (0 € / 15 Tage)!
                    </>
                  ) : (
                    <>
                      Welcome benefit active for <span className="font-bold">{user.email}</span>: Your 1st job is <strong>100% free</strong> (0 € / 15 days)!
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Luxury Segmented Step Indicator */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-zinc-200 bg-zinc-100/70 self-start sm:self-auto shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-[0.02em] transition-all cursor-pointer ${
                step === 1
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <span className="sm:hidden">1. {isDe ? 'Basis' : 'Basic'}</span>
              <span className="hidden sm:inline">1. {isDe ? 'Basisdaten' : 'Basic Info'}</span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-[0.02em] transition-all cursor-pointer ${
                step === 2
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <span className="sm:hidden">2. {isDe ? 'Details' : 'Details'}</span>
              <span className="hidden sm:inline">2. {isDe ? 'Konditionen' : 'Conditions'}</span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-[0.02em] transition-all cursor-pointer ${
                step === 3
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <span className="sm:hidden">3. {isDe ? 'Kontakt' : 'Publish'}</span>
              <span className="hidden sm:inline">3. {isDe ? 'Kontakt & Live' : 'Contact & Publish'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Centered Intake Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleNext} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50/80 p-3 text-[12.5px] font-medium text-red-800 border border-red-200">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basisdaten */}
          {step === 1 && (
            <div className="border border-zinc-200 bg-white p-5 sm:p-7 rounded-2xl shadow-xs space-y-4">
              <div className="border-b border-zinc-200 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                  1. Basisdaten der Stelle
                </h2>
                <p className="text-[12.5px] text-zinc-600 font-normal mt-0.5">
                  Worum geht es und wer sucht Verstärkung?
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Stellenbezeichnung *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z. B. Specialty Barista, Servicekraft, Event-Aushilfe"
                  className="w-full h-10 px-3 text-base sm:text-[13.5px] text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors shadow-2xs"
                />
              </div>

              {/* Company Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Arbeitgeber / Unternehmen *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="z. B. Café Morgenstern GmbH"
                  className="w-full h-10 px-3 text-base sm:text-[13.5px] text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors shadow-2xs"
                />
              </div>

              {/* City Selection (Nationwide) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Stadt in Deutschland *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {QUICK_CITIES.map((c) => {
                    const isSelected = formData.city.toLowerCase() === c.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleFormCityChange(c)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer active:scale-[0.97] ${
                          isSelected
                            ? 'bg-black text-white font-semibold shadow-xs'
                            : 'border border-zinc-200 text-zinc-800 hover:text-black hover:border-black bg-white'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
                <select
                  value={formData.city}
                  onChange={(e) => handleFormCityChange(e.target.value)}
                  className="w-full h-10 px-3 text-[13px] text-black font-medium border border-zinc-200 rounded-xl bg-white cursor-pointer focus:border-black outline-none transition-colors shadow-2xs"
                >
                  {SUPPORTED_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection Chips */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  {formData.city.toLowerCase().includes('köln') || formData.city.toLowerCase().includes('koeln')
                    ? 'Veedel / Stadtteil *'
                    : 'Bezirk / Stadtteil *'}
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {currentFormPopularDistricts.map((d) => {
                    const isSelected = formData.district === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData({ ...formData, district: d })}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer active:scale-[0.97] ${
                          isSelected
                            ? 'bg-black text-white font-semibold shadow-xs'
                            : 'border border-zinc-200 text-zinc-800 hover:text-black hover:border-black bg-white'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown for All Districts in Selected City */}
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full h-10 px-3 text-[13px] text-black font-medium border border-zinc-200 rounded-xl bg-white cursor-pointer focus:border-black outline-none transition-colors shadow-2xs"
                >
                  {currentFormDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d} ({formData.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-end">
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>Weiter zu Konditionen</span>
                  <ArrowRight className="size-3.5 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Konditionen */}
          {step === 2 && (
            <div className="border border-zinc-200 bg-white p-5 sm:p-7 rounded-2xl shadow-xs space-y-4">
              <div className="border-b border-zinc-200 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                  2. Konditionen & Aufgaben
                </h2>
                <p className="text-[12.5px] text-zinc-600 font-normal mt-0.5">
                  Vergütung, Anstellungsform und Tätigkeitsbeschreibung.
                </p>
              </div>

              {/* Employment Type Chips */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Anstellungsart *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EMPLOYMENT_TYPES.map((t) => {
                    const isSelected = formData.employmentType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, employmentType: t })}
                        className={`p-2.5 rounded-xl border text-left text-[12px] transition-all cursor-pointer active:scale-[0.98] ${
                          isSelected
                            ? 'border-black bg-black text-white shadow-xs font-semibold'
                            : 'border-zinc-200 bg-white text-zinc-800 hover:text-black hover:border-black font-medium'
                        }`}
                      >
                        <div>{t.split('(')[0]}</div>
                        {t.includes('(') && (
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            ({t.split('(')[1]}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wage Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                  Vergütung / Stundenlohn *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_WAGES.map((w) => {
                    const isSelected = formData.wage === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFormData({ ...formData, wage: w })}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-mono transition-all cursor-pointer active:scale-[0.97] ${
                          isSelected
                            ? 'bg-black text-white font-bold shadow-xs'
                            : 'border border-zinc-200 text-zinc-800 hover:text-black hover:border-black bg-white font-medium'
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={formData.wage}
                  onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                  placeholder="Oder individuelle Angabe, z. B. 18,50 € / Std. + Trinkgeld"
                  className="w-full h-10 px-3 text-base sm:text-[13px] text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mt-1.5 shadow-2xs"
                />
              </div>

              {/* Description Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Aufgaben & Profil *
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Klar & unkompliziert
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreibe kurz die Aufgaben, gewünschte Schichten oder Sprachkenntnisse (z. B. Deutsch B1 oder Englisch)."
                  className="w-full p-3 text-base sm:text-[13.5px] text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-y leading-relaxed shadow-2xs"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-zinc-600 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-3.5 stroke-[2]" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>Weiter zu Kontakt & Live</span>
                  <ArrowRight className="size-3.5 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Kontakt & Live */}
          {step === 3 && (
            <div className="border border-zinc-200 bg-white p-5 sm:p-7 rounded-2xl shadow-xs space-y-4">
              <div className="border-b border-zinc-200 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                  3. Bewerbungsmethode & Veröffentlichung
                </h2>
                <p className="text-[12.5px] text-zinc-600 font-normal mt-0.5">
                  Wie sollen interessierte Talente direkt mit dir in Kontakt treten?
                </p>
              </div>

              {/* Direct Application Options */}
              <div className="space-y-3">
                {/* 1. WhatsApp Instant Chat (Recommended) */}
                <div className="space-y-1.5 p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-950 flex items-center gap-1.5">
                      <MessageCircle className="size-3.5 text-emerald-600" />
                      <span>WhatsApp-Nummer (Empfohlen für 1-Klick-Bewerbung)</span>
                    </label>
                    <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-sm">
                      Top-Rücklauf
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+49 176 12345678"
                    className="w-full h-10 px-3 text-base sm:text-[13.5px] text-black placeholder:text-zinc-400 border border-emerald-300 bg-white rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-colors shadow-2xs"
                  />
                  <p className="text-[11.5px] text-emerald-900 font-medium">
                    Bewerber können dir direkt mit 1 Klick auf WhatsApp schreiben. Ideal für Cafés, Gastro, Kiez-Läden & Aushilfen.
                  </p>
                </div>

                {/* 2. Email Contact */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Bewerbungs-E-Mail / Ansprechpartner
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="jobs@morgenstern-cafe.berlin"
                    className="w-full h-10 px-3 text-base sm:text-[13.5px] text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors shadow-2xs"
                  />
                  <p className="text-[11.5px] text-zinc-600 font-normal">
                    Kandidaten senden ihre Kurzbewerbung direkt an diese Adresse.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 3. Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700 flex items-center gap-1">
                      <Phone className="size-3 text-black" />
                      <span>Telefon (optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="030 1234567"
                      className="w-full h-10 px-3 text-base sm:text-[13.5px] text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-white focus:border-black outline-none transition-colors shadow-2xs"
                    />
                  </div>

                  {/* 4. Apply URL */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                      Website / Link (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.applyUrl}
                      onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                      placeholder="https://dein-betrieb.de"
                      className="w-full h-10 px-3 text-base sm:text-[13.5px] text-black placeholder:text-zinc-400 border border-zinc-200 rounded-xl bg-white focus:border-black outline-none transition-colors shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Placement / Tier Selector */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Laufzeit & Modell wählen
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Über 75% günstiger als herkömmliche Portale
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {isFreeEligible ? (
                    /* Free 1st Job Tier */
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: 'free' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        formData.tier === 'free'
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600 shadow-xs'
                          : 'border-zinc-200 bg-white hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-black flex items-center gap-1.5">
                          <Gift className="size-3.5 text-emerald-600" />
                          <span>1. Inserat Gratis</span>
                        </span>
                        <span className="font-mono text-[13px] font-bold text-emerald-700">0 €</span>
                      </div>
                      <p className="mt-1 text-[11.5px] text-zinc-700 leading-relaxed">
                        15 Tage Laufzeit &middot; 100% Direktkontakt &middot; Sofort live ohne Zahlungsdaten.
                      </p>
                    </button>
                  ) : (
                    /* Starter Tier */
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: 'starter' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.tier === 'starter'
                          ? 'border-black bg-zinc-50 shadow-xs ring-2 ring-black font-semibold'
                          : 'border-zinc-200 bg-white hover:border-black/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-black">Quick (15 Tage)</span>
                        <span className="font-mono text-[13px] font-bold text-black">9,99 €</span>
                      </div>
                      <p className="mt-1 text-[11.5px] text-zinc-600 leading-relaxed">
                        15 Tage Laufzeit &middot; Sofort im Direktbereich &middot; 100% Direktkontakt.
                      </p>
                    </button>
                  )}

                  {/* Standard Tier */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: 'standard' })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.tier === 'standard'
                        ? 'border-black bg-zinc-50 shadow-xs ring-2 ring-black font-semibold'
                        : 'border-zinc-200 bg-white hover:border-black/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-black">Standard (30 Tage)</span>
                      <span className="font-mono text-[13px] font-bold text-black">14,99 €</span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-zinc-600 leading-relaxed">
                      30 Tage Laufzeit &middot; Über 75% günstiger als andere Portale &middot; Inkl. Stadtfilter.
                    </p>
                  </button>

                  {/* Extended Tier (60 Days) */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: 'premium' })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.tier === 'premium'
                        ? 'border-black bg-zinc-50 shadow-xs ring-2 ring-black font-semibold'
                        : 'border-zinc-200 bg-white hover:border-black/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold text-black">Extended (60 Tage)</span>
                      <span className="font-mono text-[13px] font-bold text-black">24,99 €</span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-zinc-600 leading-relaxed">
                      60 Tage doppelte Laufzeit &middot; Top-Platzierung &middot; Maximale Reichweite.
                    </p>
                  </button>
                </div>
              </div>

              {/* Trust Badge with Social Proof */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 flex items-start gap-3 text-[12.5px] text-zinc-800 shadow-2xs">
                <ShieldCheck className="size-4.5 text-black shrink-0 mt-0.5 stroke-[2]" />
                <div>
                  <p className="font-bold text-black">
                    Trusted by 50+ employers and over 500+ workers
                  </p>
                  <p className="mt-0.5 text-zinc-700 leading-relaxed">
                    100% Unabhängig · Keine Zeitarbeitsfirmen, keine Scraper, keine veralteten Tabellen. Direkter Kontakt über WhatsApp, Telefon oder E-Mail.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] text-zinc-600 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-3.5 stroke-[2]" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="apple-press inline-flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  {loading ? (
                    'Verarbeitung...'
                  ) : (
                    <>
                      <span>
                        {formData.tier === 'free'
                          ? 'Jetzt kostenlos live schalten (0 €)'
                          : formData.tier === 'premium'
                          ? 'Mit Stripe sicher bezahlen (24,99 €)'
                          : formData.tier === 'standard'
                          ? 'Mit Stripe sicher bezahlen (14,99 €)'
                          : 'Mit Stripe sicher bezahlen (9,99 €)'}
                      </span>
                      <ArrowRight className="size-3.5 stroke-[2]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Support & Enquiry Channel */}
        <div className="mt-8 p-4 rounded-xl border border-zinc-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-zinc-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
            <span className="font-medium">
              {isDe
                ? 'Fragen, Rechnungen oder persönliche Betreuung für dein Inserat?'
                : 'Questions, billing, or personal assistance for your listing?'}
            </span>
          </div>
          <a
            href="mailto:jobroofs@gmail.com"
            className="font-mono text-[13px] text-black font-bold hover:underline shrink-0"
          >
            jobroofs@gmail.com
          </a>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
