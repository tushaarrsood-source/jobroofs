import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HousingBrowser } from '@/components/housing-browser';
import { previewHousingListings } from '@/lib/domain/preview-housing';
import type { HousingListing } from '@/lib/domain/housing-types';
import { getD1 } from '@/db';

export const metadata: Metadata = {
  title: 'Wohnen in Berlin — WG-Zimmer, Wohnungen & Zwischenmiete ohne Scams',
  description:
    'Echte Wohnungen, WG-Zimmer und Zwischenmieten in Berlin mit garantierter Anmeldung und transparenten Warmmieten. Geschützt vor Fake-Profilen und Vorauszahlungs-Betrug.',
  alternates: {
    canonical: '/wohnen',
  },
  openGraph: {
    title: 'Wohnen in Berlin · KIEZJOB',
    description:
      'Verifizierte WG-Zimmer, Zwischenmieten & Wohnungen in Berlin. 100% echt mit Anmeldung.',
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
  } catch {
    // In local dev without D1 binding, preview listings take over
  }

  // Combine DB listings with preview listings
  const allListings = [...dbListings, ...previewHousingListings];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <SiteHeader />
        <HousingBrowser initialListings={allListings} />
      </div>
      <SiteFooter />
    </main>
  );
}
