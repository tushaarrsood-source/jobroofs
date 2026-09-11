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
      <nav className="mb-6 flex items-center justify-between border-b border-[#d8ded9] pb-4 text-[12px]">
        {prevSlug ? (
          <Link
            href={`/jobs/${prevSlug}`}
            className="inline-flex items-center gap-1 text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5 stroke-[1.25]" /> Vorheriger Job
          </Link>
        ) : (
          <span className="text-[#d8ded9] cursor-not-allowed">Vorheriger Job</span>
        )}

        <Link
          href="/"
          className="apple-press inline-flex items-center gap-1.5 rounded-sm border border-[#d8ded9] bg-transparent px-3.5 py-1.5 text-[#202a31] hover:bg-[#f4f4ee] transition-colors cursor-pointer"
        >
          <List className="size-3.5 stroke-[1.25] text-[#7e8a84]" /> Zurück zur Übersicht
        </Link>

        {nextSlug ? (
          <Link
            href={`/jobs/${nextSlug}`}
            className="inline-flex items-center gap-1 text-[#7e8a84] hover:text-[#202a31] transition-colors cursor-pointer"
          >
            Nächster Job <ArrowRight className="size-3.5 stroke-[1.25]" />
          </Link>
        ) : (
          <span className="text-[#d8ded9] cursor-not-allowed">Nächster Job</span>
        )}
      </nav>

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

        {/* Responsibilities */}
        {responsibilities.length > 0 && (
          <section className="mt-6">
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#7e8a84]">Was du bei uns machst</h2>
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

        {/* Requirements */}
        {requirements.length > 0 && (
          <section className="mt-6 border-t border-[#d8ded9] pt-6">
            <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#7e8a84]">Was dich ausmacht</h2>
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

        {/* Compensation & Working Hours */}
        <section className="mt-6 border-t border-[#d8ded9] pt-6">
          <h2 className="text-[14px] font-medium uppercase tracking-[0.1em] text-[#7e8a84]">Konditionen</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 text-[13px]">
            <div className="rounded-sm border border-[#d8ded9] p-4">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#7e8a84]">Stundenlohn / Vergütung</p>
              <p className="mt-1 text-[16px] font-normal text-[#202a31] font-mono">{wage}</p>
            </div>
            <div className="rounded-sm border border-[#d8ded9] p-4">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#7e8a84]">Arbeitszeit & Schichten</p>
              <p className="mt-1 text-[14px] font-normal text-[#202a31]">{hours}</p>
              <p className="text-[12px] text-[#7e8a84] mt-0.5">{schedule}</p>
            </div>
          </div>
        </section>

        {/* Direct Contact & Application Block */}
        <section className="mt-8 rounded-sm border border-[#d8ded9] bg-[#fbfbf8] p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-[15px] font-medium text-[#202a31]">Direkt beim Betrieb bewerben</h2>
            <p className="mt-1 text-[13px] text-[#7e8a84] font-light">
              100% kostenfrei & ohne Vermittler. Direkter Kontakt zu {job.company}.
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
                  <Mail className="size-4 stroke-[1.25]" /> Per E-Mail bewerben
                </>
              ) : (
                <>
                  <ExternalLink className="size-4 stroke-[1.25]" /> Zur Bewerbung &rarr;
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
