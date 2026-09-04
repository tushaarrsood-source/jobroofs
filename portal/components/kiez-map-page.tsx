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
      {/* Top Controls Header Bar */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-xs">
        {/* Toggle Switch: Jobs vs Homes */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-white text-blue-600 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="size-4" />
            <span>{isDe ? 'Jobs (Vergütung)' : 'Jobs (Pay)'}</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
              activeTab === 'jobs' ? 'bg-blue-50 text-blue-700' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {initialJobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('homes')}
            className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'homes'
                ? 'bg-white text-blue-600 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="size-4" />
            <span>{isDe ? 'Wohnen (Warmmiete)' : 'Homes (Warm Rent)'}</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
              activeTab === 'homes' ? 'bg-blue-50 text-blue-700' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {initialHousing.length}
            </span>
          </button>
        </div>

        {/* Action Buttons: Post a Job and Post a Room */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/post-a-job"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>{isDe ? 'Job inserieren' : 'Post a Job'}</span>
          </Link>

          <Link
            href="/wohnen/list"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:text-blue-600"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>{isDe ? 'Wohnung inserieren' : 'List a Room'}</span>
          </Link>
        </div>
      </div>

      {/* Tall Interactive Map Container */}
      <div className="relative h-[calc(100vh-190px)] min-h-[560px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
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
      <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="size-3 text-slate-400" />
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
