import Link from '@/components/ui/link';
import type { Metadata } from 'next';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { JobBrowser } from '@/components/job-browser';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { previewJobs } from '@/lib/domain/preview-data';
import { isJobSuppressed } from '@/lib/sources/suppression-store';

export const metadata: Metadata = {
  title: 'Alle 1.600 Stellenangebote in Berlin — Consolidated List View',
  description:
    'Vollständiges Verzeichnis aller 1.600 verifizierten Jobs, Minijobs, Teilzeitstellen und Aushilfsjobs in Berlin. 100% Direktkontakt ohne Zeitarbeit.',
  openGraph: {
    title: 'Alle Stellenangebote in Berlin · JOBROOFS',
    description:
      'Stöbere durch die vollständige Übersicht aller 1.600 Jobs in Berlin across 32 Kategorien.',
    url: '/all-jobs',
  },
  alternates: {
    canonical: '/all-jobs',
  },
};

export default function AllJobsPage() {
  const initialJobs = previewJobs.filter(
    (job) => !isJobSuppressed(job.id) && (!job.slug || !isJobSuppressed(job.slug)),
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <BreadcrumbJsonLd
        items={[
          { name: 'JOBROOFS', href: '/' },
          { name: 'Alle Stellenangebote in Berlin', href: '/all-jobs' },
        ]}
      />
      <SiteHeader />

      <div className="border-b border-black/[0.06] bg-white py-3">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-colors"
              >
                <ArrowLeft className="size-3.5" /> Startseite
              </Link>
              <span className="text-black/20">/</span>
              <span className="font-semibold text-[#1d1d1f]">Alle 1.600 Stellenangebote</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-[11px] font-semibold">
              <Sparkles className="size-3 text-emerald-600" />
              1.600 Live Kiez-Angebote &middot; Alle 32 Berliner Branchen
            </span>
          </div>
        </div>
      </div>

      <JobBrowser
        initialJobs={initialJobs}
        filterOrigin="all"
        pageTitle="Alle Stellenangebote in Berlin"
        pageSubtitle="Vollständige konsolidierte Liste aller 1.600 verifizierten Jobs, Minijobs und flexiblen Schichten in ganz Berlin."
        sectionTitle="Gesamter Stellenkatalog (1.600 Jobs)"
        viewAllHref=""
      />

      <SiteFooter />
    </main>
  );
}
