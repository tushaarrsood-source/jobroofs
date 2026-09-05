import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/json-ld';
import { PortalWelcomeBanner } from '@/components/portal-welcome-banner';
import { HousingBrowser } from '@/components/housing-browser';
import { previewHousingListings } from '@/lib/domain/preview-housing';
import type { HousingListing } from '@/lib/domain/housing-types';
import { getD1 } from '@/db';

export const metadata: Metadata = {
  title: 'Wohnen in Berlin — WG-Zimmer, Wohnungen & Zwischenmiete',
  description:
    'Wohnungen, WG-Zimmer und Zwischenmieten in Berlin mit Angaben zur Anmeldung und Warmmiete direkt von Nutzer zu Nutzer.',
  alternates: {
    canonical: '/wohnen',
  },
  openGraph: {
    title: 'Wohnen in Berlin · JOBROOFS',
    description:
      'WG-Zimmer, Zwischenmieten & Wohnungen in Berlin direkt von Nutzer zu Nutzer.',
    url: '/wohnen',
  },
};

export default async function HousingPage() {
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
      }));
    }
  } catch {
    // In local dev without DB binding, curated listings take over
  }

  // Combine DB listings with curated listings, avoiding duplicates
  const listingMap = new Map<string, HousingListing>();
  previewHousingListings.forEach((h) => listingMap.set(h.id, h));
  dbListings.forEach((h) => listingMap.set(h.id, h));
  const allListings = Array.from(listingMap.values());

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Wohnen in Berlin', href: '/wohnen' },
          ]}
        />
        <SiteHeader />
        <PortalWelcomeBanner />
        <HousingBrowser initialListings={allListings} />
      </div>
      <SiteFooter />
    </main>
  );
}
