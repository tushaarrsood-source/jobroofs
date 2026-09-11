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
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { JobroofsMark } from '@/components/brand-logo';

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
      {/* Top Navigation Bar */}
      <nav className="mb-6 flex items-center justify-between border-b border-black/[0.06] pb-4 text-xs font-semibold">
        {prevSlug ? (
          <Link
            href={`/jobs/${prevSlug}`}
            className="inline-flex items-center gap-1 text-[#5c6863] hover:text-[#1b4332] transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" /> Vorheriger Job
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed">Vorheriger Job</span>
        )}

        <Link
          href="/"
          className="apple-press inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-[#111816] hover:bg-[#f2f6f4] transition-all shadow-2xs cursor-pointer"
        >
          <List className="size-3.5 text-[#1b4332]" /> Zurück zur Übersicht
        </Link>

        {nextSlug ? (
          <Link
            href={`/jobs/${nextSlug}`}
            className="inline-flex items-center gap-1 text-[#5c6863] hover:text-[#1b4332] transition-colors cursor-pointer"
          >
            Nächster Job <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <span className="text-zinc-300 cursor-not-allowed">Nächster Job</span>
        )}
      </nav>

      {/* Main Job Article */}
      <article className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-9 shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
        {/* Company Subtitle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#5c6863]">
            <JobroofsMark size={24} />
            <span className="text-[#111816] font-bold">{job.company}</span>
            <span className="text-zinc-300">&middot;</span>
            <span>{job.district || 'Berlin'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-[#1b4332] bg-[#e8f1ec] px-3 py-1 rounded-full border border-[#1b4332]/10">
            <Bookmark className="size-3.5 fill-[#1b4332]/20 stroke-[#1b4332]" />
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Highlighted Job Title Box */}
        <div className="my-6 rounded-[22px] bg-[#fafbfa] p-6 sm:p-7 border border-black/[0.06]">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111816] tracking-[-0.035em] leading-tight">
            {job.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[#111816] border border-[#e5eae7] shadow-2xs">
              <MapPin className="size-3 text-[#1b4332]" />
              {job.district || 'Berlin'} {job.postcode ? `(${job.postcode})` : ''}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f1ec] px-3 py-1 text-[#1b4332] border border-[#1b4332]/10 font-bold shadow-2xs">
              <Euro className="size-3 text-[#1b4332]" />
              {wage}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[#111816] border border-[#e5eae7] shadow-2xs">
              <Clock className="size-3 text-zinc-400" />
              {hours}
            </span>
          </div>
        </div>

        {/* Responsibilities (01, 02, 03 style) */}
        {responsibilities.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-bold text-[#111816]">Was du bei uns machst:</h2>
            <div className="mt-3 divide-y divide-[#f0f3f1] border-t border-[#f0f3f1]">
              {responsibilities.map((resp: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3.5 py-3">
                  <span className="font-mono text-xs font-semibold text-zinc-400 pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[#37413d]">{resp}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <section className="mt-6 border-t border-[#f0f3f1] pt-6">
            <h2 className="text-base font-bold text-[#111816]">Was dich ausmacht:</h2>
            <div className="mt-3 divide-y divide-[#f0f3f1] border-t border-[#f0f3f1]">
              {requirements.map((req: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3.5 py-3">
                  <span className="font-mono text-xs font-semibold text-zinc-400 pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[#37413d]">{req}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compensation & Working Hours */}
        <section className="mt-6 border-t border-[#f0f3f1] pt-6">
          <h2 className="text-base font-bold text-[#111816]">Vergütung & Arbeitszeit</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-[18px] border border-[#e5eae7] bg-[#fafbfa] p-4">
              <p className="text-xs font-semibold text-[#5c6863]">Stundenlohn / Vergütung</p>
              <p className="mt-1 text-base font-bold text-[#1b4332]">{wage}</p>
            </div>
            <div className="rounded-[18px] border border-[#e5eae7] bg-[#fafbfa] p-4">
              <p className="text-xs font-semibold text-[#5c6863]">Arbeitszeit & Schichten</p>
              <p className="mt-1 text-sm font-semibold text-[#111816]">{hours}</p>
              <p className="text-xs text-[#5c6863]">{schedule}</p>
            </div>
          </div>
        </section>

        {/* Direct Contact & Application Block */}
        <section className="mt-8 rounded-[20px] border border-[#e5eae7] bg-[#fafbfa] p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#111816]">Direkt beim Arbeitgeber bewerben</h2>
            <p className="mt-1 text-xs text-[#5c6863]">
              100% kostenfrei & ohne Vermittlungsgebühren. Direkter Kontakt zu {job.company}.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 shrink-0">
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyClick}
              className="apple-press inline-flex items-center justify-center gap-2 rounded-full bg-[#1b4332] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#122f23] transition-all shadow-[0_4px_16px_rgba(27,67,50,0.25)] hover:shadow-[0_6px_20px_rgba(27,67,50,0.35)] cursor-pointer"
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
          <ShieldCheck className="size-3.5 text-[#1b4332]" />
          <span>Geprüftes Berliner Stellenangebot &middot; Direktkontakt ohne Zeitarbeit</span>
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
