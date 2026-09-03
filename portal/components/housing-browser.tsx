'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Home,
  CheckCircle2,
  MapPin,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal,
  ArrowUpDown,
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
  'Prenzlauer Berg',
  'Charlottenburg-Wilmersdorf',
  'Tempelhof-Schöneberg',
  'Lichtenberg',
  'Treptow-Köpenick',
  'Steglitz-Zehlendorf',
  'Spandau',
  'Reinickendorf',
  'Wedding',
  'Moabit',
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
  const [onlyFurnished, setOnlyFurnished] = useState(false);
  const [maxRent, setMaxRent] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'sqm_desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter listings
  const filteredListings = useMemo(() => {
    let result = initialListings.filter((item) => {
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

      // Furnished
      if (onlyFurnished && item.furnished === 'unfurnished') {
        return false;
      }

      // Max rent
      if (maxRent !== '' && item.warmmieteEur > Number(maxRent)) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.warmmieteEur - b.warmmieteEur);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.warmmieteEur - a.warmmieteEur);
    } else if (sortBy === 'sqm_desc') {
      result.sort((a, b) => b.roomSqm - a.roomSqm);
    }

    return result;
  }, [initialListings, query, selectedType, selectedDistrict, onlyAnmeldung, onlyFurnished, maxRent, sortBy]);

  const hasActiveFilters =
    query !== '' ||
    selectedType !== 'all' ||
    selectedDistrict !== 'all' ||
    onlyAnmeldung ||
    onlyFurnished ||
    maxRent !== '';

  const clearFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedDistrict('all');
    setOnlyAnmeldung(false);
    setOnlyFurnished(false);
    setMaxRent('');
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-10 md:py-10">
      {/* Editorial Header - No glow orbs, no dark gradient clichés */}
      <section className="border-b border-slate-200 pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Wohnungen & WG-Zimmer in Berlin
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-2xl">
              {isDe
                ? 'Direkt von Mieter zu Mieter ohne Maklerprovision. Alle Inserate mit verbindlicher Wohnungsgeberbestätigung (Anmeldung) und transparenter Warmmiete.'
                : 'Direct from tenant to tenant with zero broker fees. All listings feature guaranteed Anmeldung and transparent warm rents.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/wohnen/list"
              className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
            >
              + {isDe ? 'Wohnung inserieren (29 €)' : 'Post a room (€29)'}
            </Link>
          </div>
        </div>

        {/* High-Utility Search & Filter Bar */}
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_130px]">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isDe ? 'Bezirk, Kiez, PLZ oder Stichwort...' : 'Search district, kiez or postcode...'}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">{t('housingAllDistricts')}</option>
              {BERLIN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Max rent */}
          <div>
            <input
              type="number"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Max. € warm"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Filter chips & Presets */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAnmeldung(!onlyAnmeldung)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                onlyAnmeldung
                  ? 'border border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <CheckCircle2 className={`size-3.5 ${onlyAnmeldung ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{t('housingOnlyAnmeldung')}</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlyFurnished(!onlyFurnished)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                onlyFurnished
                  ? 'border border-blue-600 bg-blue-50 text-blue-800'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <Home className="size-3.5 text-slate-400" />
              <span>Möbliert</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-2">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Bis:</span>
              {[600, 800, 1000].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setMaxRent(maxRent === price ? '' : price)}
                  className={`rounded px-2 py-1 text-xs font-mono transition cursor-pointer ${
                    maxRent === price
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {price} €
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="size-3" />
                <span>Filter löschen</span>
              </button>
            )}
          </div>

          {/* Sort selector & View toggle */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="price_asc">Miete: aufsteigend</option>
              <option value="price_desc">Miete: absteigend</option>
              <option value="sqm_desc">Größe: absteigend</option>
            </select>

            <div className="flex items-center rounded-md border border-slate-300 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded p-1 transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded p-1 transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="List"
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
        <p>
          <strong className="font-bold text-slate-900">{filteredListings.length}</strong>{' '}
          {isDe ? 'Wohnungen & WG-Zimmer in Berlin' : 'listings in Berlin'}
        </p>
        <span className="text-[11px] text-slate-400">
          Geprüft nach BGB § 551 (max. 3 Kaltmieten Kaution)
        </span>
      </div>

      {/* Listings Grid */}
      <div
        className={`mt-4 ${
          viewMode === 'grid'
            ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
            : 'mx-auto max-w-4xl space-y-3'
        }`}
      >
        {filteredListings.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Home className="mx-auto size-8 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">
              Keine Inserate für deine Filtereinstellungen gefunden
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Versuche, den maximalen Mietpreis zu erhöhen oder die Bezirksauswahl zu erweitern.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <HousingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-12">
        <PlatformDisclaimer type="housing" />
      </div>
    </div>
  );
}
