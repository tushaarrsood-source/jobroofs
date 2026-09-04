'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Home, MapPin, Navigation, RotateCcw, X } from 'lucide-react';
import { BERLIN_CENTER, getHousingGoogleMapsUrl, resolveHousingCoordinates } from '@/lib/domain/berlin-geo';
import { housingTypeLabels } from '@/lib/domain/housing-types';
import type { HousingListing } from '@/lib/domain/housing-types';

interface HousingMapProps {
  listings: HousingListing[];
  selectedListingId?: string | null;
  hoveredListingId?: string | null;
  onSelectListing?: (listingId: string | null) => void;
  className?: string;
  showCardOverlay?: boolean;
  miniMode?: boolean;
  centerSingleListing?: boolean;
}

export function HousingMap({
  listings,
  selectedListingId,
  hoveredListingId,
  onSelectListing,
  className = '',
  showCardOverlay = true,
  miniMode = false,
  centerSingleListing = true,
}: HousingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [activeListing, setActiveListing] = useState<HousingListing | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        // Prevent Leaflet error "Map container is already initialized"
        if ((mapContainerRef.current as any)._leaflet_id) {
          delete (mapContainerRef.current as any)._leaflet_id;
        }

        // Dynamic import leaflet on client only
        const L = (await import('leaflet')).default;

        if (!isMounted || !mapContainerRef.current) return;

        // Fix leaflet default icon asset paths
        try {
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
        } catch {}

        // Create map centered on Berlin
        const map = L.map(mapContainerRef.current, {
          center: [BERLIN_CENTER.lat, BERLIN_CENTER.lng],
          zoom: miniMode ? 13 : 12,
          minZoom: 9,
          maxZoom: 18,
          zoomControl: !miniMode,
        });

        // OpenStreetMap tiles (100% free, zero watermark) with optional CARTO key support
        const cartoKey = process.env.NEXT_PUBLIC_CARTO_KEY;
        const tileUrl = cartoKey
          ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoKey}`
          : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

        L.tileLayer(tileUrl, {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        if (!miniMode) {
          L.control.zoom({ position: 'topright' }).addTo(map);
        }

        mapInstanceRef.current = map;
        setIsMapReady(true);
      } catch (err) {
        console.warn('Leaflet housing map init notice:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, [miniMode]);

  // Update Markers whenever listings or selection change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    let isMounted = true;

    async function updateMarkers() {
      try {
        const L = (await import('leaflet')).default;
        if (!isMounted || !mapInstanceRef.current) return;

        const map = mapInstanceRef.current;
        const currentMarkers = markersRef.current;

        // Remove existing markers
        currentMarkers.forEach((marker) => {
          try {
            marker.remove();
          } catch {}
        });
        currentMarkers.clear();

        if (!listings || listings.length === 0) return;

        const bounds = L.latLngBounds([]);

        listings.forEach((listing) => {
          try {
            const coords = resolveHousingCoordinates(listing);
            const isSelected = selectedListingId === listing.id;
            const isHovered = hoveredListingId === listing.id;
            const isActive = isSelected || isHovered;

            const iconHtml = `
              <div class="kiez-map-pin ${isActive ? 'active' : ''}">
                <div class="pin-badge">
                  <span class="pin-rate">${coords.badgeLabel}</span>
                </div>
                <div class="pin-stem"></div>
              </div>
            `;

            const customIcon = L.divIcon({
              className: 'kiez-pin-container',
              html: iconHtml,
              iconSize: [64, 38],
              iconAnchor: [32, 36],
              popupAnchor: [0, -34],
            });

            const marker = L.marker([coords.lat, coords.lng], {
              icon: customIcon,
              zIndexOffset: isActive ? 1000 : 100,
            }).addTo(map);

            marker.on('click', () => {
              setActiveListing(listing);
              if (onSelectListing) onSelectListing(listing.id);
              map.panTo([coords.lat, coords.lng], { animate: true, duration: 0.5 });
            });

            currentMarkers.set(listing.id, marker);
            bounds.extend([coords.lat, coords.lng]);
          } catch {}
        });

        // If exactly 1 listing, pan to it
        if (listings.length === 1 && centerSingleListing) {
          const singleCoords = resolveHousingCoordinates(listings[0]);
          map.setView([singleCoords.lat, singleCoords.lng], miniMode ? 14 : 14, { animate: true });
          return;
        }

        // If a specific listing is selected, pan to it
        if (selectedListingId) {
          const target = listings.find((l) => l.id === selectedListingId);
          if (target) {
            const coords = resolveHousingCoordinates(target);
            map.panTo([coords.lat, coords.lng], { animate: true, duration: 0.5 });
            setActiveListing(target);
          }
        }

        // Fit to all markers for multi-listing view
        if (bounds.isValid() && listings.length > 1 && !miniMode) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
      } catch (err) {
        console.warn('Leaflet updateMarkers housing notice:', err);
      }
    }

    updateMarkers();

    return () => {
      isMounted = false;
    };
  }, [listings, isMapReady, selectedListingId, hoveredListingId, miniMode, centerSingleListing, onSelectListing]);

  // Sync active listing when external selection changes
  useEffect(() => {
    if (selectedListingId) {
      const found = listings.find((l) => l.id === selectedListingId);
      if (found) setActiveListing(found);
    }
  }, [selectedListingId, listings]);

  const resetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([BERLIN_CENTER.lat, BERLIN_CENTER.lng], 12, { animate: true });
    setActiveListing(null);
    if (onSelectListing) onSelectListing(null);
  };

  return (
    <div className={`relative h-full w-full overflow-hidden bg-slate-100 ${className}`}>
      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Map Controls Header */}
      {!miniMode && (
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
          <button
            type="button"
            onClick={resetView}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-xs transition hover:border-slate-300 hover:text-slate-900 cursor-pointer"
            title="Reset Berlin Map"
          >
            <RotateCcw className="size-3 text-slate-500" />
            <span>Berlin</span>
          </button>
          <span className="rounded-lg border border-slate-200/80 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-xs">
            {listings.length} {listings.length === 1 ? 'Wohnung' : 'Wohnungen'}
          </span>
        </div>
      )}

      {/* Floating Listing Detail Overlay Card */}
      {showCardOverlay && activeListing && !miniMode && (
        <div className="absolute right-4 bottom-4 left-4 z-[400] max-w-sm sm:left-auto">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 backdrop-blur-sm transition animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setActiveListing(null);
                if (onSelectListing) onSelectListing(null);
              }}
              className="absolute top-3 right-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Thumbnail Image */}
            {activeListing.images?.[0] && (
              <div className="mb-3 h-28 w-full overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={activeListing.images[0]}
                  alt={activeListing.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex items-start justify-between gap-2 pr-6">
              <div>
                <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-blue-700 border border-blue-200">
                  {housingTypeLabels[activeListing.listingType]?.de || activeListing.listingType}
                </span>
                <h4 className="mt-1.5 text-sm font-bold text-slate-900 line-clamp-1">
                  {activeListing.title}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-black font-mono text-slate-900">
                  {activeListing.warmmieteEur} €
                </span>
                <span className="block text-[10px] text-slate-500">warm / M.</span>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                <MapPin className="size-3 text-blue-600" />
                {activeListing.district}
                {activeListing.neighborhood ? ` · ${activeListing.neighborhood}` : ''}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-700">{activeListing.roomSqm} m²</span>
              {activeListing.anmeldungPossible && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold text-[11px]">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    Anmeldung
                  </span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-3.5 flex items-center gap-2 border-t border-slate-100 pt-3">
              <Link
                href={`/wohnen/${activeListing.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                <span>Details ansehen</span>
                <ArrowRight className="size-3" />
              </Link>
              <a
                href={getHousingGoogleMapsUrl(activeListing)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:border-slate-300 hover:text-slate-900 transition"
                title="In Google Maps öffnen"
              >
                <Navigation className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
