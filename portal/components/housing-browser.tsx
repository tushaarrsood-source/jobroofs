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
      {/* Editorial Header - Apple Minimalist (Single primary action lives in site header) */}
      <section className="border-b border-black/[0.06] pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
            {isDe ? 'Wohnungen & WG-Zimmer in Berlin' : 'Apartments & WG Rooms in Berlin'}
          </h1>
          <p className="mt-0.5 text-xs text-[#86868b]">
            {isDe
              ? 'Direktkontakt mit Warmmiete, Kaution nach BGB und verbindlicher Angabe zur Anmeldung.'
              : 'Direct contact with warm rent, legal deposit limits, and verified Anmeldung status.'}
          </p>
        </div>

        {/* Apple Spotlight Search & Controls Bar */}
        <div className="mt-3 rounded-[20px] border border-black/[0.06] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center">
            {/* Search input + Mobile single toggle icon */}
            <div className="flex items-center gap-1.5 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#86868b]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isDe ? 'Bezirk, Kiez, PLZ oder Stichwort...' : 'Search district, kiez or postcode...'}
                  className="h-9 w-full rounded-xl bg-black/[0.03] pr-8 pl-9 text-xs text-[#1d1d1f] placeholder:text-[#86868b] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/[0.12] transition-all"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdowns: 2-column grid on mobile */}
            <div className="grid grid-cols-2 gap-1.5 w-full md:flex md:w-auto">
              {/* Type dropdown */}
              <div className="w-full md:w-44">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3 text-xs text-[#1d1d1f] font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/[0.12] transition-all"
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
                  className="h-9 w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-3 text-xs text-[#1d1d1f] font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/[0.12] transition-all"
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
          </div>

          {/* Quick Filter Chips (Apple Pills) */}
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pt-1.5 pb-0.5 text-[12px] scrollbar-none border-t border-black/[0.04]">
            <button
              type="button"
              onClick={clearFilters}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                !hasActiveFilters
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              {isDe ? 'Alle' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedType(selectedType === 'wg_room' ? 'all' : 'wg_room')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedType === 'wg_room'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              WG-Zimmer
            </button>
            <button
              type="button"
              onClick={() => setSelectedType(selectedType === 'entire_apartment' ? 'all' : 'entire_apartment')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedType === 'entire_apartment'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              1-Zimmer / Wohnung
            </button>
            <button
              type="button"
              onClick={() => setSelectedType(selectedType === 'sublet' ? 'all' : 'sublet')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedType === 'sublet'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              Zwischenmiete
            </button>
            <button
              type="button"
              onClick={() => setOnlyAnmeldung(!onlyAnmeldung)}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1 active:scale-[0.97] ${
                onlyAnmeldung
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              <CheckCircle2 className="size-3" />
              <span>Anmeldung ✓</span>
            </button>
            <button
              type="button"
              onClick={() => setMaxRent(maxRent === 600 ? null : 600)}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                maxRent === 600
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              &lt; 600 € warm
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Kreuzberg' ? 'all' : 'Kreuzberg')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedDistrict === 'Kreuzberg'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              Kreuzberg
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Neukölln' ? 'all' : 'Neukölln')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedDistrict === 'Neukölln'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              Neukölln
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Mitte' ? 'all' : 'Mitte')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedDistrict === 'Mitte'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              Mitte
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Friedrichshain' ? 'all' : 'Friedrichshain')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedDistrict === 'Friedrichshain'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              Friedrichshain
            </button>
            <button
              type="button"
              onClick={() => setSelectedDistrict(selectedDistrict === 'Prenzlauer Berg' ? 'all' : 'Prenzlauer Berg')}
              className={`rounded-full px-3 py-1 font-medium transition cursor-pointer whitespace-nowrap active:scale-[0.97] ${
                selectedDistrict === 'Prenzlauer Berg'
                  ? 'bg-[#1d1d1f] text-white shadow-2xs'
                  : 'bg-black/[0.04] text-[#86868b] hover:bg-black/[0.08] hover:text-[#1d1d1f]'
              }`}
            >
              Prenzl. Berg
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-[12px] text-[#0071e3] hover:underline font-medium cursor-pointer whitespace-nowrap active:scale-[0.97]"
              >
                ✕ {isDe ? 'Zurücksetzen' : 'Reset'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#86868b]">
        <p>
          <strong className="font-semibold text-[#1d1d1f]">{filteredListings.length}</strong>{' '}
          {isDe ? 'Wohnungen & WG-Zimmer in Berlin' : 'listings in Berlin'}
        </p>

        <div className="hidden md:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-0.5 text-xs font-medium text-[#1d1d1f]">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live Kiez-Karte
          </span>
          <span className="hidden sm:inline text-[11px] text-[#86868b]">
            Geprüft nach BGB § 551 (max. 3 Kaltmieten Kaution)
          </span>
        </div>
      </div>

      {/* Listings & Map Section (Split List + Sticky Map on Desktop) */}
      <div className="mt-4">
        {/* Split View (Cards on left + Sticky Map on right) */}
        <div className="grid gap-6 lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_600px]">
          {/* Cards List */}
          <div className="space-y-4">
            {filteredListings.length === 0 ? (
              <div className="rounded-[20px] border border-black/[0.06] bg-white p-10 md:p-14 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <Home className="mx-auto size-8 text-[#86868b]" />
                <h3 className="mt-3 text-base md:text-lg font-semibold text-[#1d1d1f]">
                  {hasActiveFilters
                    ? isDe
                      ? 'Keine Inserate für deine Filtereinstellungen gefunden'
                      : 'No listings found for your filters'
                    : isDe
                    ? 'Noch keine Wohnungsangebote aktiv'
                    : 'No active housing listings yet'}
                </h3>
                <p className="mt-1.5 text-xs text-[#86868b] max-w-sm mx-auto leading-relaxed">
                  {hasActiveFilters
                    ? isDe
                      ? 'Versuche, den maximalen Mietpreis zu erhöhen oder die Bezirksauswahl zu erweitern.'
                      : 'Try increasing the maximum rent or expanding your district selection.'
                    : isDe
                    ? 'Sei der Erste und inseriere jetzt dein WG-Zimmer, deine Zwischenmiete oder Wohnung in Berlin!'
                    : 'Be the first to list your WG room, sublet or apartment in Berlin!'}
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="apple-btn-secondary !h-9 !px-4 !text-xs cursor-pointer"
                    >
                      {isDe ? 'Filter zurücksetzen' : 'Reset filters'}
                    </button>
                  ) : (
                    <Link
                      href="/wohnen/list"
                      className="apple-btn-primary !h-9 !px-4 !text-xs inline-flex"
                    >
                      <span>+ {isDe ? 'Wohnung inserieren' : 'List Housing'}</span>
                    </Link>
                  )}
                </div>
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
                className="h-full w-full rounded-[20px] border border-black/[0.06] shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
