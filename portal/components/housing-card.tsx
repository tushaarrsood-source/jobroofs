'use client';

import Link from 'next/link';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, ArrowRight } from 'lucide-react';
import type { HousingListing } from '@/lib/domain/housing-types';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import { useTranslation } from '@/lib/i18n/language-context';

export function HousingCard({
  listing,
  isSelected = false,
  isHovered = false,
}: {
  listing: HousingListing;
  isSelected?: boolean;
  isHovered?: boolean;
}) {
  const { isDe } = useTranslation();
  const typeInfo = housingTypeLabels[listing.listingType] || {
    de: listing.listingType,
    en: listing.listingType,
  };

  const primaryImage =
    listing.images?.[0] ||
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const photoCount = listing.images?.length || 1;

  return (
    <Link
      href={`/wohnen/${listing.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-2xs transition duration-150 cursor-pointer ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-md'
          : isHovered
            ? 'border-blue-400 shadow-sm'
            : 'border-slate-200/90 hover:border-slate-400 hover:shadow-xs'
      }`}
    >
      {/* Image Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-200 group-hover:scale-102"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
          <span className="rounded bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {isDe ? typeInfo.de : typeInfo.en}
          </span>

          {listing.anmeldungPossible ? (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              <CheckCircle2 className="size-3" />
              <span>Anmeldung ✓</span>
            </span>
          ) : (
            <span className="rounded bg-amber-500/95 px-2 py-0.5 text-[10px] font-semibold text-white">
              Keine Anmeldung
            </span>
          )}
        </div>

        {/* Bottom image stats */}
        {photoCount > 1 && (
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white pointer-events-none">
            {photoCount} Fotos
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* District & Location */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <MapPin className="size-3.5 text-blue-600 shrink-0" />
            <span>{listing.district}</span>
            {listing.neighborhood ? (
              <span className="text-slate-400">· {listing.neighborhood}</span>
            ) : null}
          </span>
          <span className="font-mono text-[11px] text-slate-400">PLZ {listing.postcode}</span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-sm font-bold leading-snug tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {listing.title}
        </h3>

        {/* Specs row */}
        <p className="mt-2 text-xs text-slate-600">
          <strong>{listing.roomSqm} m²</strong> · {listing.totalRooms} {listing.totalRooms === 1 ? 'Zimmer' : 'Zimmer'} ·{' '}
          {listing.furnished === 'fully'
            ? 'Voll möbliert'
            : listing.furnished === 'partially'
            ? 'Teilmöbliert'
            : 'Unmöbliert'}
          {listing.floorLevel !== null && listing.floorLevel !== undefined ? ` · ${listing.floorLevel}. OG` : ''}
        </p>

        {/* Availability */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
          <Calendar className="size-3 text-slate-400 shrink-0" />
          <span>Frei ab <strong>{listing.moveInDate}</strong></span>
          {listing.moveOutDate ? (
            <span>bis {listing.moveOutDate}</span>
          ) : (
            <span className="font-medium text-blue-700">(Unbefristet)</span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 border-t border-slate-100 pt-3 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black font-mono tracking-tight text-slate-900">
                {listing.warmmieteEur} €
              </span>
              <span className="text-xs text-slate-500">warm / M.</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {listing.kaltmieteEur} € Kalt + {listing.nebenkostenEur} € NK
            </div>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
            <span>Ansehen</span>
            <ArrowRight className="size-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
