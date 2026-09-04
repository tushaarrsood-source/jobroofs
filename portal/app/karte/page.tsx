import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { KiezMapPage } from '@/components/kiez-map-page';
import { getHomepageFeeds, getJobNiches, getJobSourceInfo } from '@/lib/jobs/feeds';
import { previewJobs } from '@/lib/domain/preview-data';
import { previewHousingListings } from '@/lib/domain/preview-housing';
import type { HousingListing } from '@/lib/domain/housing-types';
import { getD1 } from '@/db';

export const metadata: Metadata = {
  title: 'Kiez-Karte Berlin — Jobs & Wohnen auf einen Blick',
  description: 'Finde Jobs mit Stundenlohn und Wohnungen mit Warmmiete direkt auf der interaktiven Berlin-Karte.',
  alternates: {
    canonical: '/karte',
  },
  openGraph: {
    title: 'Kiez-Karte Berlin · JOBROOFS',
    description: 'Interaktive Karte mit Jobs und Wohnungen in Berlin — transparente Gehälter und Warmmieten.',
    url: '/karte',
  },
};

export default async function MapRoutePage() {
  // 1. Fetch & enrich jobs
  const feeds = await getHomepageFeeds();
  const jobMap = new Map();
  previewJobs.forEach((j) => jobMap.set(j.slug || j.id, { ...j, isDemo: false }));

  if (feeds.direct.length > 0 || feeds.latest.length > 0) {
    feeds.direct.forEach((j) => jobMap.set(j.id, j));
    feeds.latest.forEach((j) => jobMap.set(j.id, j));
  }

  const enrich = async (jobs: any[]) => {
    return Promise.all(
      jobs.map(async (job) => {
        if (job.slug && previewJobs.some((p) => p.slug === job.slug)) {
          return job;
        }
        const niches = await getJobNiches(job.id);
        const sourceInfo = await getJobSourceInfo(job.id);
        return {
          ...job,
          slug: job.slug || job.id,
          niches,
          sourceInfo,
          isDemo: false,
        };
      }),
    );
  };

  const allJobs = await enrich(Array.from(jobMap.values()));

  // 2. Fetch Housing listings
  let dbListings: HousingListing[] = [];
  try {
    const d1 = getD1();
    const rows = await d1
      .prepare(
        `SELECT * FROM housing_listings WHERE publication_state = 'published' ORDER BY created_at DESC LIMIT 50`,
      )
      .all<any>();

    if (rows && rows.results) {
      dbListings = rows.results.map((r) => ({
        id: r.id,
        title: r.title,
        listingType: r.listing_type,
        district: r.district,
        postcode: r.postcode,
        neighborhood: r.neighborhood,
        streetAddress: r.street_address,
        latitude: r.latitude ? Number(r.latitude) : null,
        longitude: r.longitude ? Number(r.longitude) : null,
        kaltmieteEur: r.kaltmiete_eur,
        nebenkostenEur: r.nebenkosten_eur,
        warmmieteEur: r.warmmiete_eur,
        kautionEur: r.kaution_eur,
        roomSqm: r.room_sqm,
        totalRooms: r.total_rooms,
        floorLevel: r.floor_level,
        furnished: r.furnished,
        anmeldungPossible: Boolean(r.anmeldung_possible),
        subletAuthorized: Boolean(r.sublet_authorized),
        contractType: r.contract_type,
        moveInDate: r.move_in_date,
        moveOutDate: r.move_out_date,
        minStayMonths: r.min_stay_months,
        energyClass: r.energy_class,
        heatingSource: r.heating_source,
        buildingYear: r.building_year,
        images: r.images_json ? JSON.parse(r.images_json) : [],
        description: r.description,
        contactMethod: r.contact_method,
        contactEmail: r.contact_email,
        contactName: r.contact_name,
        contactPhone: r.contact_phone,
        publicationState: r.publication_state,
        firstSeenAt: r.first_seen_at,
        expiresAt: r.expires_at,
        isDemo: false,
      }));
    }
  } catch {}

  const allHousing = [...dbListings, ...previewHousingListings];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <SiteHeader />
        <KiezMapPage initialJobs={allJobs} initialHousing={allHousing} />
      </div>
      <SiteFooter />
    </main>
  );
}
