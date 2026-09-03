'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Home,
  CheckCircle2,
  MapPin,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  LayoutGrid,
  List,
  Map as MapIcon,
  X,
} from 'lucide-react';
import type { HousingListing, HousingListingType } from '@/lib/domain/housing-types';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import { HousingCard } from '@/components/housing-card';
import { useTranslation } from '@/lib/i18n/language-context';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';

const BERLIN_DISTRICTS = [
  'Mitte',
  'Friedrichshain',
  'Kreuzberg',
  'Neukölln',
  'Pankow',
  'Charlottenburg-Wilmersdorf',
  'Tempelhof-Schöneberg',
  'Lichtenberg',
  'Treptow-Köpenick',
  'Steglitz-Zehlendorf',
  'Spandau',
  'Reinickendorf',
  'Marzahn-Hellersdorf',
];

export function HousingBrowser({
  initialListings,
}: {
  initialListings: HousingListing[];
}) {
  const { t, isDe } = useTranslation();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [onlyAnmeldung, setOnlyAnmeldung] = useState(false);
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter listings
  const filteredListings = useMemo(() => {
    return initialListings.filter((item) => {
      // Search query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesPostcode = item.postcode.includes(q);
        const matchesKiez = item.neighborhood?.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDistrict && !matchesPostcode && !matchesKiez && !matchesDesc) {
          return false;
        }
      }

      // Housing type
      if (selectedType !== 'all' && item.listingType !== selectedType) {
        return false;
      }

      // District
      if (selectedDistrict !== 'all' && !item.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false;
      }

      // Anmeldung
      if (onlyAnmeldung && !item.anmeldungPossible) {
        return false;
      }

      // Max rent
      if (maxRent !== '' && item.warmmieteEur > Number(maxRent)) {
        return false;
      }

      return true;
    });
  }, [initialListings, query, selectedType, selectedDistrict, onlyAnmeldung, maxRent]);

  const hasActiveFilters =
    query !== '' ||
    selectedType !== 'all' ||
    selectedDistrict !== 'all' ||
    onlyAnmeldung ||
    maxRent !== '';

  const clearFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedDistrict('all');
    setOnlyAnmeldung(false);
    setMaxRent('');
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-foreground/15 bg-[#18221e] px-6 py-10 text-[#f4f0e7] shadow-sm md:px-12 md:py-14">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-[#9de0b7]">
            <ShieldCheck className="size-3.5" />
            {t('housingHeroEyebrow')}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl lg:text-6xl">
            {t('housingHeroTitle')}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#c7d1ca] md:text-lg">
            {t('housingHeroSubtitle')}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/wohnen/list"
              className="inline-flex h-11 items-center rounded-lg bg-[#385cdd] px-6 font-semibold text-white shadow-xs transition hover:bg-[#2e4ec5]"
            >
              {t('housingPostButton')} <ArrowUpRight className="ml-1.5 size-4" />
            </Link>

            <span className="rounded-lg border border-white/15 px-3.5 py-2.5 text-xs text-[#c7d1ca]">
              {isDe ? 'Gegen Fake-Vermieter & Vorab-Zahlungen geschützt' : 'Protected against fake landlords & advance fee fraud'}
            </span>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-96 rounded-full bg-[#385cdd]/15 blur-3xl" />
      </section>

      {/* Filter & Search Bar */}
      <section className="mt-8 rounded-xl border border-foreground/15 bg-white p-5 shadow-xs">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
          {/* Search text */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isDe ? 'Bezirk, Kiez, PLZ oder Stichwort...' : 'District, kiez, postcode or keyword...'}
              className="h-10 w-full rounded-lg border border-foreground/15 bg-transparent pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#385cdd] focus:outline-none"
            />
          </div>

          {/* Housing Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm text-foreground focus:border-[#385cdd] focus:outline-none"
            >
              <option value="all">{t('housingAllTypes')}</option>
              {Object.entries(housingTypeLabels).map(([key, val]) => (
                <option key={key} value={key}>
                  {isDe ? val.de : val.en}
                </option>
              ))}
            </select>
          </div>

          {/* District dropdown */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="h-10 w-full rounded-lg border border-foreground/15 bg-transparent px-3 text-sm text-foreground focus:border-[#385cdd] focus:outline-none"
            >
              <option value="all">{t('housingAllDistricts')}</option>
              {BERLIN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Max rent input */}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Max €"
              className="h-10 w-24 rounded-lg border border-foreground/15 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#385cdd] focus:outline-none"
            />
          </div>
        </div>

        {/* Secondary quick filters */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAnmeldung(!onlyAnmeldung)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                onlyAnmeldung
                  ? 'border border-[#244b34] bg-[#e2f3e6] text-[#244b34]'
                  : 'border border-foreground/15 bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              {t('housingOnlyAnmeldung')}
            </button>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full border border-foreground/10 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
                {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
              </button>
            ) : null}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-foreground/15 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded p-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-[#18221e] text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded p-1.5 transition ${
                viewMode === 'list'
                  ? 'bg-[#18221e] text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="List View"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          <span className="font-bold text-[#18221e]">{filteredListings.length}</span>{' '}
          {isDe ? 'Wohnungs- & Zimmerangebote gefunden' : 'apartments & rooms found'}
        </p>

        <Link
          href="/wohnen/list"
          className="text-xs font-semibold text-[#385cdd] hover:underline"
        >
          {isDe ? '+ Eigenes Inserat aufgeben (29 €)' : '+ List your place (€29)'}
        </Link>
      </div>

      {/* Listings Grid / List */}
      {filteredListings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-foreground/12 bg-white p-12 text-center">
          <Home className="mx-auto size-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">
            {isDe ? 'Keine passenden Angebote gefunden' : 'No matching listings found'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isDe
              ? 'Versuche deine Filter zurückzusetzen oder einen anderen Bezirk auszuwählen.'
              : 'Try resetting your filters or selecting a different district.'}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-[#18221e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2a3832]"
          >
            {isDe ? 'Alle Filter zurücksetzen' : 'Reset all filters'}
          </button>
        </div>
      ) : (
        <div
          className={`mt-6 grid gap-6 ${
            viewMode === 'grid'
              ? 'sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {filteredListings.map((item) => (
            <HousingCard key={item.id} listing={item} />
          ))}
        </div>
      )}

      {/* Zero Liability Notice */}
      <div className="mt-12">
        <PlatformDisclaimer type="housing" />
      </div>
    </div>
  );
}
