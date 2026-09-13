'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from '@/components/ui/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  Gift,
  Share2,
  Copy,
  Check,
  MessageCircle,
  User as UserIcon,
  Loader2,
  Phone,
  FileText,
} from 'lucide-react';
import { AiJobCreatorChat, ExtractedJobData } from '@/components/ai-job-creator-chat';
import { saveMyListing, getMyListings, upgradeMyListingLocally } from '@/lib/storage/my-listings';
import {
  createJobInFirestore,
  isUserEligibleForFreeJob,
  markFreeJobUsed,
} from '@/lib/firebase/firestore-service';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';
import { AuthModal } from '@/components/auth-modal';
import { isMasterAccount } from '@/lib/domain/master-accounts';
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
  const isMaster = user?.email ? isMasterAccount(user.email) : false;
  const [authOpen, setAuthOpen] = useState(false);
  const [isFreeEligible, setIsFreeEligible] = useState(true);
  const [lastCreatedJob, setLastCreatedJob] = useState<{ id: string; slug: string; title: string } | null>(null);
  const [successCopied, setSuccessCopied] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [postMode, setPostMode] = useState<'ai' | 'classic'>('ai');

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

      // If free tier or master account, no checkout needed (instant activation)
      if (formData.tier === 'free' || isMaster) {
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
            userId: assignedUserId,
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
      <div className="max-w-xl mx-auto py-8 sm:py-16 text-center px-3 sm:px-4">
        <div className="size-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-black mb-5">
          <UserIcon className="size-7 stroke-[2]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
          {isDe ? 'Anmelden zum Inserieren' : 'Sign in to post a job'}
        </h2>

        <p className="mt-3 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-md mx-auto">
          {isDe
            ? 'Um eine Stelle zu inserieren und Bewerbungen zu empfangen, erstelle bitte ein kostenloses Konto oder melde dich an.'
            : 'To post a job and receive direct candidate applications, please sign in or create a free account.'}
        </p>

        <div className="my-8 space-y-3.5 text-left max-w-sm mx-auto">
          <div className="flex items-center gap-3 text-sm sm:text-base text-black font-medium">
            <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
            <span>{isDe ? '1. Stellenanzeige 100% kostenlos' : '1st job posting 100% free'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:text-base text-black font-medium">
            <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
            <span>{isDe ? 'Direkter Kontakt zu Bewerbern deutschlandweit' : 'Direct contact with candidates nationwide'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:text-base text-black font-medium">
            <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
            <span>{isDe ? 'Jederzeit im Profil verwalten' : 'Manage anytime in your profile'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="apple-press inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[260px] px-8 py-4 rounded-2xl bg-black text-white text-base font-semibold tracking-[0.02em] hover:bg-zinc-800 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <span>{isDe ? 'Jetzt anmelden / registrieren' : 'Sign in / Register now'}</span>
          <ArrowRight className="size-4 stroke-[2]" />
        </button>

        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-8 sm:py-16 text-center px-3 sm:px-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-black text-white shadow-xs">
          <CheckCircle2 className="size-7 stroke-[2]" />
        </div>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-black tracking-tight">
          {formData.tier === 'free' ? 'Job erfolgreich kostenlos inseriert!' : 'Job erfolgreich inseriert.'}
        </h2>
        <p className="mt-3 text-base sm:text-lg text-zinc-700 leading-relaxed max-w-md mx-auto">
          Deine Anzeige für <span className="font-bold text-black">{formData.title}</span> bei{' '}
          <span className="font-bold text-black">{formData.company}</span> ist eingegangen und wird sofort{' '}
          <span className="font-bold text-black">im Direktbereich über der Suche und im Hero</span> geschaltet.
        </p>

        {/* Share Section on Success */}
        {lastCreatedJob && (
          <div className="mt-8 text-left space-y-3">
            <div className="text-sm font-bold text-black flex items-center gap-2">
              <Share2 className="size-4 text-black" />
              <span>Inserat sofort mit deinem Netzwerk oder Helfern teilen:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const url = `${window.location.origin}/jobs/${lastCreatedJob.slug}`;
                    const text = encodeURIComponent(`Wir suchen Unterstützung in ${formData.city}: ${formData.title} bei ${formData.company} (${formData.wage})\n${url}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }
                }}
                className="apple-press inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-zinc-200 transition-all cursor-pointer active:scale-[0.98]"
              >
                <MessageCircle className="size-4 text-emerald-600" />
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
                className="apple-press inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-zinc-200 transition-all cursor-pointer active:scale-[0.98]"
              >
                {successCopied ? (
                  <>
                    <Check className="size-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4 text-zinc-600" />
                    <span>Link kopieren</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={lastCreatedJob ? `/jobs/${lastCreatedJob.slug}` : '/'}
            className="apple-press inline-flex items-center justify-center rounded-2xl bg-black px-7 py-4 text-base font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
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
            className="apple-press inline-flex items-center justify-center rounded-2xl bg-zinc-100 px-7 py-4 text-base font-semibold text-black hover:bg-zinc-200 transition-colors cursor-pointer active:scale-[0.98]"
          >
            Weiteren Job inserieren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Clean Minimal Header */}
      <div className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black">
            {isDe ? 'Job inserieren' : 'Post a job'}
          </h1>
          <p className="mt-1 text-base sm:text-lg text-zinc-600 font-normal">
            {isDe
              ? 'Direkt Bewerber in deiner Stadt ohne Vermittler erreichen.'
              : 'Reach candidates in your city directly without agencies.'}
          </p>
          </div>

          {/* Mode Switcher & Segmented Step Indicator */}
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {/* Mode Switcher */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-zinc-100 shrink-0">
              <button
                type="button"
                onClick={() => setPostMode('ai')}
                className={`apple-press inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  postMode === 'ai'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                <MessageSquare className="size-3.5" />
                <span>{isDe ? 'Inserat-Assistent' : 'Assistant'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPostMode('classic')}
                className={`apple-press inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  postMode === 'classic'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                <FileText className="size-3.5" />
                <span>{isDe ? 'Klassisches Formular' : 'Standard Form'}</span>
              </button>
            </div>

            {/* Step Indicator (visible in classic form mode) */}
            {postMode === 'classic' && (
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 shrink-0">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    step === 1
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <span>1. {isDe ? 'Basis' : 'Basic'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    step === 2
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <span>2. {isDe ? 'Details' : 'Details'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    step === 3
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  <span>3. {isDe ? 'Live' : 'Publish'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {postMode === 'ai' ? (
        <AiJobCreatorChat
          initialJobData={formData}
          onSwitchToClassic={() => setPostMode('classic')}
          onApplyToForm={(extracted: ExtractedJobData, targetStep?: 1 | 2 | 3) => {
            setFormData((prev) => ({
              ...prev,
              title: extracted.title || prev.title,
              company: extracted.company || prev.company,
              city: extracted.city || prev.city,
              district: extracted.district || prev.district,
              employmentType: extracted.employmentType || prev.employmentType,
              wage: extracted.wage || prev.wage,
              description: extracted.description || prev.description,
              whatsapp: extracted.whatsapp || prev.whatsapp,
              contactEmail: extracted.contactEmail || prev.contactEmail,
              phone: extracted.phone || prev.phone,
              applyUrl: extracted.applyUrl || prev.applyUrl,
            }));
            setStep(targetStep || 1);
            setPostMode('classic');
          }}
        />
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Main Centered Intake Form */}
          <form onSubmit={handleNext} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-900">
              <AlertCircle className="size-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basisdaten */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="pb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                  1. Basisdaten der Stelle
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 font-normal mt-1">
                  Worum geht es und wer sucht Verstärkung?
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                    Stellenbezeichnung *
                  </label>
                  <span className="text-xs text-zinc-500 font-medium">
                    AGG-konform (m/w/d)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z. B. Specialty Barista (m/w/d), Servicekraft (m/w/d)"
                  className="w-full h-12 px-4 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all shadow-xs"
                />
                <p className="text-xs sm:text-sm text-zinc-500 font-normal">
                  {isDe
                    ? 'Hinweis nach AGG: Bitte diskriminierungsfreie Bezeichnungen wählen oder den Zusatz (m/w/d) ergänzen.'
                    : 'Equal treatment notice: Please use gender-neutral job titles or include (m/w/d).'}
                </p>
              </div>

              {/* Company Input */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                  Arbeitgeber / Unternehmen *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="z. B. Café Morgenstern GmbH"
                  className="w-full h-12 px-4 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all shadow-xs"
                />
              </div>

              {/* City Selection (Nationwide) */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                  Stadt in Deutschland *
                </label>
                <div className="flex flex-wrap gap-2 mb-1.5">
                  {QUICK_CITIES.map((c) => {
                    const isSelected = formData.city.toLowerCase() === c.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleFormCityChange(c)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer active:scale-[0.97] ${
                          isSelected
                            ? 'bg-black text-white font-semibold shadow-xs'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
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
                  className="w-full h-12 px-4 text-base text-black font-medium rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black cursor-pointer outline-none transition-all shadow-xs"
                >
                  {SUPPORTED_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* District Selection Chips */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                  {formData.city.toLowerCase().includes('köln') || formData.city.toLowerCase().includes('koeln')
                    ? 'Veedel / Stadtteil *'
                    : 'Bezirk / Stadtteil *'}
                </label>
                <div className="flex flex-wrap gap-2 mb-1.5">
                  {currentFormPopularDistricts.map((d) => {
                    const isSelected = formData.district === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData({ ...formData, district: d })}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer active:scale-[0.97] ${
                          isSelected
                            ? 'bg-black text-white font-semibold shadow-xs'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
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
                  className="w-full h-12 px-4 text-base text-black font-medium rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black cursor-pointer outline-none transition-all shadow-xs"
                >
                  {currentFormDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d} ({formData.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-sm sm:text-base font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <span>Weiter zu Konditionen</span>
                  <ArrowRight className="size-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Konditionen */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="pb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                  2. Konditionen & Aufgaben
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 font-normal mt-1">
                  Vergütung, Anstellungsform und Tätigkeitsbeschreibung.
                </p>
              </div>

              {/* Employment Type Chips */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                  Anstellungsart *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EMPLOYMENT_TYPES.map((t) => {
                    const isSelected = formData.employmentType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, employmentType: t })}
                        className={`p-3.5 rounded-2xl text-left text-xs sm:text-sm transition-all cursor-pointer active:scale-[0.98] ${
                          isSelected
                            ? 'bg-black text-white shadow-xs font-semibold'
                            : 'bg-[#f4f4f3] hover:bg-zinc-200 text-zinc-800 font-medium'
                        }`}
                      >
                        <div className="font-semibold">{t.split('(')[0]}</div>
                        {t.includes('(') && (
                          <div className={`text-xs mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            ({t.split('(')[1]}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wage Selector */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                  Vergütung / Stundenlohn *
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_WAGES.map((w) => {
                    const isSelected = formData.wage === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFormData({ ...formData, wage: w })}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all cursor-pointer active:scale-[0.97] ${
                          isSelected
                            ? 'bg-black text-white font-bold shadow-xs'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium'
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
                  className="w-full h-12 px-4 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all mt-2 shadow-xs"
                />
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                    Aufgaben & Profil *
                  </label>
                  <span className="text-xs text-zinc-500 font-medium">
                    Klar & unkompliziert
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreibe kurz die Aufgaben, gewünschte Schichten oder Sprachkenntnisse (z. B. Deutsch B1 oder Englisch)."
                  className="w-full p-4 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all resize-y leading-relaxed shadow-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-sm sm:text-base text-zinc-600 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-4 stroke-[2]" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  className="apple-press inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-sm sm:text-base font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <span>Weiter zu Kontakt & Live</span>
                  <ArrowRight className="size-4 stroke-[2]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Kontakt & Live */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="pb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                  3. Bewerbungsmethode & Veröffentlichung
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 font-normal mt-1">
                  Wie sollen interessierte Talente direkt mit dir in Kontakt treten?
                </p>
              </div>

              {/* Direct Application Options */}
              <div className="space-y-3.5">
                {/* 1. WhatsApp Instant Chat (Recommended) */}
                <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-emerald-50/70">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                      <MessageCircle className="size-4 text-emerald-600" />
                      <span>WhatsApp-Nummer (Empfohlen für 1-Klick-Bewerbung)</span>
                    </label>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-md">
                      Top-Rücklauf
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+49 176 12345678"
                    className="w-full h-12 px-4 text-base text-black placeholder:text-zinc-400 bg-white rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all shadow-xs"
                  />
                  <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                    Bewerber können dir direkt mit 1 Klick auf WhatsApp schreiben. Ideal für Cafés, Gastro, Kiez-Läden & Aushilfen.
                  </p>
                </div>

                {/* 2. Email Contact */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                    Bewerbungs-E-Mail / Ansprechpartner
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="jobs@morgenstern-cafe.berlin"
                    className="w-full h-12 px-4 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all shadow-xs"
                  />
                  <p className="text-xs sm:text-sm text-zinc-600 font-normal">
                    Kandidaten senden ihre Kurzbewerbung direkt an diese Adresse.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 3. Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                      <Phone className="size-3.5 text-black" />
                      <span>Telefon (optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="030 1234567"
                      className="w-full h-12 px-4 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all shadow-xs"
                    />
                  </div>

                  {/* 4. Apply URL */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                      Website / Link (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.applyUrl}
                      onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                      placeholder="https://dein-betrieb.de"
                      className="w-full h-12 px-4 text-base text-black placeholder:text-zinc-400 rounded-2xl bg-[#f4f4f3] focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Placement / Tier Selector */}
              <div className="space-y-2.5 pt-1">
                {isMaster && (
                  <div className="mb-4 rounded-2xl bg-amber-50/90 p-4 flex items-center justify-between text-xs sm:text-sm text-amber-950 shadow-xs">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="size-5 text-amber-700 shrink-0" />
                      <div>
                        <p className="font-bold">👑 Master-Zugang aktiv ({user?.email})</p>
                        <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                          Voller Testmodus aktiv. Jedes Inserat-Modell (Quick, Standard, Extended) kann ohne Kreditkartenzahlung getestet und sofort scharf geschaltet werden.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold bg-amber-200/90 text-amber-900 px-3 py-1 rounded-lg shrink-0 ml-3">
                      0 € TESTMODUS
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-700">
                    Laufzeit & Modell wählen
                  </label>
                  <span className="text-xs sm:text-sm text-zinc-500 font-medium">
                    Über 75% günstiger als herkömmliche Portale
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {isFreeEligible ? (
                    /* Free 1st Job Tier */
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: 'free' })}
                      className={`p-4 rounded-2xl text-left transition-all cursor-pointer relative ${
                        formData.tier === 'free'
                          ? 'bg-emerald-50 ring-2 ring-emerald-600 shadow-xs'
                          : 'bg-[#f4f4f3] hover:bg-zinc-200 text-black'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-bold text-black flex items-center gap-1.5">
                          <Gift className="size-4 text-emerald-600" />
                          <span>1. Inserat Gratis</span>
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-emerald-700">0 €</span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                        15 Tage Laufzeit &middot; 100% Direktkontakt &middot; Sofort live ohne Zahlungsdaten.
                      </p>
                    </button>
                  ) : (
                    /* Starter Tier */
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tier: 'starter' })}
                      className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                        formData.tier === 'starter'
                          ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                          : 'bg-[#f4f4f3] hover:bg-zinc-200 text-black'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm sm:text-base font-bold ${formData.tier === 'starter' ? 'text-white' : 'text-black'}`}>Quick (15 Tage)</span>
                        <span className={`font-mono text-sm sm:text-base font-bold ${formData.tier === 'starter' ? 'text-white' : 'text-black'}`}>9,99 € <span className={`text-xs font-normal ${formData.tier === 'starter' ? 'text-zinc-300' : 'text-zinc-500'}`}>inkl. MwSt.</span></span>
                      </div>
                      <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${formData.tier === 'starter' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        15 Tage Laufzeit &middot; Sofort im Direktbereich &middot; 100% Direktkontakt.
                      </p>
                    </button>
                  )}

                  {/* Standard Tier */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: 'standard' })}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                      formData.tier === 'standard'
                        ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                        : 'bg-[#f4f4f3] hover:bg-zinc-200 text-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm sm:text-base font-bold ${formData.tier === 'standard' ? 'text-white' : 'text-black'}`}>Standard (30 Tage)</span>
                      <span className={`font-mono text-sm sm:text-base font-bold ${formData.tier === 'standard' ? 'text-white' : 'text-black'}`}>14,99 € <span className={`text-xs font-normal ${formData.tier === 'standard' ? 'text-zinc-500' : 'text-zinc-500'}`}>inkl. MwSt.</span></span>
                    </div>
                    <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${formData.tier === 'standard' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      30 Tage Laufzeit &middot; Über 75% günstiger als andere Portale &middot; Inkl. Stadtfilter.
                    </p>
                  </button>

                  {/* Extended Tier (60 Days) */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: 'premium' })}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                      formData.tier === 'premium'
                        ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                        : 'bg-[#f4f4f3] hover:bg-zinc-200 text-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm sm:text-base font-bold ${formData.tier === 'premium' ? 'text-white' : 'text-black'}`}>Extended (60 Tage)</span>
                      <span className={`font-mono text-sm sm:text-base font-bold ${formData.tier === 'premium' ? 'text-white' : 'text-black'}`}>24,99 € <span className={`text-xs font-normal ${formData.tier === 'premium' ? 'text-zinc-300' : 'text-zinc-500'}`}>inkl. MwSt.</span></span>
                    </div>
                    <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${formData.tier === 'premium' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      60 Tage doppelte Laufzeit &middot; Top-Platzierung &middot; Maximale Reichweite.
                    </p>
                  </button>
                </div>
              </div>

              {/* Trust Badge with Social Proof */}
              <div className="rounded-2xl bg-zinc-50 p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-zinc-800">
                <ShieldCheck className="size-5 text-black shrink-0 mt-0.5 stroke-[2]" />
                <div>
                  <p className="font-bold text-black text-sm sm:text-base">
                    Trusted by 50+ employers and over 500+ workers
                  </p>
                  <p className="mt-1 text-zinc-600 leading-relaxed text-xs sm:text-sm">
                    100% Unabhängig · Keine Zeitarbeitsfirmen, keine Scraper, keine veralteten Tabellen. Direkter Kontakt über WhatsApp, Telefon oder E-Mail.
                  </p>
                </div>
              </div>

              {/* Statutory Confirmation & Waiver Notice */}
              <div className="text-xs text-zinc-500 leading-relaxed py-1">
                <p>
                  Mit Klick auf Veröffentlichen stimmst du den{' '}
                  <Link href="/agb" className="underline underline-offset-2 text-black font-medium hover:text-zinc-700">
                    AGB
                  </Link>{' '}
                  und der{' '}
                  <Link href="/datenschutz" className="underline underline-offset-2 text-black font-medium hover:text-zinc-700">
                    Datenschutzerklärung
                  </Link>{' '}
                  zu und verlangst die sofortige Bereitstellung des Inserates vor Ablauf der gesetzlichen Widerrufsfrist (§ 356 Abs. 5 BGB).
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-sm sm:text-base text-zinc-600 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-4 stroke-[2]" />
                  <span>Zurück</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="apple-press inline-flex items-center gap-2 rounded-2xl bg-black px-7 py-3.5 text-sm sm:text-base font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  {loading ? (
                    'Verarbeitung...'
                  ) : (
                    <>
                      <span>
                        {isMaster
                          ? `Als Master sofort live schalten (${formData.tier === 'premium' ? 'Extended 60 Tage' : formData.tier === 'standard' ? 'Standard 30 Tage' : formData.tier === 'starter' ? 'Quick 15 Tage' : 'Gratis 15 Tage'} · 0 € Testmodus)`
                          : formData.tier === 'free'
                          ? 'Jetzt kostenlos live schalten (0 €)'
                          : formData.tier === 'premium'
                          ? 'Zahlungspflichtig bestellen (24,99 €)'
                          : formData.tier === 'standard'
                          ? 'Zahlungspflichtig bestellen (14,99 €)'
                          : 'Zahlungspflichtig bestellen (9,99 €)'}
                      </span>
                      <ArrowRight className="size-4 stroke-[2]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Terms, Conditions & Support Channel - UNDER THE FORM */}
        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-zinc-500">
          <div>
            {isFreeEligible ? (
              <span className="text-emerald-800 font-semibold mr-1.5">
                {isDe ? '1. Inserat 100% kostenlos ·' : '1st listing 100% free ·'}
              </span>
            ) : null}
            {isDe
              ? 'Mit dem Inserieren stimmst du unseren '
              : 'By posting a job, you agree to our '}
            <Link href="/agb" className="underline underline-offset-2 text-zinc-700 hover:text-black font-medium transition-colors">
              {isDe ? 'AGB' : 'Terms'}
            </Link>{' '}
            {isDe ? 'und der' : 'and'}{' '}
            <Link href="/datenschutz" className="underline underline-offset-2 text-zinc-700 hover:text-black font-medium transition-colors">
              {isDe ? 'Datenschutzerklärung' : 'Privacy Policy'}
            </Link>
            .{' '}
            {!user && (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="underline hover:text-black ml-1 text-emerald-800 font-semibold cursor-pointer"
              >
                {isDe ? 'Kostenlos anmelden für 0 € Inserat' : 'Sign in for free listing'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs shrink-0">
            <span>Support:</span>
            <a href="mailto:jobroofs@gmail.com" className="text-zinc-700 hover:text-black font-semibold transition-colors">
              jobroofs@gmail.com
            </a>
          </div>
        </div>
      </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
