'use client';

import { useState } from 'react';
import Link from '@/components/ui/link';
import { Briefcase, Home, Plus, RotateCcw, MapPin, Sparkles } from 'lucide-react';
import { JobMap } from '@/components/job-map';
import { HousingMap } from '@/components/housing-map';
import { useTranslation } from '@/lib/i18n/language-context';
import type { HousingListing } from '@/lib/domain/housing-types';

interface KiezMapPageProps {
  initialJobs: any[];
  initialHousing: HousingListing[];
  defaultTab?: 'jobs' | 'homes';
}

export function KiezMapPage({
  initialJobs,
  initialHousing,
  defaultTab = 'jobs',
}: KiezMapPageProps) {
  const { isDe } = useTranslation();
  const [activeTab, setActiveTab] = useState<'jobs' | 'homes'>(defaultTab);

  return (
    <div className="mx-auto max-w-[1440px] px-2 sm:px-4 md:px-6 py-3 sm:py-4">
      {/* Top Controls Header Bar - Apple Design */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-[20px] border border-black/[0.06] bg-white p-2.5 sm:p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Apple Segmented Switch: Jobs vs Homes */}
        <div className="apple-segmented">
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`apple-segmented-item !px-4 !py-2 ${
              activeTab === 'jobs' ? 'active' : ''
            }`}
          >
            <Briefcase className="size-4" />
            <span>{isDe ? 'Jobs (Vergütung)' : 'Jobs (Pay)'}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${
              activeTab === 'jobs' ? 'bg-black/[0.08] text-[#1d1d1f]' : 'bg-black/[0.04] text-[#86868b]'
            }`}>
              {initialJobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('homes')}
            className={`apple-segmented-item !px-4 !py-2 ${
              activeTab === 'homes' ? 'active' : ''
            }`}
          >
            <Home className="size-4" />
            <span>{isDe ? 'Wohnen (Warmmiete)' : 'Homes (Warm Rent)'}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${
              activeTab === 'homes' ? 'bg-black/[0.08] text-[#1d1d1f]' : 'bg-black/[0.04] text-[#86868b]'
            }`}>
              {initialHousing.length}
            </span>
          </button>
        </div>

        {/* Action Buttons: Post a Job and Post a Room (Apple Styling) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/post-a-job"
            className="apple-btn-primary !h-9 !px-3.5 !text-xs"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>{isDe ? 'Job inserieren' : 'Post a Job'}</span>
          </Link>

          <Link
            href="/wohnen/list"
            className="apple-btn-secondary !h-9 !px-3.5 !text-xs"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>{isDe ? 'Wohnung inserieren' : 'List a Room'}</span>
          </Link>
        </div>
      </div>

      {/* Tall Interactive Map Container */}
      <div className="relative h-[calc(100vh-190px)] min-h-[560px] w-full overflow-hidden rounded-[20px] border border-black/[0.06] bg-[#f5f5f7] shadow-sm">
        {activeTab === 'jobs' ? (
          <JobMap
            jobs={initialJobs}
            showCardOverlay={true}
            className="h-full w-full"
          />
        ) : (
          <HousingMap
            listings={initialHousing}
            showCardOverlay={true}
            className="h-full w-full"
          />
        )}
      </div>

      {/* Bottom Hint on Mobile */}
      <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-[#86868b]">
        <span className="flex items-center gap-1">
          <MapPin className="size-3 text-[#86868b]" />
          {activeTab === 'jobs'
            ? isDe ? 'Pins zeigen Stundenlohn / Festgehalt' : 'Pins show hourly wage / salary'
            : isDe ? 'Pins zeigen monatliche Warmmiete' : 'Pins show monthly warm rent'
          }
        </span>
        <span className="hidden sm:inline">
          {isDe ? 'Klicke auf einen Pin, um Details zu öffnen' : 'Click a pin to view full details'}
        </span>
      </div>
    </div>
  );
}
