import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ALL_SOURCED_JOBS } from '@/lib/sources/sourced-jobs';
import { ALL_BERLIN_SOURCES } from '@/lib/sources/berlin-sources-catalog';
import { ControlDashboardContent } from '@/components/control-dashboard-content';

export const metadata: Metadata = {
  title: 'Operations Dashboard & Control Room · JOBROOFS',
  description: 'Zentrales Verwaltungs-Dashboard für extrahierte Stellenangebote, Berliner Quellen und Systemstatus.',
  robots: { index: false, follow: false },
};

export default function ControlPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#1d1d1f] flex flex-col justify-between">
      <div>
        <SiteHeader control />
        <ControlDashboardContent
          initialJobs={ALL_SOURCED_JOBS}
          initialSources={ALL_BERLIN_SOURCES}
        />
      </div>
      <SiteFooter />
    </main>
  );
}
