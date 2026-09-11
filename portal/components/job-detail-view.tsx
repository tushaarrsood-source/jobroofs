'use client';

import { useState } from 'react';
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
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';

interface JobDetailViewProps {
  job: any;
  prevSlug?: string | null;
  nextSlug?: string | null;
}

export function JobDetailView({ job, prevSlug, nextSlug }: JobDetailViewProps) {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);

  const applyUrl =
    job.application?.url ||
    job.sourceUrl ||
    (job.application?.email ? `mailto:${job.application.email}` : '#');

  const handleApplyClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setPendingTarget(applyUrl);
      setAuthModalOpen(true);
      return;
    }
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

  // Safe field extractions
  const wage =
    job.payText ||
    job.compensation?.label ||
    (job.compensation?.amountMin
      ? `${job.compensation.amountMin} €/Std.`
      : 'Vergütung n.V.');

  const hours = job.hours?.label || job.hoursLabel || 'Flexible Arbeitszeiten';
  const schedule = job.schedule?.summary || job.scheduleSummary || 'Nach Absprache';
  const responsibilities = job.responsibilities || [];
  const requirements = job.requirements || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Jobicco-style Navigation Bar */}
      <nav className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 text-xs font-semibold">
        {prevSlug ? (
          <Link
            href={`/jobs/${prevSlug}`}
            className="inline-flex items-center gap-1 text-zinc-600 hover:text-[#e33525] transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Vorheriger Job
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed">Vorheriger Job</span>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs"
        >
          <List className="size-3.5" /> Zurück zur Liste
        </Link>

        {nextSlug ? (
          <Link
            href={`/jobs/${nextSlug}`}
            className="inline-flex items-center gap-1 text-zinc-600 hover:text-[#e33525] transition-colors"
          >
            Nächster Job <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed">Nächster Job</span>
        )}
      </nav>

      {/* Main Job Article */}
      <article className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
        {/* Company Subtitle */}
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
          <Building2 className="size-4 text-zinc-400" />
          <span>{job.company}</span>
          <span className="text-zinc-300">·</span>
          <span>{job.district || 'Berlin'}</span>
        </div>

        {/* Highlighted Job Title Box (Jobicco style) */}
        <div className="my-4 rounded-xl bg-gradient-to-r from-zinc-50 to-zinc-100/60 p-5 border border-zinc-200/70">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            {job.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-zinc-700 border border-zinc-200 shadow-2xs">
              <MapPin className="size-3 text-zinc-500" />
              {job.district || 'Berlin'} {job.postcode ? `(${job.postcode})` : ''}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs">
              <Euro className="size-3 text-emerald-600" />
              {wage}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-zinc-700 border border-zinc-200 shadow-2xs">
              <Clock className="size-3 text-zinc-500" />
              {hours}
            </span>
          </div>
        </div>

        {/* Responsibilities / Was du bei uns machst */}
        {responsibilities.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-zinc-900">Was du bei uns machst:</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {responsibilities.map((resp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#e33525] shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Requirements / Was dich ausmacht */}
        {requirements.length > 0 && (
          <section className="mt-6 border-t border-zinc-100 pt-6">
            <h2 className="text-base font-bold text-zinc-900">Was dich ausmacht:</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {requirements.map((req: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Compensation & Working Hours */}
        <section className="mt-6 border-t border-zinc-100 pt-6">
          <h2 className="text-base font-bold text-zinc-900">Vergütung & Arbeitszeit</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
              <p className="text-xs font-semibold text-zinc-500">Stundenlohn / Vergütung</p>
              <p className="mt-1 text-base font-bold text-zinc-900">{wage}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
              <p className="text-xs font-semibold text-zinc-500">Arbeitszeit & Schichten</p>
              <p className="mt-1 text-sm font-semibold text-zinc-900">{hours}</p>
              <p className="text-xs text-zinc-500">{schedule}</p>
            </div>
          </div>
        </section>

        {/* Direct Contact & Application Block */}
        <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Direkt beim Arbeitgeber bewerben</h2>
            <p className="mt-1 text-xs text-zinc-600">
              100% kostenfrei & ohne Vermittlungsgebühren. Direkter Kontakt zu {job.company}.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 shrink-0">
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e33525] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#c92c1d] transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              {applyUrl.startsWith('mailto:') ? (
                <>
                  <Mail className="size-4" /> E-Mail schreiben
                </>
              ) : (
                <>
                  Jetzt bewerben <ExternalLink className="size-4" />
                </>
              )}
            </a>
          </div>
        </section>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Geprüftes Berliner Stellenangebot · Direktkontakt ohne Zeitarbeit</span>
        </div>
      </article>

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
