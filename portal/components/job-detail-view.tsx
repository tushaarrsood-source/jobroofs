'use client';

import { useState, useEffect } from 'react';
import Link from '@/components/ui/link';
import {
  ArrowLeft,
  ArrowRight,
  List,
  MapPin,
  Euro,
  Clock,
  Building2,
  ExternalLink,
  Mail,
  Bookmark,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Phone,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';
import { AuthModal } from '@/components/auth-modal';
import { JobroofsMark } from '@/components/brand-logo';
import { updateMyListingStatusLocally } from '@/lib/storage/my-listings';

interface JobDetailViewProps {
  job: any;
  prevSlug?: string | null;
  nextSlug?: string | null;
}

export function JobDetailView({ job, prevSlug, nextSlug }: JobDetailViewProps) {
  const { user } = useAuth();
  const { isDe } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment_success') === 'true') {
        setShowSuccessBanner(true);
        const sessionId = params.get('session_id');
        if (sessionId) {
          fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
            .then((r) => r.json())
            .then((data) => {
              if (data.verified) {
                updateMyListingStatusLocally(job.id, 'active');
                if (job.slug) updateMyListingStatusLocally(job.slug, 'active');
                window.dispatchEvent(new Event('jobroofs_listings_updated'));
              }
            })
            .catch((err) => console.warn('Verify session error:', err));
        }
      }
    }
  }, [job.id, job.slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(
        `Job in ${job.city || 'Deutschland'}: ${job.title} bei ${job.company}\n${window.location.href}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const emailContact = job.application?.email || job.contactEmail || job.email || null;
  const emailUrl = emailContact
    ? `mailto:${emailContact}?subject=${encodeURIComponent(
        isDe
          ? `Bewerbung: ${job.title} (über JOBROOFS)`
          : `Application: ${job.title} (via JOBROOFS)`
      )}`
    : null;

  const rawPhone = job.phone || job.contactPhone || null;
  const cleanPhone = rawPhone ? rawPhone.replace(/\s+/g, '') : null;
  const phoneUrl = cleanPhone ? `tel:${cleanPhone}` : null;

  const rawWhatsapp = job.whatsapp || (rawPhone && rawPhone.startsWith('+') ? rawPhone : null);
  const cleanWa = rawWhatsapp ? rawWhatsapp.replace(/[^0-9]/g, '') : null;
  const waUrl = cleanWa
    ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(
        isDe
          ? `Hallo! Ich habe eure Anzeige "${job.title}" auf JOBROOFS gesehen und möchte mich gerne direkt bei euch bewerben.`
          : `Hi! I saw your "${job.title}" listing on JOBROOFS and would like to apply directly.`
      )}`
    : null;

  const websiteUrl = job.application?.url || job.applyUrl || job.sourceUrl || null;

  const primaryActionUrl = waUrl || emailUrl || phoneUrl || websiteUrl || '#';

  const handleActionClick = (targetUrl: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (targetUrl === '#') return;
    if (!user) {
      setPendingTarget(targetUrl);
      setAuthModalOpen(true);
      return;
    }
    if (targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:')) {
      window.location.href = targetUrl;
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (pendingTarget) {
      if (pendingTarget.startsWith('mailto:') || pendingTarget.startsWith('tel:')) {
        window.location.href = pendingTarget;
      } else {
        window.open(pendingTarget, '_blank', 'noopener,noreferrer');
      }
      setPendingTarget(null);
    }
  };

  const wage =
    job.payText ||
    (job.compensation?.amountMin
      ? `${job.compensation.amountMin} €/${isDe ? 'Std.' : 'h'}`
      : job.compensation?.label
      ? job.compensation.label.toLowerCase().includes('tarif')
        ? (isDe ? 'Tarif / Vereinbarung' : 'Tariff / agreement')
        : job.compensation.label.toLowerCase().includes('vereinbarung')
        ? (isDe ? 'Vergütung n.V.' : 'Compensation neg.')
        : job.compensation.label
      : isDe ? 'Vergütung n.V.' : 'Compensation neg.');

  const hours = job.hours?.label || job.hoursLabel || (isDe ? 'Flexible Arbeitszeiten' : 'Flexible Hours');
  const schedule = job.schedule?.summary || job.scheduleSummary || (isDe ? 'Nach Absprache' : 'By arrangement');
  const responsibilities = job.responsibilities || [];
  const requirements = job.requirements || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-24 sm:pb-8">
      {/* Top Navigation Bar */}
      <nav className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 text-sm sm:text-base">
        {prevSlug ? (
          <Link
            href={`/jobs/${prevSlug}`}
            className="apple-press inline-flex items-center gap-1.5 text-zinc-600 hover:text-black font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4 stroke-[2]" /> {isDe ? 'Vorheriger Job' : 'Previous Job'}
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed font-medium">
            {isDe ? 'Vorheriger Job' : 'Previous Job'}
          </span>
        )}

        <Link
          href="/"
          className="apple-press inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 px-4 py-2 text-sm sm:text-base text-black font-semibold transition-colors cursor-pointer"
        >
          <List className="size-4 stroke-[2] text-zinc-600" /> {isDe ? 'Zurück zur Übersicht' : 'Back to Overview'}
        </Link>

        {nextSlug ? (
          <Link
            href={`/jobs/${nextSlug}`}
            className="apple-press inline-flex items-center gap-1.5 text-zinc-600 hover:text-black font-semibold transition-colors cursor-pointer"
          >
            {isDe ? 'Nächster Job' : 'Next Job'} <ArrowRight className="size-4 stroke-[2]" />
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed font-medium">
            {isDe ? 'Nächster Job' : 'Next Job'}
          </span>
        )}
      </nav>

      {showSuccessBanner && (
        <div className="mb-6 rounded-2xl bg-emerald-50 p-4 sm:p-5 text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-base font-bold text-emerald-900">
                {isDe ? 'Zahlung erfolgreich abgeschlossen!' : 'Payment completed successfully!'}
              </p>
              <p className="text-sm text-emerald-700 mt-0.5">
                {isDe
                  ? `Deine Stellenanzeige ist nun live geschaltet und für Jobsuchende in ${job.city || 'Deutschland'} sichtbar.`
                  : `Your job listing is now live and visible to job seekers in ${job.city || 'Germany'}.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 ml-4 underline cursor-pointer"
          >
            {isDe ? 'Schließen' : 'Close'}
          </button>
        </div>
      )}

      {/* Main Job Article - Open Canvas */}
      <article className="py-2 sm:py-4">
        {/* Company Subtitle */}
        <div className="flex items-center gap-2.5 text-base text-zinc-700">
          <JobroofsMark size={22} />
          <span className="text-black font-bold">{job.company}</span>
          <span className="text-zinc-300">&middot;</span>
          <span className="text-zinc-600 font-medium">{job.district ? `${job.district}, ` : ''}{job.city || 'Deutschland'}</span>
        </div>

        {/* Highlighted Job Title Box */}
        <div className="my-6 border-y border-zinc-200 py-6 sm:py-8">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm sm:text-base">
            <span className="inline-flex items-center gap-1.5 text-zinc-700 font-normal">
              <MapPin className="size-4 stroke-[1.5] text-zinc-500" />
              {job.district ? `${job.district}, ` : ''}{job.city || 'Deutschland'} {job.postcode ? `(${job.postcode})` : ''}
            </span>
            <span className="text-zinc-300">&middot;</span>
            <span className="inline-flex items-center gap-1.5 text-black font-bold font-mono">
              <Euro className="size-4 stroke-[1.5] text-zinc-600" />
              {wage}
            </span>
            <span className="text-zinc-300">&middot;</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600">
              <Clock className="size-4 stroke-[1.5] text-zinc-500" />
              {hours}
            </span>
          </div>
        </div>


        {/* Responsibilities */}
        {responsibilities.length > 0 && (
          <section className="mt-8 border-t border-zinc-200 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              {isDe ? 'Was du bei uns machst' : 'What you will do'}
            </h2>
            <div className="mt-4 divide-y divide-zinc-200">
              {responsibilities.map((resp: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4 py-4">
                  <span className="font-mono text-sm font-semibold text-zinc-400 pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">{resp}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <section className="mt-8 border-t border-zinc-200 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              {isDe ? 'Was dich ausmacht' : 'What you bring'}
            </h2>
            <div className="mt-4 divide-y divide-zinc-200">
              {requirements.map((req: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4 py-4">
                  <span className="font-mono text-sm font-semibold text-zinc-400 pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base sm:text-lg text-zinc-800 font-normal leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {job.description && (
          <section className="mt-8 border-t border-zinc-200 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              {isDe ? 'Beschreibung' : 'Description'}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-zinc-800 font-normal leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>
        )}

        {/* Compensation & Working Hours */}
        <section className="mt-8 border-t border-zinc-200 pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
            {isDe ? 'Konditionen' : 'Conditions'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 p-6">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500">
                {isDe ? 'Stundenlohn / Vergütung' : 'Hourly Wage / Compensation'}
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-black font-mono tracking-tight">{wage}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-6">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-500">
                {isDe ? 'Arbeitszeit & Schichten' : 'Working Hours & Shifts'}
              </p>
              <p className="mt-2 text-lg sm:text-xl font-semibold text-black">{hours}</p>
              <p className="text-base text-zinc-600 mt-1">{schedule}</p>
            </div>
          </div>
        </section>

        {/* Direct Contact & Application Block */}
        <section className="mt-10 rounded-3xl bg-zinc-50 p-6 sm:p-8 sm:flex sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              {isDe ? 'Direkt beim Betrieb bewerben' : 'Apply directly with employer'}
            </h2>
            <p className="mt-1.5 text-base text-zinc-600 font-normal leading-relaxed">
              {isDe
                ? (!user ? 'Melde dich kostenlos an, um Kontaktdaten & Bewerbungswege freizuschalten.' : `100% kostenfrei & ohne Vermittler. Direkter Kontakt zu ${job.company}.`)
                : (!user ? 'Sign in for free to unlock direct contact details and apply.' : `100% free & without agencies. Direct contact with ${job.company}.`)}
            </p>
          </div>

          <div className="mt-5 sm:mt-0 shrink-0 flex flex-wrap items-center justify-start sm:justify-end gap-3">
            {!user ? (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="apple-press inline-flex items-center gap-2.5 rounded-2xl bg-black hover:bg-zinc-800 text-white px-6 py-3.5 text-base font-semibold tracking-[0.01em] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Lock className="size-4 stroke-[2]" />
                <span>{isDe ? 'Anmelden zum Bewerben' : 'Sign in to apply'}</span>
                <ArrowRight className="size-4 stroke-[2]" />
              </button>
            ) : (
              <>
                {waUrl && (
                  <button
                    type="button"
                    onClick={(e) => handleActionClick(waUrl, e)}
                    className="apple-press inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-base font-semibold tracking-[0.01em] text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <MessageCircle className="size-5" />
                    <span>WhatsApp</span>
                  </button>
                )}

                {emailUrl && (
                  <button
                    type="button"
                    onClick={(e) => handleActionClick(emailUrl, e)}
                    className="apple-press inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-base font-semibold tracking-[0.01em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <Mail className="size-5 stroke-[1.5]" />
                    <span>{isDe ? 'E-Mail schreiben' : 'Send Email'}</span>
                  </button>
                )}

                {!waUrl && !emailUrl && primaryActionUrl !== '#' && (
                  <button
                    type="button"
                    onClick={(e) => handleActionClick(primaryActionUrl, e)}
                    className="apple-press inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-base font-semibold tracking-[0.01em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <ExternalLink className="size-5 stroke-[1.5]" />
                    <span>{isDe ? 'Kontakt aufnehmen' : 'Get in Touch'} &rarr;</span>
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {/* Share Section */}
        <section className="mt-8 pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-base text-zinc-600">
          <span className="flex items-center gap-2 font-semibold text-black">
            <Share2 className="size-4 stroke-[2]" /> {isDe ? 'Diese Stelle teilen:' : 'Share this job:'}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="apple-press inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
            >
              <MessageCircle className="size-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="apple-press inline-flex items-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{isDe ? 'Kopiert!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="size-4 text-zinc-500" />
                  <span>{isDe ? 'Link kopieren' : 'Copy link'}</span>
                </>
              )}
            </button>
          </div>
        </section>
      </article>

      {/* Sticky Mobile Application Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 sm:hidden flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-black truncate">{job.title}</p>
          <p className="text-sm text-zinc-600 truncate">{job.company} &middot; <span className="font-mono text-black font-semibold">{wage}</span></p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!user ? (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="apple-press inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <Lock className="size-4 stroke-[2]" />
              <span>{isDe ? 'Anmelden' : 'Sign in'}</span>
            </button>
          ) : (
            <>
              {waUrl && (
                <button
                  type="button"
                  onClick={(e) => handleActionClick(waUrl, e)}
                  className="apple-press inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <MessageCircle className="size-4" />
                  <span>WhatsApp</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => handleActionClick(emailUrl || phoneUrl || primaryActionUrl, e)}
                className="apple-press inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
              >
                {emailUrl ? (
                  <>
                    <Mail className="size-4" /> {isDe ? 'E-Mail' : 'Email'}
                  </>
                ) : phoneUrl ? (
                  <>
                    <Phone className="size-4" /> {isDe ? 'Anrufen' : 'Call'}
                  </>
                ) : (
                  <>
                    <span>{isDe ? 'Kontakt' : 'Contact'}</span> &rarr;
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Auth Gate Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingTarget(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
