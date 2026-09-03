'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Calendar,
  Home,
  Mail,
  Zap,
  Copy,
  Check,
} from 'lucide-react';
import type { HousingListing } from '@/lib/domain/housing-types';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import { useTranslation } from '@/lib/i18n/language-context';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';

export function HousingDetailContent({ listing }: { listing: HousingListing }) {
  const { t, isDe } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const typeInfo = housingTypeLabels[listing.listingType] || {
    de: listing.listingType,
    en: listing.listingType,
  };

  const images = listing.images?.length
    ? listing.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'];

  const copyContactEmail = () => {
    navigator.clipboard.writeText(listing.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-10 md:py-12">
      {/* Back Link */}
      <Link
        href="/wohnen"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition hover:text-zinc-950"
      >
        <ArrowLeft className="size-3.5" />
        {t('housingBackToListings')}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Main Content Column */}
        <article className="space-y-6">
          {/* Header & Badges */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 md:p-8 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-zinc-950 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-white">
                {isDe ? typeInfo.de : typeInfo.en}
              </span>

              {listing.anmeldungPossible ? (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="size-3.5 text-emerald-700" />
                  {isDe ? 'Anmeldung garantiert' : 'Anmeldung Guaranteed'}
                </span>
              ) : (
                <span className="rounded bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 border border-amber-300">
                  {isDe ? 'Keine Anmeldung möglich' : 'No Anmeldung'}
                </span>
              )}

              {listing.subletAuthorized ? (
                <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 border border-zinc-200">
                  <ShieldCheck className="size-3.5 text-zinc-500" />
                  {isDe ? 'Vermieter-Erlaubnis liegt vor' : 'Landlord Authorized'}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
              {listing.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1 font-semibold text-zinc-800">
                <MapPin className="size-3.5 text-zinc-400" />
                {listing.district}
                {listing.neighborhood ? ` · ${listing.neighborhood}` : ''}
              </span>
              <span>·</span>
              <span>PLZ {listing.postcode} Berlin</span>
              {listing.streetAddress ? (
                <>
                  <span>·</span>
                  <span>{listing.streetAddress}</span>
                </>
              ) : null}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 shadow-2xs">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-100">
              <img
                src={images[selectedImage]}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            </div>

            {images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition cursor-pointer ${
                      selectedImage === idx
                        ? 'border-zinc-950'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Key Facts Grid */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 md:p-8 shadow-2xs">
            <h2 className="text-base font-bold text-zinc-950">
              {isDe ? 'Eckdaten & Ausstattung' : 'Key Facts & Equipment'}
            </h2>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3">
                <dt className="text-[11px] text-zinc-500 font-medium">
                  {isDe ? 'Wohnfläche' : 'Space'}
                </dt>
                <dd className="mt-1 text-sm font-bold text-zinc-950">
                  {listing.roomSqm} m²
                </dd>
              </div>

              <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3">
                <dt className="text-[11px] text-zinc-500 font-medium">
                  {isDe ? 'Zimmeranzahl' : 'Rooms'}
                </dt>
                <dd className="mt-1 text-sm font-bold text-zinc-950">
                  {listing.totalRooms} {listing.totalRooms === 1 ? 'Zimmer' : 'Zimmer'}
                </dd>
              </div>

              <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3">
                <dt className="text-[11px] text-zinc-500 font-medium">
                  {isDe ? 'Möblierung' : 'Furnishing'}
                </dt>
                <dd className="mt-1 text-sm font-bold text-zinc-950">
                  {listing.furnished === 'fully'
                    ? isDe ? 'Voll möbliert' : 'Fully furnished'
                    : listing.furnished === 'partially'
                      ? isDe ? 'Teilmöbliert' : 'Partially furnished'
                      : isDe ? 'Unmöbliert' : 'Unfurnished'}
                </dd>
              </div>

              <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3">
                <dt className="text-[11px] text-zinc-500 font-medium">
                  {isDe ? 'Vertragsart' : 'Contract'}
                </dt>
                <dd className="mt-1 text-sm font-bold text-zinc-950">
                  {listing.contractType === 'open_ended'
                    ? isDe ? 'Unbefristet' : 'Open-ended'
                    : isDe ? 'Befristet' : 'Fixed-term'}
                </dd>
              </div>

              {listing.energyClass ? (
                <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3">
                  <dt className="text-[11px] text-zinc-500 font-medium">
                    {isDe ? 'Energieklasse (GEG)' : 'Energy Class'}
                  </dt>
                  <dd className="mt-1 flex items-center gap-1 text-sm font-bold text-zinc-950">
                    <Zap className="size-3.5 text-amber-500" />
                    {listing.energyClass}
                  </dd>
                </div>
              ) : null}

              {listing.heatingSource ? (
                <div className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3">
                  <dt className="text-[11px] text-zinc-500 font-medium">
                    {isDe ? 'Heizungsträger' : 'Heating source'}
                  </dt>
                  <dd className="mt-1 text-sm font-bold text-zinc-950">
                    {listing.heatingSource}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 md:p-8 shadow-2xs">
            <h2 className="text-base font-bold text-zinc-950">
              {isDe ? 'Beschreibung' : 'Description'}
            </h2>
            <div className="mt-4 whitespace-pre-line text-xs leading-relaxed text-zinc-600">
              {listing.description}
            </div>
          </div>

          {/* Legal Notice & Zero Liability Disclaimer */}
          <PlatformDisclaimer type="housing" />
        </article>

        {/* Sidebar Sticky Price & Contact Card */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs">
            {/* Warmmiete Highlight */}
            <div className="border-b border-zinc-100 pb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {isDe ? 'Monatliche Warmmiete' : 'Monthly Warm Rent'}
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-zinc-950">
                  {listing.warmmieteEur} €
                </span>
                <span className="text-xs text-zinc-500">
                  warm / M.
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>{t('housingKaltmiete')}:</span>
                <span className="font-semibold font-mono text-zinc-900">
                  {listing.kaltmieteEur} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('housingNebenkosten')}:</span>
                <span className="font-semibold font-mono text-zinc-900">
                  {listing.nebenkostenEur} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('housingKaution')}:</span>
                <span className="font-semibold font-mono text-zinc-900">
                  {listing.kautionEur} €
                </span>
              </div>
              <div className="pt-1.5 text-[11px] text-emerald-800 font-medium">
                ✓ {t('housingDepositCompliance')}
              </div>
            </div>

            {/* Dates */}
            <div className="mt-4 border-t border-zinc-100 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-zinc-400" />
                <div>
                  <p className="text-zinc-500 text-[11px]">
                    {isDe ? 'Verfügbarkeit' : 'Availability'}
                  </p>
                  <p className="font-semibold text-zinc-900">
                    {listing.moveInDate}{' '}
                    {listing.moveOutDate ? `– ${listing.moveOutDate}` : isDe ? '(unbefristet)' : '(permanent)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Action */}
            <div className="mt-5 border-t border-zinc-100 pt-5 space-y-2.5">
              <p className="text-[11px] text-zinc-500">
                {isDe ? 'Kontakt zur Inserentin / zum Inserenten:' : 'Contact the lister:'}
              </p>

              <a
                href={`mailto:${listing.contactEmail}?subject=Anfrage: ${encodeURIComponent(listing.title)}`}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-black"
              >
                <Mail className="size-3.5" />
                {t('housingContactLister')}
              </a>

              <button
                type="button"
                onClick={copyContactEmail}
                className="flex h-8.5 w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-950 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span>{isDe ? 'E-Mail kopiert!' : 'Email copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-zinc-400" />
                    <span>{isDe ? 'E-Mail-Adresse kopieren' : 'Copy email address'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Safety Card */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-xs text-emerald-900">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-4 shrink-0 text-emerald-700 mt-0.5" />
              <div>
                <strong className="font-semibold">
                  {isDe ? 'KIEZJOB Mieterschutz-Hinweis' : 'KIEZJOB Tenant Safety Note'}
                </strong>
                <p className="mt-1 leading-relaxed text-emerald-800 text-[11px]">
                  {isDe
                    ? 'Überweise niemals Kaution oder Miete vor einer persönlichen Besichtigung und Vertragsunterzeichnung.'
                    : 'Never transfer deposits or rent before a viewing and signed contract. Protected against wire transfer scams.'}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
