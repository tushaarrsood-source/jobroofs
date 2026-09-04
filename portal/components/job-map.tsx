'use client';

import { useEffect, useRef, useState } from 'react';
import Link from '@/components/ui/link';
import { ArrowRight, BriefcaseBusiness, Euro, MapPin, Navigation, RotateCcw, X } from 'lucide-react';
import { BERLIN_CENTER, getGoogleMapsUrl, resolveJobCoordinates } from '@/lib/domain/berlin-geo';
import { getIndustry } from '@/lib/domain/taxonomy';

interface JobMapProps {
  jobs: any[];
  selectedJobId?: string | null;
  hoveredJobId?: string | null;
  onSelectJob?: (jobId: string | null) => void;
  className?: string;
  showCardOverlay?: boolean;
  miniMode?: boolean;
  centerSingleJob?: boolean;
}

export function JobMap({
  jobs,
  selectedJobId,
  hoveredJobId,
  onSelectJob,
  className = '',
  showCardOverlay = true,
  miniMode = false,
  centerSingleJob = true,
}: JobMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [activeJob, setActiveJob] = useState<any | null>(null);
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
        console.warn('Leaflet map init notice:', err);
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

  // Update Markers whenever jobs or coordinates change
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
          try { marker.remove(); } catch {}
        });
        currentMarkers.clear();

        if (!jobs || jobs.length === 0) return;

        const bounds = L.latLngBounds([]);

        jobs.forEach((job) => {
          try {
            const coords = resolveJobCoordinates(job);
            const isSelected = selectedJobId === job.id || selectedJobId === job.slug;
            const isHovered = hoveredJobId === job.id || hoveredJobId === job.slug;
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
              iconSize: [60, 36],
              iconAnchor: [30, 34],
              popupAnchor: [0, -32],
            });

            const marker = L.marker([coords.lat, coords.lng], {
              icon: customIcon,
              zIndexOffset: isActive ? 1000 : 100,
            }).addTo(map);

            marker.on('click', () => {
              setActiveJob(job);
              if (onSelectJob) onSelectJob(job.id);
              map.panTo([coords.lat, coords.lng], { animate: true, duration: 0.5 });
            });

            currentMarkers.set(job.id, marker);
            bounds.extend([coords.lat, coords.lng]);
          } catch {}
        });

        // If exactly 1 job, pan to it
        if (jobs.length === 1 && centerSingleJob) {
          const singleCoords = resolveJobCoordinates(jobs[0]);
          map.setView([singleCoords.lat, singleCoords.lng], miniMode ? 14 : 14, { animate: true });
          return;
        }

        // If a specific job is selected, pan to it
        if (selectedJobId) {
          const target = jobs.find((j) => j.id === selectedJobId || j.slug === selectedJobId);
          if (target) {
            const coords = resolveJobCoordinates(target);
            map.panTo([coords.lat, coords.lng], { animate: true, duration: 0.5 });
            setActiveJob(target);
          }
        }

        // Fit to all markers for multi-job view
        if (bounds.isValid() && jobs.length > 1 && !miniMode) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
      } catch (err) {
        console.warn('Leaflet updateMarkers notice:', err);
      }
    }

    updateMarkers();

    return () => {
      isMounted = false;
    };
  }, [jobs, isMapReady, selectedJobId, hoveredJobId, miniMode, centerSingleJob, onSelectJob]);

  // Reset to Berlin Overview
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([BERLIN_CENTER.lat, BERLIN_CENTER.lng], 12, { animate: true });
    setActiveJob(null);
    if (onSelectJob) onSelectJob(null);
  };

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-inner ${className}`}>
      {/* Leaflet Map Target */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Floating Controls */}
      {!miniMode && (
        <div className="absolute top-3 left-3 z-[500] flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetView}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-zinc-900 shadow-xs backdrop-blur transition hover:bg-white cursor-pointer"
            title="Reset map to Berlin overview"
          >
            <RotateCcw className="size-3 text-zinc-500" />
            <span>Berlin Übersicht</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white/95 px-2.5 py-1.5 text-xs text-zinc-600 shadow-xs backdrop-blur">
            <MapPin className="size-3 text-emerald-700" />
            <span>{jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} auf Karte</span>
          </div>
        </div>
      )}

      {miniMode && (
        <div className="absolute bottom-2 left-2 z-[500] rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shadow backdrop-blur">
          OpenStreetMap
        </div>
      )}

      {/* Interactive Job Preview Card Overlay */}
      {showCardOverlay && activeJob && !miniMode && (
        <div className="absolute bottom-4 left-4 right-4 z-[500] sm:left-auto sm:right-4 sm:w-80">
          <div className="relative rounded-xl border border-foreground/15 bg-white p-4 shadow-[0_12px_32px_rgba(24,34,30,0.18)] transition-all">
            <button
              type="button"
              onClick={() => setActiveJob(null)}
              className="absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-foreground/5 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
              aria-label="Close preview"
            >
              <X className="size-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#e8f6ed] px-2 py-0.5 text-xs font-bold text-[#245e3c]">
                {resolveJobCoordinates(activeJob).badgeLabel}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {activeJob.district ? `${activeJob.district}` : 'Berlin'}
              </span>
            </div>

            <h3 className="mt-2 text-sm font-semibold leading-tight line-clamp-2">
              {activeJob.title}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {activeJob.company}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-2.5">
              <a
                href={getGoogleMapsUrl(activeJob)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-blue-600"
                title="Open location in Google Maps"
              >
                <Navigation className="size-3 text-[#ed6a43]" />
                <span>Google Maps ↗</span>
              </a>
              <Link
                href={`/jobs/${activeJob.slug || activeJob.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                <span>View listing</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
