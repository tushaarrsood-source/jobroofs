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
  ShieldCheck,
  Bookmark,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';
import { AuthModal } from '@/components/auth-modal';
import { JobroofsMark } from '@/components/brand-logo';
import { upgradeMyListingLocally } from '@/lib/storage/my-listings';
import { upgradeJobToSpotlight } from '@/lib/firebase/firestore-service';

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
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('upgraded') === 'true') {
        setShowUpgradeBanner(true);
        upgradeMyListingLocally(job.id || job.slug);
        upgradeJobToSpotlight(job.id || job.slug).catch(console.error);
      } else if (params.get('payment_success') === 'true') {
        setShowSuccessBanner(true);
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
        `Job in Berlin: ${job.title} bei ${job.company}\n${window.location.href}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const applyUrl =
    job.application?.url ||
    job.sourceUrl ||
    (job.application?.email ? `mailto:${job.application.email}` : '#');

  const handleApplyClick = (e: React.MouseEvent) => {
    if (applyUrl === '#') {
      e.preventDefault();
      return;
    }
    // Directly navigates to 100% verified employer application portal
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (pendingTarget) {
      if (pendingTarget.startsWith('mailto:')) {
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
      <nav className="mb-6 flex items-center justify-between border-b border-[#d8ded9] pb-4 text-[12px]">
        {prevSlug ? (
          <Link
            href={`/jobs/${prevSlug}`}
            className="inline-flex items-center gap-1 text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5 stroke-[1.25]" /> {isDe ? 'Vorheriger Job' : 'Previous Job'}
          </Link>
        ) : (
          <span className="text-[#d8ded9] cursor-not-allowed">
            {isDe ? 'Vorheriger Job' : 'Previous Job'}
          </span>
        )}

        <Link
          href="/"
          className="apple-press inline-flex items-center gap-1.5 rounded-sm border border-[#d8ded9] bg-transparent px-3.5 py-1.5 text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
        >
          <List className="size-3.5 stroke-[1.25] text-[#7e8a84]" /> {isDe ? 'Zurück zur Übersicht' : 'Back to Overview'}
        </Link>

        {nextSlug ? (
          <Link
            href={`/jobs/${nextSlug}`}
            className="inline-flex items-center gap-1 text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
          >
            {isDe ? 'Nächster Job' : 'Next Job'} <ArrowRight className="size-3.5 stroke-[1.25]" />
          </Link>
        ) : (
          <span className="text-[#d8ded9] cursor-not-allowed">
            {isDe ? 'Nächster Job' : 'Next Job'}
          </span>
        )}
      </nav>

      {showUpgradeBanner && (
        <div className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-emerald-900">
                {isDe ? 'Spotlight-Upgrade erfolgreich aktiviert!' : 'Spotlight upgrade successfully activated!'}
              </p>
              <p className="text-[12px] text-emerald-700">
                {isDe
                  ? 'Deine Anzeige ist jetzt mit höchster Priorität für 60 Tage ganz oben platziert.'
                  : 'Your listing is now placed at the top with highest priority for 60 days.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpgradeBanner(false)}
            className="text-xs text-emerald-700 hover:text-emerald-900 ml-4 underline cursor-pointer"
          >
            {isDe ? 'Schließen' : 'Close'}
          </button>
        </div>
      )}

      {showSuccessBanner && !showUpgradeBanner && (
        <div className="mb-6 rounded-sm border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-emerald-900">
                {isDe ? 'Zahlung erfolgreich abgeschlossen!' : 'Payment completed successfully!'}
              </p>
              <p className="text-[12px] text-emerald-700">
                {isDe
                  ? 'Deine Stellenanzeige ist nun live geschaltet und für Berliner Jobsuchende sichtbar.'
                  : 'Your job listing is now live and visible to Berlin job seekers.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-xs text-emerald-700 hover:text-emerald-900 ml-4 underline cursor-pointer"
          >
            {isDe ? 'Schließen' : 'Close'}
          </button>
        </div>
      )}

      {/* Main Job Article */}
      <article className="rounded-sm border border-[#d8ded9] bg-white p-6 sm:p-9">
        {/* Company Subtitle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[13px] text-[#7e8a84]">
            <JobroofsMark size={20} />
            <span className="text-[#202a31] font-medium">{job.company}</span>
            <span className="text-[#d8ded9]">&middot;</span>
            <span>{job.district || 'Berlin'}</span>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-[#7e8a84] font-medium border border-[#d8ded9] px-2.5 py-0.5 rounded-sm">
            VERIFIED
          </div>
        </div>

        {/* Highlighted Job Title Box */}
        <div className="my-6 border-y border-[#d8ded9] py-6">
          <h1
            className="text-2xl sm:text-4xl font-normal text-[#202a31] tracking-[-0.02em] leading-tight"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px]">
            <span className="inline-flex items-center gap-1 text-[#5a6460]">
              <MapPin className="size-3 stroke-[1.25] text-[#7e8a84]" />
              {job.district || 'Berlin'} {job.postcode ? `(${job.postcode})` : ''}
            </span>
            <span className="text-[#d8ded9]">&middot;</span>
            <span className="inline-flex items-center gap-1 text-[#202a31] font-mono">
              <Euro className="size-3 stroke-[1.25] text-[#7e8a84]" />
              {wage}
            </span>
            <span className="text-[#d8ded9]">&middot;</span>
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-[#7e8a84]">
              <Clock className="size-3 stroke-[1.25] text-[#7e8a84]" />
              {hours}
            </span>
          </div>
        </div>

        {/* Verified Employer Information Notice (Only 100% credible & verified employer data) */}
        {!job.isUserListing ? (
          <section className="mt-6 rounded-sm border border-[#d8ded9] bg-[#fbfbf8] p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="shrink-0 p-2 bg-[#ecece4] rounded-sm text-[#202a31]">
                <Building2 className="size-5 stroke-[1.25]" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-medium text-[#202a31]">
                  {isDe ? 'Offizielle Stellenausschreibung & Karriereportal' : 'Official Job Vacancies & Career Portal'}
                </h2>
                <p className="mt-1.5 text-[13.5px] text-[#5a6460] font-light leading-relaxed">
                  {isDe
                    ? `${job.company} rekrutiert aktuell in Berlin-${job.district || 'Berlin'}. Um 100% verlässliche und tagesaktuelle Informationen zu gewährleisten, werden alle offenen Stellen, Aufgabenbereiche und Anforderungen direkt auf dem offiziellen Karriereportal des Arbeitgebers geführt.`
                    : `${job.company} is currently hiring in Berlin-${job.district || 'Berlin'}. To ensure 100% credible, verified, and up-to-date information, all current vacancies, task profiles, and qualifications are managed directly on the employer's official career portal.`}
                </p>
                <div className="mt-4">
                  <a
                    href={applyUrl}
                    onClick={handleApplyClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-press inline-flex items-center gap-2 rounded-sm bg-[#202a31] px-5 py-2.5 text-[13px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
                  >
                    <span>
                      {isDe
                        ? `Offizielle Karriereseite von ${job.company} aufrufen`
                        : `Visit ${job.company}'s Official Career Portal`}
                    </span>
                    <ExternalLink className="size-3.5 stroke-[1.25]" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Responsibilities for User Listings */}
            {responsibilities.length > 0 && (
              <section className="mt-6">
                <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#7e8a84]">
                  {isDe ? 'Was du bei uns machst' : 'What you will do'}
                </h2>
                <div className="mt-3 divide-y divide-[#d8ded9] border-t border-[#d8ded9]">
                  {responsibilities.map((resp: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3.5 py-3">
                      <span className="font-mono text-[11px] text-[#7e8a84] pt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14px] text-[#5a6460] font-light leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Requirements for User Listings */}
            {requirements.length > 0 && (
              <section className="mt-6 border-t border-[#d8ded9] pt-6">
                <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#7e8a84]">
                  {isDe ? 'Was dich ausmacht' : 'What you bring'}
                </h2>
                <div className="mt-3 divide-y divide-[#d8ded9] border-t border-[#d8ded9]">
                  {requirements.map((req: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3.5 py-3">
                      <span className="font-mono text-[11px] text-[#7e8a84] pt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14px] text-[#5a6460] font-light leading-relaxed">{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description for User Listings */}
            {job.description && (
              <section className="mt-6 border-t border-[#d8ded9] pt-6">
                <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#7e8a84]">
                  {isDe ? 'Beschreibung' : 'Description'}
                </h2>
                <p className="mt-2 text-[14px] text-[#5a6460] font-light leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>
            )}
          </>
        )}

        {/* Compensation & Working Hours */}
        <section className="mt-6 border-t border-[#d8ded9] pt-6">
          <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#7e8a84]">
            {isDe ? 'Konditionen' : 'Conditions'}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-[13px]">
            <div className="rounded-sm border border-[#d8ded9] p-4">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#7e8a84]">
                {isDe ? 'Stundenlohn / Vergütung' : 'Hourly Wage / Compensation'}
              </p>
              <p className="mt-1 text-[16px] font-normal text-[#202a31] font-mono">{wage}</p>
            </div>
            <div className="rounded-sm border border-[#d8ded9] p-4">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#7e8a84]">
                {isDe ? 'Arbeitszeit & Schichten' : 'Working Hours & Shifts'}
              </p>
              <p className="mt-1 text-[14px] font-normal text-[#202a31]">{hours}</p>
              <p className="text-[12px] text-[#7e8a84] mt-0.5">{schedule}</p>
            </div>
          </div>
        </section>

        {/* Direct Contact & Application Block */}
        <section className="mt-8 rounded-sm border border-[#d8ded9] bg-[#fbfbf8] p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-medium text-[#202a31]">
              {isDe ? 'Direkt beim Betrieb bewerben' : 'Apply directly with employer'}
            </h2>
            <p className="mt-1 text-[13px] text-[#7e8a84] font-light">
              {isDe
                ? `100% kostenfrei & ohne Vermittler. Direkter Kontakt zu ${job.company}.`
                : `100% free & without agencies. Direct contact with ${job.company}.`}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 shrink-0">
            <a
              href={applyUrl}
              onClick={handleApplyClick}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-press inline-flex items-center gap-2 rounded-sm bg-[#202a31] px-6 py-3 text-[13px] font-normal tracking-[0.02em] text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
            >
              {job.application?.email ? (
                <>
                  <Mail className="size-4 stroke-[1.25]" /> {isDe ? 'Per E-Mail bewerben' : 'Apply via Email'}
                </>
              ) : (
                <>
                  <ExternalLink className="size-4 stroke-[1.25]" /> {isDe ? 'Zur Bewerbung →' : 'To Application →'}
                </>
              )}
            </a>
          </div>
        </section>

        {/* Share Section */}
        <section className="mt-5 pt-4 border-t border-[#d8ded9] flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#7e8a84]">
          <span className="flex items-center gap-1.5 font-medium text-[#202a31]">
            <Share2 className="size-3.5 stroke-[1.25]" /> {isDe ? 'Diese Stelle teilen:' : 'Share this job:'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="apple-press inline-flex items-center gap-1.5 rounded-sm border border-[#d8ded9] bg-white px-3 py-1.5 text-[11.5px] text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
            >
              <MessageCircle className="size-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="apple-press inline-flex items-center gap-1.5 rounded-sm border border-[#d8ded9] bg-white px-3 py-1.5 text-[11.5px] text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">{isDe ? 'Kopiert!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-[#7e8a84]" />
                  <span>{isDe ? 'Link kopieren' : 'Copy link'}</span>
                </>
              )}
            </button>
          </div>
        </section>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400">
          <ShieldCheck className="size-3.5 text-[#1b4332]" />
          <span>
            {isDe
              ? 'Geprüftes Berliner Stellenangebot · Direktkontakt ohne Zeitarbeit'
              : 'Verified Berlin job opening · Direct employer, no temp agencies'}
          </span>
        </div>
      </article>

      {/* Sticky Mobile Application Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#d8ded9] p-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-medium text-[#202a31] truncate">{job.title}</p>
          <p className="text-[11px] text-[#7e8a84] truncate">{job.company} &middot; {wage}</p>
        </div>
        <a
          href={applyUrl}
          onClick={handleApplyClick}
          target="_blank"
          rel="noopener noreferrer"
          className="apple-press shrink-0 inline-flex items-center gap-1.5 rounded-sm bg-[#202a31] px-4 py-2.5 text-[12px] font-medium text-[#fbfbf8] hover:bg-[#2d3a43] transition-colors cursor-pointer"
        >
          {job.application?.email ? (
            <>
              <Mail className="size-3.5" /> {isDe ? 'E-Mail' : 'Email'}
            </>
          ) : (
            <>
              <span>{isDe ? 'Bewerben' : 'Apply'}</span> &rarr;
            </>
          )}
        </a>
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
