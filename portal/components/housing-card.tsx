'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Home, ArrowUpRight } from 'lucide-react';
import type { HousingListing } from '@/lib/domain/housing-types';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import { useTranslation } from '@/lib/i18n/language-context';

export function HousingCard({ listing }: { listing: HousingListing }) {
  const { isDe } = useTranslation();
  const typeInfo = housingTypeLabels[listing.listingType] || {
    de: listing.listingType,
    en: listing.listingType,
  };

  const primaryImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-foreground/15 bg-white transition hover:border-[#385cdd]/50 hover:shadow-md">
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#eef0ec]">
        <img
          src={primaryImage}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-[#18221e]/85 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
            {isDe ? typeInfo.de : typeInfo.en}
          </span>
          {listing.anmeldungPossible ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#244b34]/90 px-2 py-0.5 text-[11px] font-semibold text-[#9de0b7] backdrop-blur-xs">
              <CheckCircle2 className="size-3" />
              {isDe ? 'Anmeldung garantiert' : 'Anmeldung OK'}
            </span>
          ) : (
            <span className="rounded-md bg-[#503d29]/90 px-2 py-0.5 text-[11px] font-medium text-[#f3c987] backdrop-blur-xs">
              {isDe ? 'Keine Anmeldung' : 'No Anmeldung'}
            </span>
          )}
        </div>

        {listing.subletAuthorized ? (
          <div className="absolute bottom-2.5 left-3">
            <span className="inline-flex items-center gap-1 rounded-sm bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
              <ShieldCheck className="size-3 text-[#72c697]" />
              {isDe ? 'Vermieter-Erlaubnis liegt vor' : 'Landlord authorized'}
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* District & Location */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium text-[#18221e]">
            <MapPin className="size-3.5 text-[#ed6a43]" />
            {listing.district}
            {listing.neighborhood ? ` · ${listing.neighborhood}` : ''}
          </span>
          <span className="font-mono text-[11px]">PLZ {listing.postcode}</span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base font-semibold leading-snug tracking-[-0.02em] text-[#18221e] group-hover:text-[#385cdd]">
          <Link href={`/wohnen/${listing.id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {listing.title}
          </Link>
        </h3>

        {/* Room & Flat specs */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Home className="size-3 text-[#65716a]" />
            {listing.roomSqm} m²
          </span>
          <span>·</span>
          <span>
            {listing.totalRooms} {listing.totalRooms === 1 ? (isDe ? 'Zimmer' : 'Room') : (isDe ? 'Zimmer' : 'Rooms')}
          </span>
          <span>·</span>
          <span>
            {listing.furnished === 'fully'
              ? isDe ? 'Möbliert' : 'Furnished'
              : listing.furnished === 'partially'
                ? isDe ? 'Teilmöbliert' : 'Partial'
                : isDe ? 'Unmöbliert' : 'Unfurnished'}
          </span>
        </div>

        {/* Move-in & Duration */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5 text-[#65716a]" />
          <span>
            {isDe ? 'Frei ab:' : 'Available:'}{' '}
            <strong className="font-medium text-[#18221e]">{listing.moveInDate}</strong>
          </span>
          {listing.moveOutDate ? (
            <span>
              {isDe ? 'bis' : 'until'} {listing.moveOutDate}
            </span>
          ) : (
            <span className="rounded bg-foreground/5 px-1.5 py-0.2 text-[10px] text-muted-foreground">
              {isDe ? 'Unbefristet' : 'Long-term'}
            </span>
          )}
        </div>

        {/* Price Box */}
        <div className="mt-5 border-t border-foreground/10 pt-3.5 flex items-baseline justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#18221e]">
              {listing.warmmieteEur} €
            </span>
            <span className="ml-1 text-xs text-muted-foreground">
              {isDe ? 'warm / Monat' : 'warm / month'}
            </span>
          </div>

          <div className="text-right text-[11px] text-muted-foreground">
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
