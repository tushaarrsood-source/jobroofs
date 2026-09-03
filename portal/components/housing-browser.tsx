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
  Sparkles,
  Lock,
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
  }, [initialListings, query, selectedType, selectedDistrict, onlyAnmeldung, onlyFurnished, maxRent]);

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
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
      {/* Hero Banner with European Authority & Trust Blue */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-12 text-white shadow-xl md:px-12 md:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          {/* Trust Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
            <ShieldCheck className="size-3.5 text-blue-400" />
            <span>Geprüfter Berliner Wohnungsmarkt · Ohne Maklerprovision</span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
            Wohnungen & WG-Zimmer in Berlin
          </h1>
          
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg max-w-2xl">
            {isDe
              ? 'Finde verifizierte Wohnungen, WG-Zimmer und Zwischenmieten mit garantierter Anmeldung. Keine Vorkasse-Abzocke, keine Fake-Profile, 100% Direktkontakt.'
              : 'Find verified apartments, flatshare rooms, and sublets with guaranteed Anmeldung. Protected against wire transfer scams, zero broker fees.'}
          </p>

          {/* 4 Pillars of Trust */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">✓</span>
              <span className="text-xs font-medium text-slate-200">Mit Anmeldung</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0">✓</span>
              <span className="text-xs font-medium text-slate-200">0 € Maklergebühr</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">✓</span>
              <span className="text-xs font-medium text-slate-200">BGB § 551 Kaution</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold shrink-0">✓</span>
              <span className="text-xs font-medium text-slate-200">Direktkontakt</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/wohnen/list"
              className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-lg"
            >
              {t('housingPostButton')} <ArrowUpRight className="ml-1.5 size-4" />
            </Link>

            <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-slate-300">
              {isDe ? '29 € für 30 Tage Laufzeit · Schützt vor Spam & Betrug' : '€29 for 30 days · Protects against spam & scams'}
            </span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-blue-600/20 blur-3xl" />
      </section>

      {/* Modern Search & Filter Console */}
      <section className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_120px]">
          {/* Search text */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isDe ? 'Bezirk, Kiez, PLZ oder Stichwort...' : 'District, kiez, postcode or keyword...'}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-3 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
            />
          </div>

          {/* Housing Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
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
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
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
              placeholder="Max € warm"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition"
            />
          </div>
        </div>

        {/* Secondary quick filter chips */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Anmeldung Toggle */}
            <button
              type="button"
              onClick={() => setOnlyAnmeldung(!onlyAnmeldung)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                onlyAnmeldung
                  ? 'border border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className={`size-3.5 ${onlyAnmeldung ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{t('housingOnlyAnmeldung')}</span>
            </button>

            {/* Furnished Toggle */}
            <button
              type="button"
              onClick={() => setOnlyFurnished(!onlyFurnished)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                onlyFurnished
                  ? 'border border-blue-500 bg-blue-50 text-blue-800 shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <Home className="size-3.5 text-slate-400" />
              <span>Nur Möbliert</span>
            </button>

            {/* Quick Price Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-2">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Bis:</span>
              {[600, 850, 1100].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setMaxRent(maxRent === price ? '' : price)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    maxRent === price
                      ? 'bg-blue-600 text-white'
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
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="size-3" />
                <span>{isDe ? 'Filter löschen' : 'Reset filters'}</span>
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          <span className="font-bold text-slate-950">{filteredListings.length}</span>{' '}
          {isDe ? 'Wohnungs- & WG-Angebote gefunden' : 'apartments & rooms found'}
        </p>

        <Link
          href="/wohnen/list"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span>{isDe ? '+ Eigenes Inserat aufgeben (29 €)' : '+ List your place (€29)'}</span>
          <ArrowUpRight className="size-3" />
        </Link>
      </div>

      {/* Listings Grid */}
      <div
        className={`mt-6 ${
          viewMode === 'grid'
            ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            : 'mx-auto max-w-4xl space-y-4'
        }`}
      >
        {filteredListings.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <Home className="mx-auto size-10 text-slate-300" />
            <h3 className="mt-4 text-base font-bold text-slate-900">
              {isDe ? 'Keine Angebote für diese Filter gefunden' : 'No listings found'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              {isDe
                ? 'Versuche, deine Filter anzupassen oder das maximale Budget zu erhöhen.'
                : 'Try adjusting your filters or expanding your budget.'}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              {isDe ? 'Alle Filter zurücksetzen' : 'Reset all filters'}
            </button>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <HousingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      {/* Safety Notice Banner */}
      <div className="mt-14">
        <PlatformDisclaimer type="housing" />
      </div>
    </div>
  );
}
