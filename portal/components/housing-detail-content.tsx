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
  Building,
  AlertCircle,
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
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('housingBackToListings')}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Main Content Column */}
        <article className="space-y-8">
          {/* Header & Badges */}
          <div className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#18221e] px-2.5 py-1 text-xs font-semibold text-white">
                {isDe ? typeInfo.de : typeInfo.en}
              </span>

              {listing.anmeldungPossible ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#244b34] px-2.5 py-1 text-xs font-semibold text-[#9de0b7]">
                  <CheckCircle2 className="size-3.5" />
                  {isDe ? 'Anmeldung garantiert (Wohnungsgeberbestätigung)' : 'Anmeldung Guaranteed'}
                </span>
              ) : (
                <span className="rounded-md bg-[#503d29] px-2.5 py-1 text-xs font-medium text-[#f3c987]">
                  {isDe ? 'Keine Anmeldung möglich' : 'No Anmeldung'}
                </span>
              )}

              {listing.subletAuthorized ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#edf2ff] px-2.5 py-1 text-xs font-medium text-[#385cdd]">
                  <ShieldCheck className="size-3.5" />
                  {isDe ? 'Vom Eigentümer / Vermieter genehmigt' : 'Landlord Authorized'}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#18221e] md:text-4xl">
              {listing.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-medium text-[#18221e]">
                <MapPin className="size-4 text-[#ed6a43]" />
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
          <div className="overflow-hidden rounded-xl border border-foreground/15 bg-white p-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#eef0ec]">
              <img
                src={images[selectedImage]}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            </div>

            {images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === idx
                        ? 'border-[#385cdd]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Key Facts Grid */}
          <div className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-[#18221e]">
              {isDe ? 'Eckdaten & Ausstattung' : 'Key Facts & Equipment'}
            </h2>

            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5">
                <dt className="text-xs text-muted-foreground">
                  {isDe ? 'Wohnfläche' : 'Space'}
                </dt>
                <dd className="mt-1 text-base font-semibold text-[#18221e]">
                  {listing.roomSqm} m²
                </dd>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5">
                <dt className="text-xs text-muted-foreground">
                  {isDe ? 'Zimmeranzahl' : 'Rooms'}
                </dt>
                <dd className="mt-1 text-base font-semibold text-[#18221e]">
                  {listing.totalRooms} {listing.totalRooms === 1 ? 'Zimmer' : 'Zimmer'}
                </dd>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5">
                <dt className="text-xs text-muted-foreground">
                  {isDe ? 'Möblierung' : 'Furnishing'}
                </dt>
                <dd className="mt-1 text-base font-semibold text-[#18221e]">
                  {listing.furnished === 'fully'
                    ? isDe ? 'Voll möbliert' : 'Fully furnished'
                    : listing.furnished === 'partially'
                      ? isDe ? 'Teilmöbliert' : 'Partially furnished'
                      : isDe ? 'Unmöbliert' : 'Unfurnished'}
                </dd>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5">
                <dt className="text-xs text-muted-foreground">
                  {isDe ? 'Vertragsart' : 'Contract'}
                </dt>
                <dd className="mt-1 text-base font-semibold text-[#18221e]">
                  {listing.contractType === 'open_ended'
                    ? isDe ? 'Unbefristet' : 'Open-ended'
                    : isDe ? 'Befristet' : 'Fixed-term'}
                </dd>
              </div>

              {listing.energyClass ? (
                <div className="rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5">
                  <dt className="text-xs text-muted-foreground">
                    {isDe ? 'Energieklasse (GEG)' : 'Energy Class (GEG)'}
                  </dt>
                  <dd className="mt-1 flex items-center gap-1 text-base font-semibold text-[#18221e]">
                    <Zap className="size-4 text-[#72c697]" />
                    {listing.energyClass}
                  </dd>
                </div>
              ) : null}

              {listing.heatingSource ? (
                <div className="rounded-lg border border-foreground/10 bg-[#faf8f5] p-3.5">
                  <dt className="text-xs text-muted-foreground">
                    {isDe ? 'Heizungsträger' : 'Heating source'}
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-[#18221e]">
                    {listing.heatingSource}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-foreground/15 bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-[#18221e]">
              {isDe ? 'Beschreibung' : 'Description'}
            </h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#3c4a42]">
              {listing.description}
            </div>
          </div>

          {/* Legal Notice & Zero Liability Disclaimer */}
          <PlatformDisclaimer type="housing" />
        </article>

        {/* Sidebar Sticky Price & Contact Card */}
        <aside className="h-fit space-y-5 lg:sticky lg:top-8">
          <div className="rounded-xl border border-foreground/15 bg-white p-6 shadow-sm">
            {/* Warmmiete Highlight */}
            <div className="border-b border-foreground/10 pb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isDe ? 'Monatliche Warmmiete' : 'Monthly Warm Rent'}
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-[#18221e]">
                  {listing.warmmieteEur} €
                </span>
                <span className="text-sm text-muted-foreground">
                  {isDe ? 'warm' : 'warm'}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{t('housingKaltmiete')}:</span>
                <span className="font-semibold text-[#18221e]">
                  {listing.kaltmieteEur} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('housingNebenkosten')}:</span>
                <span className="font-semibold text-[#18221e]">
                  {listing.nebenkostenEur} €
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('housingKaution')}:</span>
                <span className="font-semibold text-[#18221e]">
                  {listing.kautionEur} €
                </span>
              </div>
              <div className="pt-2 text-[11px] text-[#285a39]">
                ✓ {t('housingDepositCompliance')}
              </div>
            </div>

            {/* Dates */}
            <div className="mt-5 border-t border-foreground/10 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-[#ed6a43]" />
                <div>
                  <p className="text-muted-foreground">
                    {isDe ? 'Verfügbarkeit' : 'Availability'}
                  </p>
                  <p className="font-semibold text-[#18221e]">
                    {listing.moveInDate}{' '}
                    {listing.moveOutDate ? `– ${listing.moveOutDate}` : (isDe ? '(unbefristet)' : '(permanent)')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Action */}
            <div className="mt-6 border-t border-foreground/10 pt-5 space-y-3">
              <p className="text-xs text-muted-foreground">
                {isDe ? 'Kontakt zur Inserentin / zum Inserenten:' : 'Contact the lister:'}
              </p>

              <a
                href={`mailto:${listing.contactEmail}?subject=Anfrage: ${encodeURIComponent(listing.title)}`}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#18221e] px-4 font-semibold text-white shadow-xs transition hover:bg-[#2a3832]"
              >
                <Mail className="size-4" />
                {t('housingContactLister')}
              </a>

              <button
                type="button"
                onClick={copyContactEmail}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-foreground/15 bg-white text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                {copiedEmail ? (
                  <>
                    <Check className="size-3.5 text-[#244b34]" />
                    <span>{isDe ? 'E-Mail kopiert!' : 'Email copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>{isDe ? 'E-Mail-Adresse kopieren' : 'Copy email address'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Safety Card */}
          <div className="rounded-xl border border-[#c7d8cc] bg-[#e2f3e6] p-4 text-xs text-[#285a39]">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-4 shrink-0 text-[#285a39]" />
              <div>
                <strong className="font-semibold">
                  {isDe ? 'KIEZJOB Mieterschutz-Hinweis' : 'KIEZJOB Tenant Safety Note'}
                </strong>
                <p className="mt-1 leading-relaxed text-[#3c5e48]">
                  {isDe
                    ? 'Überweise niemals Kaution oder Miete vor einer persönlichen oder virtuellen Besichtigung und Vertragsunterzeichnung.'
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
