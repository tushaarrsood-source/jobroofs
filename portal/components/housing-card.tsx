'use client';

import Link from 'next/link';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Home, ArrowRight } from 'lucide-react';
import type { HousingListing } from '@/lib/domain/housing-types';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import { useTranslation } from '@/lib/i18n/language-context';

export function HousingCard({ listing }: { listing: HousingListing }) {
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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition duration-200 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/8 cursor-pointer">
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-103"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-1.5 pointer-events-none">
          <span className="rounded-md bg-slate-900/85 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-white backdrop-blur-md shadow-xs">
            {isDe ? typeInfo.de : typeInfo.en}
          </span>
          
          {listing.anmeldungPossible ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md">
              <CheckCircle2 className="size-3.5" />
              <span>Anmeldung ✓</span>
            </span>
          ) : (
            <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs backdrop-blur-md">
              Keine Anmeldung
            </span>
          )}
        </div>

        {/* Bottom Image Badges */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white pointer-events-none">
          {listing.subletAuthorized ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/75 px-2 py-0.5 font-medium backdrop-blur-xs">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span>{isDe ? 'Vermieter-Erlaubnis liegt vor' : 'Landlord authorized'}</span>
            </span>
          ) : <span />}

          {photoCount > 1 && (
            <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium backdrop-blur-xs">
              {photoCount} Fotos
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* District & Location */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
            <MapPin className="size-3.5 text-blue-600 shrink-0" />
            <span className="text-slate-900">{listing.district}</span>
            {listing.neighborhood ? (
              <span className="text-slate-500">· {listing.neighborhood}</span>
            ) : null}
          </span>
          <span className="font-mono text-[11px] text-slate-400">PLZ {listing.postcode}</span>
        </div>

        {/* Title */}
        <h3 className="mt-2.5 text-base font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
          <Link href={`/wohnen/${listing.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {listing.title}
          </Link>
        </h3>

        {/* Room & Flat specs - Clean Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-800">
            {listing.roomSqm} m²
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-800">
            {listing.totalRooms}{' '}
            {listing.totalRooms === 1 ? (isDe ? 'Zimmer' : 'Room') : isDe ? 'Zimmer' : 'Rooms'}
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
            {listing.furnished === 'fully'
              ? isDe ? 'Möbliert' : 'Furnished'
              : listing.furnished === 'partially'
              ? isDe ? 'Teilmöbliert' : 'Partial'
              : isDe ? 'Unmöbliert' : 'Unfurnished'}
          </span>
          {listing.floorLevel !== null && listing.floorLevel !== undefined && (
            <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">
              {listing.floorLevel}. OG
            </span>
          )}
        </div>

        {/* Move-in & Duration */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="size-3.5 text-blue-500 shrink-0" />
          <span>
            {isDe ? 'Frei ab:' : 'Available:'}{' '}
            <strong className="font-semibold text-slate-800">{listing.moveInDate}</strong>
          </span>
          {listing.moveOutDate ? (
            <span>
              {isDe ? 'bis' : 'until'} {listing.moveOutDate}
            </span>
          ) : (
            <span className="rounded-full bg-blue-50 px-2 py-0.2 text-[10px] font-bold text-blue-700 border border-blue-200/60">
              {isDe ? 'Unbefristet' : 'Long-term'}
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono tracking-tight text-slate-900">
                {listing.warmmieteEur} €
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {isDe ? 'warm / M.' : 'warm / mo.'}
              </span>
            </div>
            <div className="mt-0.5 text-[11px] font-mono text-slate-400">
              <span>{listing.kaltmieteEur} € Kalt</span>
              {listing.nebenkostenEur > 0 ? (
                <span> + {listing.nebenkostenEur} € NK</span>
              ) : null}
            </div>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
            <span>{isDe ? 'Ansehen' : 'View'}</span>
            <ArrowRight className="size-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
