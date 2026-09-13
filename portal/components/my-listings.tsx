'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/ui/link';
import { Briefcase, Home, Plus, ExternalLink, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { getMyListings, removeMyListing, seedDemoListingsIfEmpty, syncUserListingsWithCloud, UserListing } from '@/lib/storage/my-listings';
import { useTranslation } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/firebase/auth-context';
import { AuthModal } from '@/components/auth-modal';

export function MyListings() {
  const { isDe } = useTranslation();
  const { user } = useAuth();
  const [listings, setListings] = useState<UserListing[]>([]);
  const [filter, setFilter] = useState<'all' | 'job' | 'housing'>('all');
  const [mounted, setMounted] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const loadListings = async () => {
      if (user?.uid) {
        const cloud = await syncUserListingsWithCloud(user.uid);
        setListings(cloud);
      } else {
        const current = seedDemoListingsIfEmpty();
        setListings(current);
      }
    };

    loadListings();

    const handleUpdate = () => {
      setListings(getMyListings());
    };

    window.addEventListener('jobroofs_listings_updated', handleUpdate);
    return () => window.removeEventListener('jobroofs_listings_updated', handleUpdate);
  }, [user]);

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
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-xs">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-3 sm:pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-black flex items-center gap-2">
              <span>{isDe ? 'Meine Inserate' : 'My Listings'}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-black font-mono">
                {mounted ? listings.length : '...'}
              </span>
            </h2>
            {mounted && (
              user ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-900 border border-emerald-500/20">
                  <CheckCircle2 className="size-3 text-emerald-700" />
                  <span className="hidden sm:inline">{isDe ? 'Synchronisiert' : 'Synced'}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-[10.5px] font-semibold text-black hover:bg-zinc-200 transition cursor-pointer"
                >
                  <span className="size-1.5 rounded-full bg-zinc-500" />
                  <span>{isDe ? 'Lokal' : 'Local'}</span>
                </button>
              )
            )}
          </div>
          <p className="text-xs text-zinc-600 mt-0.5 font-normal">
            {isDe
              ? 'Verwalte deine veröffentlichten Stellenanzeigen'
              : 'Manage your published job postings'}
          </p>
        </div>
      </div>

      {/* Listing Cards */}
      <div className="mt-4 space-y-3">
        {!mounted ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-16 bg-zinc-100 rounded-xl"></div>
            <div className="h-16 bg-zinc-100 rounded-xl"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 p-8 text-center">
            <p className="text-sm font-bold text-black">
              {isDe ? 'Keine aktiven Inserate vorhanden.' : 'No active listings found.'}
            </p>
            <p className="text-xs text-zinc-600 mt-1 font-normal max-w-sm mx-auto">
              {isDe
                ? 'Veröffentliche eine Stelle direkt ohne Vermittler.'
                : 'Publish a position directly with zero middleman fees.'}
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/post-a-job"
                className="apple-press inline-flex h-10 items-center gap-2 rounded-xl bg-black px-5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xs"
              >
                <Plus className="size-3.5 stroke-[2]" />
                <span>{isDe ? 'Job jetzt inserieren' : 'Post Job Now'}</span>
              </Link>
            </div>
          </div>
        ) : (
          filteredListings.map((listing) => {
            const daysRemaining = calculateDaysRemaining(listing.expiresAt);

            return (
              <div
                key={listing.id}
                className="rounded-xl border border-zinc-200 bg-white p-4.5 transition-all shadow-2xs hover:border-black/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                      <Briefcase className="size-5 stroke-[2]" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-black text-white px-2 py-0.5 text-[9.5px] font-mono font-bold uppercase tracking-wider">
                          Job
                        </span>
                        {listing.badgeLabel && (
                          <span className="rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[9.5px] font-mono text-black font-semibold">
                            {listing.badgeLabel}
                          </span>
                        )}
                        {listing.tierLabel && (
                          <span className="rounded-md bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[9.5px] font-bold text-amber-900">
                            {listing.tierLabel}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-1.5 text-sm font-bold text-black leading-snug">
                        {listing.title}
                      </h3>

                      <p className="text-xs text-zinc-600 mt-0.5 font-normal">
                        {listing.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-900 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="size-3 text-emerald-700" />
                      <span>{isDe ? 'Aktiv' : 'Active'}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-600 font-mono font-medium">
                      <Clock className="size-3 text-zinc-500" />
                      {daysRemaining > 0
                        ? isDe ? `Noch ${daysRemaining} Tage` : `${daysRemaining}d left`
                        : isDe ? 'Abgelaufen' : 'Expired'}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-200 pt-3">
                  <div className="text-[11.5px] text-zinc-600 font-mono font-medium">
                    {listing.pricePaidEur === 0
                      ? isDe ? 'Kostenloses Erstinserat (0 €)' : 'Free 1st Job (0 €)'
                      : `${isDe ? 'Gebucht für' : 'Booked for'} ${listing.pricePaidEur} €`}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(isDe ? 'Inserat wirklich unwiderruflich löschen?' : 'Permanently delete this listing?')) {
                          await removeMyListing(listing.id, listing.type);
                          setListings((prev) => prev.filter((l) => l.id !== listing.id));
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-zinc-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer font-medium"
                      title={isDe ? 'Inserat löschen' : 'Delete listing'}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="hidden sm:inline">{isDe ? 'Löschen' : 'Delete'}</span>
                    </button>

                    <Link
                      href={listing.linkUrl}
                      className="apple-press inline-flex items-center gap-1.5 rounded-xl bg-black hover:bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-xs"
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

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
