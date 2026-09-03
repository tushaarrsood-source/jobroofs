'use client';

import Link from 'next/link';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Home } from 'lucide-react';
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

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-zinc-950 hover:shadow-xs cursor-pointer">
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
        <img
          src={primaryImage}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-103"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="rounded bg-zinc-950/80 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-white backdrop-blur-xs">
            {isDe ? typeInfo.de : typeInfo.en}
          </span>
          {listing.anmeldungPossible ? (
            <span className="inline-flex items-center gap-1 rounded bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-emerald-900 border border-emerald-300/80 shadow-2xs backdrop-blur-xs">
              <CheckCircle2 className="size-3 text-emerald-700" />
              {isDe ? 'Anmeldung garantiert' : 'Anmeldung OK'}
            </span>
          ) : (
            <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-medium text-amber-900 border border-amber-300/70 shadow-2xs backdrop-blur-xs">
              {isDe ? 'Keine Anmeldung' : 'No Anmeldung'}
            </span>
          )}
        </div>

        {listing.subletAuthorized ? (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
              <ShieldCheck className="size-3 text-emerald-400" />
              {isDe ? 'Vermieter-Erlaubnis liegt vor' : 'Landlord authorized'}
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4.5">
        {/* District & Location */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1 font-medium text-zinc-700">
            <MapPin className="size-3 text-zinc-400" />
            {listing.district}
            {listing.neighborhood ? ` · ${listing.neighborhood}` : ''}
          </span>
          <span className="font-mono text-[11px] text-zinc-400">PLZ {listing.postcode}</span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-sm font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-black">
          <Link href={`/wohnen/${listing.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {listing.title}
          </Link>
        </h3>

        {/* Room & Flat specs */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Home className="size-3 text-zinc-400" />
            {listing.roomSqm} m²
          </span>
          <span>·</span>
          <span>
            {listing.totalRooms}{' '}
            {listing.totalRooms === 1 ? (isDe ? 'Zimmer' : 'Room') : isDe ? 'Zimmer' : 'Rooms'}
          </span>
          <span>·</span>
          <span>
            {listing.furnished === 'fully'
              ? isDe
                ? 'Möbliert'
                : 'Furnished'
              : listing.furnished === 'partially'
              ? isDe
                ? 'Teilmöbliert'
                : 'Partial'
              : isDe
              ? 'Unmöbliert'
              : 'Unfurnished'}
          </span>
        </div>

        {/* Move-in & Duration */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
          <Calendar className="size-3 text-zinc-400" />
          <span>
            {isDe ? 'Frei ab:' : 'Available:'}{' '}
            <strong className="font-medium text-zinc-800">{listing.moveInDate}</strong>
          </span>
          {listing.moveOutDate ? (
            <span>
              {isDe ? 'bis' : 'until'} {listing.moveOutDate}
            </span>
          ) : (
            <span className="rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] font-medium text-zinc-600 border border-zinc-200">
              {isDe ? 'Unbefristet' : 'Long-term'}
            </span>
          )}
        </div>

        {/* Price Box */}
        <div className="mt-4 border-t border-zinc-100 pt-3 flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold font-mono tracking-tight text-zinc-950">
              {listing.warmmieteEur} €
            </span>
            <span className="ml-1 text-[11px] text-zinc-500">
              {isDe ? 'warm / M.' : 'warm / mo.'}
            </span>
          </div>

          <div className="text-right text-[11px] font-mono text-zinc-400">
            <span>{listing.kaltmieteEur} € Kalt</span>
            {listing.nebenkostenEur > 0 ? (
              <span> + {listing.nebenkostenEur} € NK</span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
