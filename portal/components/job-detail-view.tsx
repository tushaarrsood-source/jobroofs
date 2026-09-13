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
  Phone,
  Store,
  Sparkles,
  Lock,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTranslation } from '@/lib/i18n/language-context';
import { AuthModal } from '@/components/auth-modal';
import { JobroofsMark } from '@/components/brand-logo';

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
      <nav className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 text-[12.5px]">
        {prevSlug ? (
          <Link
            href={`/jobs/${prevSlug}`}
            className="apple-press inline-flex items-center gap-1.5 text-zinc-600 hover:text-black font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5 stroke-[1.5]" /> {isDe ? 'Vorheriger Job' : 'Previous Job'}
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed">
            {isDe ? 'Vorheriger Job' : 'Previous Job'}
          </span>
        )}

        <Link
          href="/"
          className="apple-press inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-black font-medium hover:border-black hover:bg-zinc-50 transition-colors cursor-pointer shadow-2xs"
        >
          <List className="size-3.5 stroke-[1.5] text-zinc-600" /> {isDe ? 'Zurück zur Übersicht' : 'Back to Overview'}
        </Link>

        {nextSlug ? (
          <Link
            href={`/jobs/${nextSlug}`}
            className="apple-press inline-flex items-center gap-1.5 text-zinc-600 hover:text-black font-medium transition-colors cursor-pointer"
          >
            {isDe ? 'Nächster Job' : 'Next Job'} <ArrowRight className="size-3.5 stroke-[1.5]" />
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed">
            {isDe ? 'Nächster Job' : 'Next Job'}
          </span>
        )}
      </nav>

      {showSuccessBanner && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-950 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[13.5px] font-bold text-emerald-900">
                {isDe ? 'Zahlung erfolgreich abgeschlossen!' : 'Payment completed successfully!'}
              </p>
              <p className="text-[12.5px] text-emerald-700">
                {isDe
                  ? `Deine Stellenanzeige ist nun live geschaltet und für Jobsuchende in ${job.city || 'Deutschland'} sichtbar.`
                  : `Your job listing is now live and visible to job seekers in ${job.city || 'Germany'}.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 ml-4 underline cursor-pointer"
          >
            {isDe ? 'Schließen' : 'Close'}
          </button>
        </div>
      )}

      {/* Main Job Article */}
      <article className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs">
        {/* Company Subtitle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[13.5px] text-zinc-600">
            <JobroofsMark size={22} />
            <span className="text-black font-bold">{job.company}</span>
            <span className="text-zinc-300">&middot;</span>
            <span className="text-zinc-600 font-medium">{job.district ? `${job.district}, ` : ''}{job.city || 'Deutschland'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-black px-2.5 py-1 text-[10.5px] font-bold tracking-[0.06em] text-white">
              <Sparkles className="size-3 text-amber-400" />
              <span>{isDe ? 'UNABHÄNGIG' : 'INDEPENDENT'}</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-emerald-900 font-bold border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded-md">
              DIREKTKONTAKT
            </span>
          </div>
        </div>

        {/* Highlighted Job Title Box */}
        <div className="my-6 border-y border-zinc-200 py-6">
          <h1
            className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-black tracking-[-0.025em] leading-tight"
            style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px]">
            <span className="inline-flex items-center gap-1 text-zinc-700 font-normal">
              <MapPin className="size-3.5 stroke-[1.5] text-zinc-500" />
              {job.district ? `${job.district}, ` : ''}{job.city || 'Deutschland'} {job.postcode ? `(${job.postcode})` : ''}
            </span>
            <span className="text-zinc-300">&middot;</span>
            <span className="inline-flex items-center gap-1 text-black font-bold font-mono">
              <Euro className="size-3.5 stroke-[1.5] text-zinc-600" />
              {wage}
            </span>
            <span className="text-zinc-300">&middot;</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              <Clock className="size-3.5 stroke-[1.5] text-zinc-500" />
              {hours}
            </span>
          </div>
        </div>

        {/* Independent Lister Direct Contact Hub */}
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-[16px] font-bold text-black flex items-center gap-2">
                <span>{isDe ? '100% Direkter Arbeitgeberkontakt' : '100% Direct Employer Contact'}</span>
                <span className="inline-flex items-center text-[11px] font-semibold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                  Keine Zeitarbeit
                </span>
              </h2>
              <p className="mt-1 text-[13.5px] text-zinc-700 font-normal leading-relaxed">
                {isDe
                  ? `Bewirb dich ohne Vermittler direkt beim Team von ${job.company}. Schnelle Rückmeldung garantiert:`
                  : `Apply directly with the team at ${job.company} without agencies or middlemen:`}
              </p>
            </div>
          </div>

          {/* Contact Action Cards / Auth Gate */}
          {!user ? (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 text-center space-y-4 shadow-xs">
              <div className="mx-auto size-12 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                <Lock className="size-5 stroke-[2]" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3
                  className="text-lg sm:text-xl font-bold text-black tracking-tight"
                  style={{ fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {isDe ? 'Kontaktdaten & Direktbewerbung geschützt' : 'Contact Details & Direct Application Gated'}
                </h3>
                <p className="text-[13.5px] sm:text-[14px] text-zinc-700 font-normal leading-relaxed">
                  {isDe
                    ? `Melde dich kostenlos an, um die direkte WhatsApp-Nummer, Telefonnummer und E-Mail-Adresse von ${job.company} freizuschalten und dich direkt zu bewerben.`
                    : `Sign in for free to reveal the direct WhatsApp, phone number, and email of ${job.company} and apply instantly.`}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="apple-press inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-zinc-800 text-white px-6 py-3.5 text-[14px] font-semibold tracking-[0.02em] transition-all cursor-pointer shadow-xs hover:shadow-md w-full sm:w-auto min-w-[220px] active:scale-[0.98]"
                >
                  <UserIcon className="size-4 stroke-[2]" />
                  <span>{isDe ? 'Kostenlos anmelden & bewerben' : 'Sign in for free & apply'}</span>
                  <ArrowRight className="size-3.5 stroke-[2]" />
                </button>
                <p className="mt-2.5 text-[11.5px] text-zinc-500 font-medium">
                  {isDe ? '100% kostenlos für Bewerber:innen · In 10 Sekunden registriert' : '100% free for applicants · Instant access'}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {waUrl && (
                <button
                  type="button"
                  onClick={(e) => handleActionClick(waUrl, e)}
                  className="apple-press flex items-center justify-between gap-3 p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-md bg-emerald-600 text-white shrink-0">
                      <MessageCircle className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-emerald-950">
                        {isDe ? 'Per WhatsApp schreiben' : 'Chat via WhatsApp'}
                      </div>
                      <div className="text-[11px] text-emerald-700 truncate font-mono">
                        {job.whatsapp || cleanWa}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-sm shrink-0">
                    1-Klick &rarr;
                  </span>
                </button>
              )}

              {emailUrl && (
                <button
                  type="button"
                  onClick={(e) => handleActionClick(emailUrl, e)}
                  className="apple-press flex items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors text-left cursor-pointer hover:border-black/30 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-black text-white shrink-0">
                      <Mail className="size-4 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-black">
                        {isDe ? 'E-Mail schreiben' : 'Send Email'}
                      </div>
                      <div className="text-[11.5px] text-zinc-600 truncate font-mono">
                        {emailContact}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-black bg-zinc-100 px-2 py-0.5 rounded-md shrink-0">
                    E-Mail &rarr;
                  </span>
                </button>
              )}

              {phoneUrl && (
                <button
                  type="button"
                  onClick={(e) => handleActionClick(phoneUrl, e)}
                  className="apple-press flex items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors text-left cursor-pointer hover:border-black/30 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-black text-white shrink-0">
                      <Phone className="size-4 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-black">
                        {isDe ? 'Direkt anrufen' : 'Call Employer'}
                      </div>
                      <div className="text-[11.5px] text-zinc-600 truncate font-mono">
                        {job.phone}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-black bg-zinc-100 px-2 py-0.5 rounded-md shrink-0">
                    Anrufen &rarr;
                  </span>
                </button>
              )}

              {job.address && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-zinc-200 bg-white text-black shadow-xs">
                  <div className="p-2 rounded-lg bg-zinc-100 text-black shrink-0">
                    <Store className="size-4 stroke-[1.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-black">
                      {isDe ? 'Vor Ort vorbeikommen' : 'Walk-in / Address'}
                    </div>
                    <div className="text-[11.5px] text-zinc-600 truncate">
                      {job.address}
                    </div>
                  </div>
                </div>
              )}

              {websiteUrl && (
                <button
                  type="button"
                  onClick={(e) => handleActionClick(websiteUrl, e)}
                  className="apple-press flex items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-black transition-colors text-left cursor-pointer hover:border-black/30 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-zinc-100 text-black shrink-0">
                      <ExternalLink className="size-4 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-black">
                        {isDe ? 'Offizielle Website' : 'Official Website'}
                      </div>
                      <div className="text-[11.5px] text-zinc-600 truncate">
                        {job.company}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-black bg-zinc-100 px-2 py-0.5 rounded-md shrink-0">
                    Öffnen &rarr;
                  </span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Responsibilities */}
        {responsibilities.length > 0 && (
          <section className="mt-6 border-t border-zinc-200 pt-6">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-zinc-600">
              {isDe ? 'Was du bei uns machst' : 'What you will do'}
            </h2>
            <div className="mt-3 divide-y divide-zinc-200 border-t border-zinc-200">
              {responsibilities.map((resp: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3.5 py-3.5">
                  <span className="font-mono text-[12px] font-semibold text-black pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[14.5px] text-zinc-800 font-normal leading-relaxed">{resp}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <section className="mt-6 border-t border-zinc-200 pt-6">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-zinc-600">
              {isDe ? 'Was dich ausmacht' : 'What you bring'}
            </h2>
            <div className="mt-3 divide-y divide-zinc-200 border-t border-zinc-200">
              {requirements.map((req: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3.5 py-3.5">
                  <span className="font-mono text-[12px] font-semibold text-black pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[14.5px] text-zinc-800 font-normal leading-relaxed">{req}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {job.description && (
          <section className="mt-6 border-t border-zinc-200 pt-6">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-zinc-600">
              {isDe ? 'Beschreibung' : 'Description'}
            </h2>
            <p className="mt-2 text-[14.5px] text-zinc-800 font-normal leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>
        )}

        {/* Compensation & Working Hours */}
        <section className="mt-6 border-t border-zinc-200 pt-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-zinc-600">
            {isDe ? 'Konditionen' : 'Conditions'}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-[13px]">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {isDe ? 'Stundenlohn / Vergütung' : 'Hourly Wage / Compensation'}
              </p>
              <p className="mt-1.5 text-[17px] font-bold text-black font-mono tracking-tight">{wage}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {isDe ? 'Arbeitszeit & Schichten' : 'Working Hours & Shifts'}
              </p>
              <p className="mt-1.5 text-[14.5px] font-semibold text-black">{hours}</p>
              <p className="text-[12.5px] text-zinc-600 mt-0.5">{schedule}</p>
            </div>
          </div>
        </section>

        {/* Direct Contact & Application Block */}
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4 shadow-2xs">
          <div>
            <h2 className="text-[16px] font-bold text-black">
              {isDe ? 'Direkt beim Betrieb bewerben' : 'Apply directly with employer'}
            </h2>
            <p className="mt-1 text-[13.5px] text-zinc-600 font-normal">
              {isDe
                ? (!user ? 'Melde dich kostenlos an, um Kontaktdaten & Bewerbungswege freizuschalten.' : `100% kostenfrei & ohne Vermittler. Direkter Kontakt zu ${job.company}.`)
                : (!user ? 'Sign in for free to unlock direct contact details and apply.' : `100% free & without agencies. Direct contact with ${job.company}.`)}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 shrink-0 flex flex-wrap items-center justify-center sm:justify-end gap-2">
            {!user ? (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="apple-press inline-flex items-center gap-2 rounded-xl bg-black hover:bg-zinc-800 text-white px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Lock className="size-4 stroke-[1.5]" />
                <span>{isDe ? 'Anmelden zum Bewerben' : 'Sign in to apply'}</span>
                <ArrowRight className="size-3.5 stroke-[2]" />
              </button>
            ) : (
              <>
                {waUrl && (
                  <button
                    type="button"
                    onClick={(e) => handleActionClick(waUrl, e)}
                    className="apple-press inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <MessageCircle className="size-4" />
                    <span>WhatsApp</span>
                  </button>
                )}

                {emailUrl && (
                  <button
                    type="button"
                    onClick={(e) => handleActionClick(emailUrl, e)}
                    className="apple-press inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <Mail className="size-4 stroke-[1.5]" />
                    <span>{isDe ? 'E-Mail schreiben' : 'Send Email'}</span>
                  </button>
                )}

                {!waUrl && !emailUrl && primaryActionUrl !== '#' && (
                  <button
                    type="button"
                    onClick={(e) => handleActionClick(primaryActionUrl, e)}
                    className="apple-press inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <ExternalLink className="size-4 stroke-[1.5]" />
                    <span>{isDe ? 'Kontakt aufnehmen' : 'Get in Touch'} &rarr;</span>
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {/* Share Section */}
        <section className="mt-5 pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-[12px] text-zinc-600">
          <span className="flex items-center gap-1.5 font-semibold text-black">
            <Share2 className="size-3.5 stroke-[1.5]" /> {isDe ? 'Diese Stelle teilen:' : 'Share this job:'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="apple-press inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11.5px] font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              <MessageCircle className="size-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="apple-press inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11.5px] font-medium text-black hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{isDe ? 'Kopiert!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-zinc-500" />
                  <span>{isDe ? 'Link kopieren' : 'Copy link'}</span>
                </>
              )}
            </button>
          </div>
        </section>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-500">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>
            {isDe
              ? `Unabhängiges Inserat in ${job.city || 'Deutschland'} · 100% Direktkontakt ohne Zeitarbeit`
              : `Independent listing in ${job.city || 'Germany'} · 100% direct contact, no temp agencies`}
          </span>
        </div>
      </article>

      {/* Sticky Mobile Application Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-black truncate">{job.title}</p>
          <p className="text-[11.5px] text-zinc-600 truncate">{job.company} &middot; <span className="font-mono text-black font-semibold">{wage}</span></p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {!user ? (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="apple-press inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-[12px] font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Lock className="size-3.5 stroke-[1.5]" />
              <span>{isDe ? 'Anmelden' : 'Sign in'}</span>
            </button>
          ) : (
            <>
              {waUrl && (
                <button
                  type="button"
                  onClick={(e) => handleActionClick(waUrl, e)}
                  className="apple-press inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <MessageCircle className="size-3.5" />
                  <span>WhatsApp</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => handleActionClick(emailUrl || phoneUrl || primaryActionUrl, e)}
                className="apple-press inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
              >
                {emailUrl ? (
                  <>
                    <Mail className="size-3.5" /> {isDe ? 'E-Mail' : 'Email'}
                  </>
                ) : phoneUrl ? (
                  <>
                    <Phone className="size-3.5" /> {isDe ? 'Anrufen' : 'Call'}
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
