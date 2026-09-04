'use client';

import Link from '@/components/ui/link';
import { CheckCircle2, MapPin, Calendar, ArrowRight } from 'lucide-react';
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
  const isFeatured = listing.tier === 'premium';

  return (
    <Link
      href={`/wohnen/${listing.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-[20px] border bg-white cursor-pointer transition-all duration-200 active:scale-[0.99] ${
        isSelected
          ? 'border-transparent ring-2 ring-[#0071e3] shadow-md'
          : isHovered
            ? 'border-black/[0.14] shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
            : 'border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-black/[0.12] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-[1px]'
      }`}
    >
      {/* Image Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/[0.04]">
        <img
          src={primaryImage}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Top Badges (Apple Frosted Glass Overlay) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-white border border-white/10">
              {isDe ? typeInfo.de : typeInfo.en}
            </span>
            {isFeatured && (
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-semibold text-black shadow-xs">
                Featured · 60d
              </span>
            )}
          </div>

          {listing.anmeldungPossible ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
              <CheckCircle2 className="size-3" />
              <span>Anmeldung ✓</span>
            </span>
          ) : (
            <span className="rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-white/80">
              Keine Anmeldung
            </span>
          )}
        </div>

        {/* Bottom image stats */}
        {photoCount > 1 && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-white pointer-events-none border border-white/10">
            {photoCount} Fotos
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* District & Location */}
        <div className="flex items-center justify-between text-[13px] text-[#86868b]">
          <span className="inline-flex items-center gap-1 font-medium text-[#1d1d1f]">
            <MapPin className="size-3.5 text-[#86868b] shrink-0" />
            <span>{listing.district}</span>
            {listing.neighborhood ? (
              <span className="text-[#86868b]">· {listing.neighborhood}</span>
            ) : null}
          </span>
          <span className="font-mono text-[12px] text-[#86868b]">PLZ {listing.postcode}</span>
        </div>

        {/* Title */}
        <h3 className="mt-1.5 text-[16px] font-semibold leading-snug tracking-tight text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2">
          {listing.title}
        </h3>

        {/* Specs row */}
        <p className="mt-2 text-[13px] text-[#86868b] flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-[#1d1d1f]">{listing.roomSqm} m²</span>
          <span className="text-black/20">·</span>
          <span>{listing.totalRooms} {listing.totalRooms === 1 ? 'Zimmer' : 'Zimmer'}</span>
          <span className="text-black/20">·</span>
          <span>
            {listing.furnished === 'fully'
              ? 'Voll möbliert'
              : listing.furnished === 'partially'
              ? 'Teilmöbliert'
              : 'Unmöbliert'}
          </span>
          {listing.floorLevel !== null && listing.floorLevel !== undefined ? (
            <>
              <span className="text-black/20">·</span>
              <span>{listing.floorLevel}. OG</span>
            </>
          ) : null}
        </p>

        {/* Availability */}
        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#86868b]">
          <Calendar className="size-3.5 text-[#86868b] shrink-0" />
          <span>Frei ab <strong className="font-semibold text-[#1d1d1f]">{listing.moveInDate}</strong></span>
          {listing.moveOutDate ? (
            <span>bis {listing.moveOutDate}</span>
          ) : (
            <span className="font-medium text-[#0071e3]">(Unbefristet)</span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 border-t border-black/[0.04] pt-3 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono tracking-tight text-[#1d1d1f]">
                {listing.warmmieteEur} €
              </span>
              <span className="text-xs text-[#86868b]">warm / M.</span>
            </div>
            <div className="text-[11px] font-mono text-[#86868b]">
              {listing.kaltmieteEur} € Kalt + {listing.nebenkostenEur} € NK
            </div>
          </div>

          <div className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0071e3] group-hover:translate-x-0.5 transition-transform">
            <span>Ansehen</span>
            <ArrowRight className="size-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
