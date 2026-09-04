'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  Building,
  ShieldAlert,
  FileCheck,
  Navigation,
} from 'lucide-react';
import type { HousingListing } from '@/lib/domain/housing-types';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import { useTranslation } from '@/lib/i18n/language-context';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';
import { getHousingGoogleMapsUrl } from '@/lib/domain/berlin-geo';

const HousingMap = dynamic(() => import('@/components/housing-map').then((mod) => mod.HousingMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 text-xs font-semibold text-slate-500">
      Berlin Karte lädt...
    </div>
  ),
});

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
      {/* Breadcrumb & Back Link */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link
          href="/wohnen"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="size-3.5" />
          {t('housingBackToListings')}
        </Link>
        <span>/</span>
        <span className="text-slate-400">Berlin</span>
        <span>/</span>
        <span className="text-blue-600">{listing.district}</span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Main Content Column */}
        <article className="space-y-6">
          {/* Header & Badges */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase text-blue-700">
                {isDe ? typeInfo.de : typeInfo.en}
              </span>

              {listing.anmeldungPossible ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  {isDe ? 'Anmeldung möglich (laut Inserent)' : 'Anmeldung Possible (per lister)'}
                </span>
              ) : (
                <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-300">
                  {isDe ? 'Keine Anmeldung möglich' : 'No Anmeldung'}
                </span>
              )}

              {listing.subletAuthorized ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
                  <ShieldCheck className="size-3.5 text-blue-600" />
                  {isDe ? 'Vom Eigentümer / Vermieter genehmigt' : 'Landlord Authorized'}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
              {listing.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                <MapPin className="size-3.5 text-blue-600" />
                {listing.district}
                {listing.neighborhood ? ` · ${listing.neighborhood}` : ''}
              </span>
              <span>·</span>
              <span className="font-mono">PLZ {listing.postcode} Berlin</span>
              {listing.streetAddress ? (
                <>
                  <span>·</span>
                  <span>{listing.streetAddress}</span>
                </>
              ) : null}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100">
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
                    className={`relative size-18 shrink-0 overflow-hidden rounded-lg border-2 transition cursor-pointer ${
                      selectedImage === idx
                        ? 'border-blue-600 shadow-xs'
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
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">
              {isDe ? 'Eckdaten & Ausstattung' : 'Key Facts & Equipment'}
            </h2>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                <dt className="text-[11px] text-slate-500 font-medium">
                  {isDe ? 'Wohnfläche' : 'Space'}
                </dt>
                <dd className="mt-1 text-base font-black font-mono text-slate-900">
                  {listing.roomSqm} m²
                </dd>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                <dt className="text-[11px] text-slate-500 font-medium">
                  {isDe ? 'Zimmeranzahl' : 'Rooms'}
                </dt>
                <dd className="mt-1 text-base font-bold text-slate-900">
                  {listing.totalRooms} {listing.totalRooms === 1 ? 'Zimmer' : 'Zimmer'}
                </dd>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                <dt className="text-[11px] text-slate-500 font-medium">
                  {isDe ? 'Möblierung' : 'Furnishing'}
                </dt>
                <dd className="mt-1 text-base font-bold text-slate-900">
                  {listing.furnished === 'fully'
                    ? isDe ? 'Voll möbliert' : 'Fully furnished'
                    : listing.furnished === 'partially'
                      ? isDe ? 'Teilmöbliert' : 'Partially furnished'
                      : isDe ? 'Unmöbliert' : 'Unfurnished'}
                </dd>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                <dt className="text-[11px] text-slate-500 font-medium">
                  {isDe ? 'Vertragsart' : 'Contract'}
                </dt>
                <dd className="mt-1 text-base font-bold text-slate-900">
                  {listing.contractType === 'open_ended'
                    ? isDe ? 'Unbefristet' : 'Open-ended'
                    : isDe ? 'Befristet' : 'Fixed-term'}
                </dd>
              </div>

              {listing.energyClass ? (
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                  <dt className="text-[11px] text-slate-500 font-medium">
                    {isDe ? 'Energieklasse (GEG)' : 'Energy Class (GEG)'}
                  </dt>
                  <dd className="mt-1 flex items-center gap-1 text-base font-bold text-slate-900">
                    <Zap className="size-4 text-emerald-600" />
                    {listing.energyClass}
                  </dd>
                </div>
              ) : null}

              {listing.heatingSource ? (
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5">
                  <dt className="text-[11px] text-slate-500 font-medium">
                    {isDe ? 'Heizungsträger' : 'Heating source'}
                  </dt>
                  <dd className="mt-1 text-base font-bold text-slate-900">
                    {listing.heatingSource}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">
              {isDe ? 'Beschreibung' : 'Description'}
            </h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {listing.description}
            </div>
          </div>

          {/* Legal Notice & Zero Liability Disclaimer */}
          <PlatformDisclaimer type="housing" />
        </article>

        {/* Sidebar Sticky Price & Contact Card */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            {/* Warmmiete Highlight */}
            <div className="border-b border-slate-100 pb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {isDe ? 'Monatliche Gesamtmiete' : 'Total Monthly Rent'}
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-4xl font-black font-mono tracking-tight text-slate-900">
                  {listing.warmmieteEur} €
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  warm / M.
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('housingKaltmiete')}:</span>
                <span className="font-bold font-mono text-slate-900">
                  {listing.kaltmieteEur} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('housingNebenkosten')}:</span>
                <span className="font-bold font-mono text-slate-900">
                  {listing.nebenkostenEur} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('housingKaution')}:</span>
                <span className="font-bold font-mono text-slate-900">
                  {listing.kautionEur} €
                </span>
              </div>
              <div className="pt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <FileCheck className="size-3.5 text-emerald-600" />
                <span>{t('housingDepositCompliance')}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-4 border-t border-slate-100 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-slate-500 text-[11px] font-medium">
                    {isDe ? 'Verfügbarkeit' : 'Availability'}
                  </p>
                  <p className="font-bold text-slate-900">
                    {listing.moveInDate}{' '}
                    {listing.moveOutDate ? `– ${listing.moveOutDate}` : isDe ? '(unbefristet)' : '(permanent)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Action */}
            <div className="mt-5 border-t border-slate-100 pt-5 space-y-2.5">
              <p className="text-[11px] font-medium text-slate-500">
                {isDe ? 'Direktkontakt zum Inserenten:' : 'Direct contact to lister:'}
              </p>

              <a
                href={`mailto:${listing.contactEmail}?subject=Anfrage: ${encodeURIComponent(listing.title)}`}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Mail className="size-4" />
                {t('housingContactLister')}
              </a>

              <button
                type="button"
                onClick={copyContactEmail}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{isDe ? 'E-Mail kopiert!' : 'Email copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-slate-400" />
                    <span>{isDe ? 'E-Mail-Adresse kopieren' : 'Copy email address'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Location & Map Card */}
          <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <div className="p-4">
              <h2 className="text-sm font-bold text-slate-900">
                {isDe ? 'Standort & Umgebung' : 'Location & Neighborhood'}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {listing.streetAddress ? `${listing.streetAddress}, ` : ''}
                {listing.neighborhood ? `${listing.neighborhood}, ` : ''}
                {listing.district ? `${listing.district}, ` : ''}
                {listing.postcode ? `${listing.postcode} ` : ''}Berlin
              </p>
            </div>

            <div className="h-44 w-full border-t border-b border-slate-100">
              <HousingMap
                listings={[listing]}
                miniMode
                centerSingleListing
                showCardOverlay={false}
                className="h-full w-full"
              />
            </div>

            <div className="p-3 bg-slate-50">
              <a
                href={getHousingGoogleMapsUrl(listing)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition hover:underline"
              >
                <Navigation className="size-3 text-blue-600" />
                <span>{isDe ? 'In Google Maps öffnen' : 'Open in Google Maps'}</span>
              </a>
            </div>
          </section>

          {/* Safety Card with Blue Authority */}
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-4.5 text-xs text-blue-950">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-4 shrink-0 text-blue-600 mt-0.5" />
              <div>
                <strong className="font-bold">
                  {isDe ? 'Wichtiger Sicherheitshinweis' : 'Important Safety Notice'}
                </strong>
                <p className="mt-1 leading-relaxed text-blue-900 text-[11px]">
                  {isDe
                    ? 'Überweise niemals Kaution oder Schlüssel-Gebühren vor einer persönlichen oder virtuellen Besichtigung und einem gegengezeichneten Mietvertrag.'
                    : 'Never transfer deposits or rent before a viewing and signed contract. Beware of advance payment requests.'}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
