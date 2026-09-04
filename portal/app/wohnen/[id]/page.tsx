import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HousingDetailContent } from '@/components/housing-detail-content';
import { previewHousingListings } from '@/lib/domain/preview-housing';
import type { HousingListing } from '@/lib/domain/housing-types';
import { getD1 } from '@/db';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = previewHousingListings.find((item) => item.id === id);

  if (listing) {
    return {
      title: `${listing.title} (${listing.district}) — ${listing.warmmieteEur} € warm`,
      description: `${listing.title} in ${listing.district}, Berlin. ${listing.roomSqm} m², ${listing.warmmieteEur} € warm. Anmeldung: ${listing.anmeldungPossible ? 'Ja' : 'Nein'}.`,
      openGraph: {
        title: `${listing.title} · JOBROOFS Wohnen`,
        description: `${listing.warmmieteEur} € warm · ${listing.district}, Berlin.`,
        url: `/wohnen/${id}`,
      },
      alternates: {
        canonical: `/wohnen/${id}`,
      },
    };
  }

  return { title: 'Wohnung oder Zimmer in Berlin' };
}

export default async function HousingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let listing = previewHousingListings.find((item) => item.id === id);

  if (!listing) {
    try {
      const d1 = getD1();
      const r = await d1
        .prepare(`SELECT * FROM housing_listings WHERE id = ? LIMIT 1`)
        .bind(id)
        .first<any>();

      if (r) {
        listing = {
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
        };
      }
    } catch {
      // ignore
    }
  }

  if (!listing) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <SiteHeader />
        <HousingDetailContent listing={listing} />
      </div>
      <SiteFooter />
    </main>
  );
}
