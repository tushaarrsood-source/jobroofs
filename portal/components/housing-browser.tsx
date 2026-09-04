'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  Layers,
  Map as MapIcon,
  X,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import type { HousingListing, HousingListingType } from '@/lib/domain/housing-types';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import { HousingCard } from '@/components/housing-card';
import { useTranslation } from '@/lib/i18n/language-context';
import { PlatformDisclaimer } from '@/components/platform-disclaimer';

const HousingMap = dynamic(() => import('@/components/housing-map').then((mod) => mod.HousingMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/70 text-xs font-semibold text-slate-500">
      Berlin Wohnungs-Karte lädt...
    </div>
  ),
});

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
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'grid' | 'list'>('split');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  const listingCardsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSelectListingFromMap = (id: string | null) => {
    setSelectedListingId(id);
    if (id && listingCardsRef.current[id]) {
      listingCardsRef.current[id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

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
      {/* Editorial Header */}
      <section className="border-b border-slate-200 pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[0.95]">
              {isDe ? (
                <>
                  WOHNUNGEN & WG-ZIMMER.
                  <span className="text-blue-600 block mt-1">IN BERLIN.</span>
                </>
              ) : (
                <>
                  APARTMENTS & WG ROOMS.
                  <span className="text-blue-600 block mt-1">IN BERLIN.</span>
                </>
              )}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 max-w-xl sm:text-base">
              {isDe
                ? 'Direkter Marktplatz von Nutzer zu Nutzer mit Angaben zur Anmeldung und Warmmiete.'
                : 'Direct marketplace from user to user with Anmeldung details and warm rent breakdowns.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/wohnen/list"
              className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
            >
              + {isDe ? 'Wohnung inserieren' : 'Post a room'}
            </Link>
          </div>
        </div>

        {/* High-Utility Search & Filter Bar */}
        <div className="mt-7 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_130px]">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isDe ? 'Bezirk, Kiez, PLZ oder Stichwort...' : 'Search district, kiez or postcode...'}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            />
          </div>
        </div>

        {/* Filter chips & Presets */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAnmeldung(!onlyAnmeldung)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                onlyAnmeldung
                  ? 'border border-emerald-600 bg-emerald-600 text-white shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <CheckCircle2 className={`size-3.5 ${onlyAnmeldung ? 'text-white' : 'text-emerald-600'}`} />
              <span>{t('housingOnlyAnmeldung')}</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlyFurnished(!onlyFurnished)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                onlyFurnished
                  ? 'border border-blue-600 bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <Home className={`size-3.5 ${onlyFurnished ? 'text-white' : 'text-slate-400'}`} />
              <span>Möbliert</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">Bis:</span>
              {[600, 750, 900, 1100].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setMaxRent(maxRent === price ? '' : price)}
                  className={`rounded-md px-2.5 py-1 text-xs font-mono transition cursor-pointer ${
                    maxRent === price
                      ? 'bg-slate-900 text-white font-bold'
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
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="price_asc">Miete: aufsteigend</option>
              <option value="price_desc">Miete: absteigend</option>
              <option value="sqm_desc">Größe: absteigend</option>
            </select>

            <div className="flex items-center rounded-lg border border-slate-300 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Split-Ansicht (Liste + Karte)"
              >
                <Layers className="size-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Nur Karte"
              >
                <MapIcon className="size-3.5" />
                <span className="hidden sm:inline">Karte</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Raster-Ansicht"
              >
                <LayoutGrid className="size-3.5" />
                <span className="hidden sm:inline">Raster</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Listen-Ansicht"
              >
                <List className="size-3.5" />
                <span className="hidden sm:inline">Liste</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          <strong className="font-bold text-slate-900">{filteredListings.length}</strong>{' '}
          {isDe ? 'Wohnungen & WG-Zimmer in Berlin' : 'listings in Berlin'}
        </p>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            OpenStreetMap aktiv
          </span>
          <span className="text-[11px] text-slate-400">
            Geprüft nach BGB § 551 (max. 3 Kaltmieten Kaution)
          </span>
        </div>
      </div>

      {/* Listings & Map Section */}
      <div className="mt-4">
        {viewMode === 'map' ? (
          /* Full Map View */
          <div className="h-[740px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <HousingMap
              listings={filteredListings}
              selectedListingId={selectedListingId}
              hoveredListingId={hoveredListingId}
              onSelectListing={handleSelectListingFromMap}
              className="h-full w-full"
            />
          </div>
        ) : viewMode === 'split' ? (
          /* Split View (Cards on left + Sticky Map on right) */
          <div className="grid gap-6 lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_600px]">
            {/* Cards List */}
            <div className="space-y-4">
              {filteredListings.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
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
                filteredListings.map((listing) => {
                  const isSelected = selectedListingId === listing.id;
                  const isHovered = hoveredListingId === listing.id;

                  return (
                    <div
                      key={listing.id}
                      ref={(el) => {
                        listingCardsRef.current[listing.id] = el;
                      }}
                      onMouseEnter={() => setHoveredListingId(listing.id)}
                      onMouseLeave={() => setHoveredListingId(null)}
                      onClick={() => setSelectedListingId(listing.id)}
                    >
                      <HousingCard
                        listing={listing}
                        isSelected={isSelected}
                        isHovered={isHovered}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Sticky Interactive Map Column */}
            <div className="hidden lg:block">
              <div className="sticky top-20 h-[calc(100vh-110px)] min-h-[520px]">
                <HousingMap
                  listings={filteredListings}
                  selectedListingId={selectedListingId}
                  hoveredListingId={hoveredListingId}
                  onSelectListing={handleSelectListingFromMap}
                  className="h-full w-full rounded-2xl border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        ) : (
          /* List View */
          <div className="mx-auto max-w-4xl space-y-3">
            {filteredListings.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
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
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-12">
        <PlatformDisclaimer type="housing" />
      </div>
    </div>
  );
}
