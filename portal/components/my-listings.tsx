'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/ui/link';
import { Briefcase, Home, Plus, ExternalLink, Trash2, CheckCircle2, Clock, Sparkles, Cloud, CloudOff } from 'lucide-react';
import { getMyListings, removeMyListing, seedDemoListingsIfEmpty, syncUserListingsWithCloud, upgradeMyListingLocally, UserListing } from '@/lib/storage/my-listings';
import { upgradeJobToSpotlight } from '@/lib/firebase/firestore-service';
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
    <div className="rounded-2xl border border-[#D8DED9] bg-[#FBFBF8] p-5 sm:p-7 shadow-xs">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#D8DED9] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#202A31] flex items-center gap-2">
              <span>{isDe ? 'Meine Inserate' : 'My Listings'}</span>
              <span className="rounded-full bg-[#F0F1EA] px-2 py-0.5 text-xs font-medium text-[#7E8A84] font-mono">
                {mounted ? listings.length : '...'}
              </span>
            </h2>
            {mounted && (
              user ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10.5px] font-medium text-emerald-800 border border-emerald-500/20">
                  <Cloud className="size-3" />
                  <span className="hidden sm:inline">Cloud Sync</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F0F1EA] border border-[#D8DED9] px-2.5 py-0.5 text-[10.5px] font-medium text-[#202A31] hover:bg-white transition cursor-pointer"
                >
                  <CloudOff className="size-3 text-[#7E8A84]" />
                  <span>{isDe ? 'Anmelden' : 'Sign in'}</span>
                </button>
              )
            )}
          </div>
          <p className="text-xs text-[#7E8A84] mt-0.5 font-light">
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
            <div className="h-16 bg-[#F0F1EA] rounded-xl"></div>
            <div className="h-16 bg-[#F0F1EA] rounded-xl"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D8DED9] bg-white/60 p-8 text-center">
            <p className="text-sm font-medium text-[#202A31]">
              {isDe ? 'Keine aktiven Inserate vorhanden.' : 'No active listings found.'}
            </p>
            <p className="text-xs text-[#7E8A84] mt-1 font-light max-w-sm mx-auto">
              {isDe
                ? 'Veröffentliche eine Stelle direkt in Berlin ohne Vermittler.'
                : 'Publish a position directly in Berlin with zero middleman fees.'}
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/post-a-job"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#202A31] px-5 text-xs font-medium text-[#FBFBF8] hover:bg-[#161D22] transition-colors"
              >
                <Plus className="size-3.5" />
                <span>{isDe ? 'Job jetzt inserieren' : 'Post Job Now'}</span>
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
                className="rounded-xl border border-[#D8DED9] bg-white p-4.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F1EA] border border-[#D8DED9] text-[#202A31]">
                      <Briefcase className="size-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-[#202A31] text-[#FBFBF8] px-2 py-0.5 text-[9.5px] font-mono font-medium uppercase tracking-wider">
                          Job
                        </span>
                        {listing.badgeLabel && (
                          <span className="rounded-md bg-[#F0F1EA] border border-[#D8DED9] px-2 py-0.5 text-[9.5px] font-mono text-[#202A31]">
                            {listing.badgeLabel}
                          </span>
                        )}
                        {listing.tierLabel && (
                          <span className="rounded-md bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-[9.5px] font-medium text-amber-800">
                            {listing.tierLabel}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-1.5 text-sm font-semibold text-[#202A31] leading-snug">
                        {listing.title}
                      </h3>

                      <p className="text-xs text-[#7E8A84] mt-0.5 font-light">
                        {listing.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-[10.5px] font-medium text-emerald-800 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="size-3 text-emerald-700" />
                      <span>{isDe ? 'Aktiv' : 'Active'}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-[#7E8A84] font-mono">
                      <Clock className="size-3 text-[#7E8A84]" />
                      {daysRemaining > 0
                        ? isDe ? `Noch ${daysRemaining} Tage` : `${daysRemaining}d left`
                        : isDe ? 'Abgelaufen' : 'Expired'}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#D8DED9] pt-3">
                  <div className="text-[11px] text-[#7E8A84] font-mono">
                    {listing.pricePaidEur === 0
                      ? isDe ? 'Kostenloses Erstinserat (0 €)' : 'Free 1st Job (0 €)'
                      : `${isDe ? 'Gebucht für' : 'Booked for'} ${listing.pricePaidEur} €`}
                  </div>

                  <div className="flex items-center gap-2">
                    {listing.tier !== 'premium' && listing.type === 'job' && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/checkout', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                tier: 'premium',
                                jobData: {
                                  slug: listing.linkUrl.replace('/jobs/', ''),
                                  title: listing.title,
                                  isUpgrade: true,
                                },
                              }),
                            });
                            const data = await res.json();
                            if (data.checkoutUrl) {
                              window.location.href = data.checkoutUrl;
                              return;
                            }
                            // Direct upgrade fallback
                            upgradeMyListingLocally(listing.id);
                            await upgradeJobToSpotlight(listing.id);
                            setListings(getMyListings());
                            alert(isDe ? 'Inserat erfolgreich auf Spotlight geupgradet!' : 'Listing successfully upgraded to Spotlight!');
                          } catch (err: any) {
                            alert(err.message || 'Upgrade fehlgeschlagen.');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 px-2.5 py-1 text-xs font-medium transition cursor-pointer"
                        title={isDe ? 'Auf Spotlight upgraden (24,99 €)' : 'Upgrade to Spotlight (€24.99)'}
                      >
                        <Sparkles className="size-3 text-amber-600" />
                        <span>{isDe ? 'Auf Spotlight upgraden (24,99 €)' : 'Upgrade to Spotlight (€24.99)'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(isDe ? 'Inserat wirklich unwiderruflich löschen?' : 'Permanently delete this listing?')) {
                          await removeMyListing(listing.id, listing.type);
                          setListings((prev) => prev.filter((l) => l.id !== listing.id));
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-[#7E8A84] hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                      title={isDe ? 'Inserat löschen' : 'Delete listing'}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="hidden sm:inline">{isDe ? 'Löschen' : 'Delete'}</span>
                    </button>

                    <Link
                      href={listing.linkUrl}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#202A31] hover:bg-[#161D22] px-3.5 py-1.5 text-xs font-medium text-[#FBFBF8] transition-colors"
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
