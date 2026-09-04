'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from '@/components/ui/link';
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
import { isListingExpired } from '@/lib/domain/entitlements';

const HousingMap = dynamic(() => import('@/components/housing-map').then((mod) => mod.HousingMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100/70 text-xs font-semibold text-slate-500">
      Berlin Wohnungs-Karte lädt...
    </div>
  ),
});

interface HousingBrowserProps {
  initialListings: HousingListing[];
}

export function HousingBrowser({ initialListings }: HousingBrowserProps) {
  const { t, isDe } = useTranslation();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [onlyAnmeldung, setOnlyAnmeldung] = useState(false);
  const [maxRent, setMaxRent] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'grid' | 'list'>('split');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const listingCardsRef = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkView = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'map') {
        setViewMode('map');
      } else if (v === 'list') {
        setViewMode('list');
      } else if (v === 'grid') {
        setViewMode('grid');
      }
    };
    checkView();
    window.addEventListener('popstate', checkView);
    return () => window.removeEventListener('popstate', checkView);
  }, []);

  const handleSelectListingFromMap = (id: string | null) => {
    setSelectedListingId(id);
    if (id && listingCardsRef.current[id]) {
      listingCardsRef.current[id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  // Filter listings & sort premium on top
  const filteredListings = useMemo(() => {
    return initialListings
      .filter((item) => {
        // Expiration check: postings remain for max 30d (standard) or 60d (premium)
        if (item.expiresAt && isListingExpired(item.expiresAt)) {
          return false;
        }

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

        // Anmeldung filter
        if (onlyAnmeldung && !item.anmeldungPossible) {
          return false;
        }

        // Max rent filter
        if (maxRent !== null && item.warmmieteEur > maxRent) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Premium listings prioritized at the top
        if (a.tier === 'premium' && b.tier !== 'premium') return -1;
        if (b.tier === 'premium' && a.tier !== 'premium') return 1;
        return 0;
      });
  }, [initialListings, query, selectedType, selectedDistrict, onlyAnmeldung, maxRent]);

  const hasActiveFilters =
    query !== '' ||
    selectedType !== 'all' ||
    selectedDistrict !== 'all' ||
    onlyAnmeldung ||
    maxRent !== null;

  const clearFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedDistrict('all');
    setOnlyAnmeldung(false);
    setMaxRent(null);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-3 sm:px-4 md:px-6 pt-3 pb-3 md:pt-4 md:pb-4">
      {/* Editorial Header - Compact & Clean */}
      <section className="border-b border-slate-200 pb-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
              {isDe ? 'Wohnungen & WG-Zimmer in Berlin' : 'Apartments & WG Rooms in Berlin'}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {isDe
                ? 'Direktkontakt mit Warmmiete, Kaution nach BGB und verbindlicher Angabe zur Anmeldung.'
                : 'Direct contact with warm rent, legal deposit limits, and verified Anmeldung status.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/wohnen/list"
              className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-3.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
            >
              + {isDe ? 'Inserieren (ab 29 €)' : 'Post a room (from €29)'}
            </Link>
          </div>
        </div>

        {/* High-Utility Compact Search & Controls Bar */}
        <div className="mt-2.5 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center">
            {/* Search input + Mobile single toggle icon */}
            <div className="flex items-center gap-1.5 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isDe ? 'Bezirk, Kiez, PLZ oder Stichwort...' : 'Search district, kiez or postcode...'}
                  className="h-8.5 w-full rounded-md border border-slate-200 bg-slate-50/70 pr-8 pl-8.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Single icon on mobile to toggle view mode (saves space) */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'map' ? 'split' : 'map')}
                aria-label={viewMode === 'map' ? 'Zur Liste wechseln' : 'Zur Karte wechseln'}
                className="md:hidden flex size-8.5 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 shadow-2xs transition active:scale-95 cursor-pointer hover:bg-slate-100"
                title={viewMode === 'map' ? 'Liste' : 'Karte'}
              >
                {viewMode === 'map' ? (
                  <List className="size-4 text-blue-600" />
                ) : (
                  <MapIcon className="size-4 text-blue-600" />
                )}
              </button>
            </div>

            {/* Filter Dropdowns: 2-column grid on mobile */}
            <div className="grid grid-cols-2 gap-1.5 w-full md:flex md:w-auto">
              {/* Type dropdown */}
              <div className="w-full md:w-44">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-8.5 w-full rounded-md border border-slate-200 bg-slate-50/70 px-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
              <div className="w-full md:w-44">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="h-8.5 w-full rounded-md border border-slate-200 bg-slate-50/70 px-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="all">{isDe ? 'Alle Bezirke' : 'All districts'}</option>
                  <option value="Mitte">Mitte</option>
                  <option value="Friedrichshain">Friedrichshain</option>
                  <option value="Kreuzberg">Kreuzberg</option>
                  <option value="Neukölln">Neukölln</option>
                  <option value="Prenzlauer Berg">Prenzlauer Berg</option>
                  <option value="Charlottenburg">Charlottenburg</option>
                  <option value="Schöneberg">Schöneberg</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Moabit">Moabit</option>
                  <option value="Pankow">Pankow</option>
                  <option value="Lichtenberg">Lichtenberg</option>
                  <option value="Treptow">Treptow</option>
                  <option value="Tempelhof">Tempelhof</option>
                  <option value="Steglitz">Steglitz</option>
                </select>
              </div>
            </div>

            {/* View Switcher: Desktop only */}
            <div className="hidden md:flex items-center justify-center gap-0.5 rounded-md border border-slate-200 bg-slate-100/90 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Geteilte Ansicht"
              >
                <Layers className="size-3" />
                <span>Split</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Karten-Ansicht"
              >
                <MapIcon className="size-3" />
                <span>Karte</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center gap-1 rounded px-2 py-1 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Raster-Ansicht"
              >
                <LayoutGrid className="size-3" />
                <span>Raster</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-[11px] scrollbar-none border-t border-slate-100">
            <button
              type="button"
              onClick={clearFilters}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                !hasActiveFilters
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isDe ? 'Alle' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedType(selectedType === 'wg_room' ? 'all' : 'wg_room')}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                selectedType === 'wg_room'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              WG-Zimmer
            </button>
            <button
              type="button"
              onClick={() => setSelectedType(selectedType === 'entire_apartment' ? 'all' : 'entire_apartment')}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                selectedType === 'entire_apartment'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              1-Zimmer / Wohnung
            </button>
            <button
              type="button"
              onClick={() => setSelectedType(selectedType === 'sublet' ? 'all' : 'sublet')}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                selectedType === 'sublet'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Zwischenmiete
            </button>
            <button
              type="button"
              onClick={() => setOnlyAnmeldung(!onlyAnmeldung)}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                onlyAnmeldung
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="size-2.5" />
              <span>Anmeldung ✓</span>
            </button>
            <button
              type="button"
              onClick={() => setMaxRent(maxRent === 600 ? null : 600)}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                maxRent === 600
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              &lt; 600 € warm
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Kreuzberg' ? 'all' : 'Kreuzberg')}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                selectedDistrict === 'Kreuzberg'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Kreuzberg
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Neukölln' ? 'all' : 'Neukölln')}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                selectedDistrict === 'Neukölln'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Neukölln
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Mitte' ? 'all' : 'Mitte')}
              className={`pill-tactile rounded-full px-2.5 py-0.5 font-medium transition cursor-pointer whitespace-nowrap ${
                selectedDistrict === 'Mitte'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Mitte
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="pill-tactile ml-auto text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer whitespace-nowrap"
              >
                ✕ {isDe ? 'Zurücksetzen' : 'Reset'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <p>
          <strong className="font-bold text-slate-900">{filteredListings.length}</strong>{' '}
          {isDe ? 'Wohnungen & WG-Zimmer in Berlin' : 'listings in Berlin'}
        </p>

        <div className="hidden md:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Live Kiez-Karte
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-400">
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
                filteredListings.map((listing, idx) => {
                  const isSelected = selectedListingId === listing.id;
                  const isHovered = hoveredListingId === listing.id;

                  return (
                    <div
                      key={listing.id}
                      ref={(el) => {
                        listingCardsRef.current[listing.id] = el;
                      }}
                      className="stagger-in"
                      style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
                      onMouseEnter={() => setHoveredListingId(listing.id)}
                      onMouseLeave={() => setHoveredListingId(null)}
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
              filteredListings.map((listing, idx) => (
                <div
                  key={listing.id}
                  className="stagger-in"
                  style={{ animationDelay: `${Math.min(idx * 35, 300)}ms` }}
                >
                  <HousingCard listing={listing} />
                </div>
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
