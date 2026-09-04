'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/ui/link';
import { Briefcase, Home, Plus, ExternalLink, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { getMyListings, removeMyListing, seedDemoListingsIfEmpty, UserListing } from '@/lib/storage/my-listings';
import { useTranslation } from '@/lib/i18n/language-context';

export function MyListings() {
  const { isDe } = useTranslation();
  const [listings, setListings] = useState<UserListing[]>([]);
  const [filter, setFilter] = useState<'all' | 'job' | 'housing'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Seed demo if user currently has no listings
    const current = seedDemoListingsIfEmpty();
    setListings(current);

    const handleUpdate = () => {
      setListings(getMyListings());
    };

    window.addEventListener('jobroofs_listings_updated', handleUpdate);
    return () => window.removeEventListener('jobroofs_listings_updated', handleUpdate);
  }, []);

  const filteredListings = listings.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const calculateDaysRemaining = (expiresAt: string) => {
    const diffMs = new Date(expiresAt).getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{isDe ? 'Meine Inserate' : 'My Listings'}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 font-mono">
              {mounted ? listings.length : '...'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isDe
              ? 'Verwalte deine veröffentlichten Jobs und Wohnungsanzeigen'
              : 'Manage your published jobs and housing postings'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`pill-tactile rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer select-none ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isDe ? 'Alle' : 'All'} ({mounted ? listings.length : 0})
          </button>
          <button
            type="button"
            onClick={() => setFilter('job')}
            className={`pill-tactile rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer select-none ${
              filter === 'job'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jobs ({mounted ? listings.filter((l) => l.type === 'job').length : 0})
          </button>
          <button
            type="button"
            onClick={() => setFilter('housing')}
            className={`pill-tactile rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer select-none ${
              filter === 'housing'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isDe ? 'Wohnen' : 'Housing'} ({mounted ? listings.filter((l) => l.type === 'housing').length : 0})
          </button>
        </div>
      </div>

      {/* Listing Cards */}
      <div className="mt-4 space-y-3">
        {!mounted ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              {isDe ? 'Keine Inserate in dieser Kategorie.' : 'No listings in this category.'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/post-a-job"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                <Plus className="size-3.5" />
                {isDe ? 'Job inserieren (29 €)' : 'Post Job (29 €)'}
              </Link>
              <Link
                href="/wohnen/list"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="size-3.5" />
                {isDe ? 'Wohnung inserieren (29 €)' : 'List Room (29 €)'}
              </Link>
            </div>
          </div>
        ) : (
          filteredListings.map((listing) => {
            const daysRemaining = calculateDaysRemaining(listing.expiresAt);
            const isJob = listing.type === 'job';

            return (
              <div
                key={listing.id}
                className="rounded-xl border border-slate-200 bg-white p-4 card-tactile"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        isJob ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isJob ? <Briefcase className="size-5" /> : <Home className="size-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isJob
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isJob ? 'Job' : isDe ? 'Wohnen' : 'Housing'}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 font-mono">
                          {listing.badgeLabel}
                        </span>
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
                          {listing.tierLabel}
                        </span>
                      </div>

                      <h3 className="mt-1.5 text-sm font-bold text-slate-900 leading-snug">
                        {listing.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {listing.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="size-3" />
                      <span>{isDe ? 'Aktiv' : 'Active'}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Clock className="size-3 text-slate-400" />
                      {daysRemaining > 0
                        ? isDe ? `Noch ${daysRemaining} Tage` : `${daysRemaining}d left`
                        : isDe ? 'Abgelaufen' : 'Expired'}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <div className="text-[11px] text-slate-400">
                    {isDe ? 'Gebucht für' : 'Booked for'} {listing.pricePaidEur} €
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(isDe ? 'Inserat wirklich aus der Ansicht entfernen?' : 'Remove this listing?')) {
                          removeMyListing(listing.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Aus Liste entfernen"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="hidden sm:inline">{isDe ? 'Entfernen' : 'Remove'}</span>
                    </button>

                    <Link
                      href={listing.linkUrl}
                      className="btn-tactile inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
                    >
                      <span>{isDe ? 'Inserat ansehen' : 'View Listing'}</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
