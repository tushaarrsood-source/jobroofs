import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HousingDetailContent } from '@/components/housing-detail-content';
import { HousingJsonLd, BreadcrumbJsonLd } from '@/components/json-ld';
import { previewHousingListings } from '@/lib/domain/preview-housing';
import { housingTypeLabels, type HousingListing } from '@/lib/domain/housing-types';
import { getD1 } from '@/db';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
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
          roomSqm: r.room_sqm,
          totalRooms: r.total_rooms,
          warmmieteEur: r.warmmiete_eur,
          anmeldungPossible: Boolean(r.anmeldung_possible),
        } as any;
      }
    } catch {
      // ignore
    }
  }

  if (listing) {
    const typeLabel = housingTypeLabels[listing.listingType]?.de || 'Wohnung';
    return {
      title: `${listing.title} (${listing.district}) — ${listing.warmmieteEur} € warm`,
      description: `${typeLabel} in ${listing.district}, Berlin (${listing.postcode || 'Berlin'}). ${listing.roomSqm} m², ${listing.warmmieteEur} € warm/Monat. Anmeldung: ${listing.anmeldungPossible ? 'Möglich' : 'Nicht möglich'}.`,
      openGraph: {
        title: `${listing.title} · ${listing.district}, Berlin · JOBROOFS Wohnen`,
        description: `${listing.warmmieteEur} € warm · ${listing.roomSqm} m² · ${listing.district}, Berlin. Jetzt anfragen.`,
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
  let listing: HousingListing | null = null;

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
      };
    }
  } catch {
    // ignore
  }

  if (!listing) {
    listing = previewHousingListings.find((item) => item.id === id) || null;
  }

  if (!listing) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div>
        <HousingJsonLd listing={listing} />
        <BreadcrumbJsonLd
          items={[
            { name: 'JOBROOFS', href: '/' },
            { name: 'Wohnen & Zimmer', href: '/wohnen' },
            { name: listing.title, href: `/wohnen/${listing.id}` },
          ]}
        />
        <SiteHeader />
        <HousingDetailContent listing={listing} />
      </div>
      <SiteFooter />
    </main>
  );
}
