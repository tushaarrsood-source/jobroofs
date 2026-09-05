/**
 * Reusable JSON-LD structured data components for SEO.
 * Renders <script type="application/ld+json"> in the page <head>.
 */

/* ── WebSite + SearchAction (Homepage) ─────────────────────────── */

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JOBROOFS',
    alternateName: 'JOBROOFS Berlin',
    url: 'https://jobroofs.com',
    description:
      "Berlin's portal for flexible work, Minijobs, neighborhood housing, and rooms.",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://jobroofs.com/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['de-DE', 'en'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ── JobPosting (Job Detail Page) ──────────────────────────────── */

interface JobPostingJsonLdProps {
  job: {
    id?: string;
    slug?: string;
    title: string;
    company: string;
    district?: string;
    postcode?: string;
    responsibilities?: string[] | string;
    requirements?: string[] | string;
    compensation?: {
      label?: string;
      amountMin?: number;
      amountMax?: number;
      currency?: string;
      rateInterval?: string;
      grossNet?: string;
    };
    employmentForms?: string[];
    schedule?: {
      startDate?: string | null;
      endDate?: string | null;
    };
    workplace?: {
      type?: string;
      address?: string;
    };
    application?: {
      method?: string;
      email?: string;
      url?: string;
    };
    createdAt?: string | Date;
    expiresAt?: string | Date;
    latitude?: number;
    longitude?: number;
  };
}

function mapEmploymentType(forms?: string[]): string[] {
  if (!forms || forms.length === 0) return ['PART_TIME'];
  const map: Record<string, string> = {
    Minijob: 'OTHER',
    'Part-time': 'PART_TIME',
    'Short-term employment': 'TEMPORARY',
    'Working student': 'INTERN',
    'Seasonal work': 'TEMPORARY',
    'Full-time': 'FULL_TIME',
  };
  return forms.map((f) => map[f] || 'OTHER');
}

function mapRateUnit(interval?: string): string {
  const units: Record<string, string> = {
    hour: 'HOUR',
    shift: 'DAY',
    day: 'DAY',
    week: 'WEEK',
    month: 'MONTH',
    year: 'YEAR',
    project: 'YEAR',
  };
  return units[interval || 'hour'] || 'HOUR';
}

export function JobPostingJsonLd({ job }: JobPostingJsonLdProps) {
  const description = [
    ...(Array.isArray(job.responsibilities)
      ? job.responsibilities
      : []),
    ...(Array.isArray(job.requirements) ? job.requirements : []),
  ].join('. ') || `${job.title} at ${job.company} in Berlin.`;

  const datePosted =
    job.createdAt instanceof Date
      ? job.createdAt.toISOString()
      : job.createdAt || new Date().toISOString();

  const validThrough =
    job.expiresAt instanceof Date
      ? job.expiresAt.toISOString()
      : job.expiresAt ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'JOBROOFS',
      value: `JOBROOFS-${job.id || job.slug || 'listing'}`,
    },
    datePosted,
    validThrough,
    employmentType: mapEmploymentType(job.employmentForms),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: job.workplace?.address || '',
        addressLocality: 'Berlin',
        addressRegion: 'Berlin',
        postalCode: job.postcode || '',
        addressCountry: 'DE',
      },
      ...(job.latitude && job.longitude
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: job.latitude,
              longitude: job.longitude,
            },
          }
        : {}),
    },
    directApply: true,
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'DE',
    },
  };

  // Base salary
  if (job.compensation?.amountMin) {
    data.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.compensation.currency || 'EUR',
      value: {
        '@type': 'QuantitativeValue',
        ...(job.compensation.amountMax &&
        job.compensation.amountMax > job.compensation.amountMin
          ? {
              minValue: job.compensation.amountMin,
              maxValue: job.compensation.amountMax,
            }
          : { value: job.compensation.amountMin }),
        unitText: mapRateUnit(job.compensation.rateInterval),
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ── BreadcrumbList ────────────────────────────────────────────── */

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://jobroofs.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ── Housing / Apartment (Accommodation) ───────────────────────── */

interface HousingJsonLdProps {
  listing: {
    id: string;
    title: string;
    listingType?: string;
    district?: string;
    postcode?: string;
    streetAddress?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    kaltmieteEur?: number;
    nebenkostenEur?: number;
    warmmieteEur: number;
    roomSqm: number;
    totalRooms: number;
    furnished?: string;
    anmeldungPossible?: boolean;
    description?: string;
    images?: string[];
    firstSeenAt?: string;
  };
}

export function HousingJsonLd({ listing }: HousingJsonLdProps) {
  const schemaType = listing.listingType === 'wg_room' ? 'Room' : 'Apartment';

  const amenityFeature = [];
  if (listing.anmeldungPossible) {
    amenityFeature.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Anmeldung Possible',
      value: true,
    });
  }
  if (listing.furnished) {
    amenityFeature.push({
      '@type': 'LocationFeatureSpecification',
      name: 'Furnishing Status',
      value: listing.furnished,
    });
  }

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: listing.title,
    description:
      listing.description ||
      `${listing.title} in ${listing.district || 'Berlin'}. ${listing.roomSqm} m², ${listing.warmmieteEur} € warm.`,
    url: `https://jobroofs.com/wohnen/${listing.id}`,
    numberOfRooms: listing.totalRooms || 1,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: listing.roomSqm,
      unitCode: 'MTK',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressRegion: 'Berlin',
      postalCode: listing.postcode || '10115',
      streetAddress: listing.streetAddress || '',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: listing.latitude || 52.5200,
      longitude: listing.longitude || 13.4050,
    },
    amenityFeature,
    offers: {
      '@type': 'Offer',
      price: listing.warmmieteEur,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: listing.firstSeenAt || new Date().toISOString(),
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: listing.warmmieteEur,
        priceCurrency: 'EUR',
        unitText: 'MONTH',
      },
    },
  };

  if (listing.images && listing.images.length > 0) {
    data.image = listing.images;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ── LocalBusiness / EmploymentAgency (Berlin Entity Graph) ────── */

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'EmploymentAgency',
    name: 'JOBROOFS Berlin',
    alternateName: 'JOBROOFS',
    url: 'https://jobroofs.com',
    logo: 'https://jobroofs.com/apple-touch-icon.png',
    description:
      "Berlin's premier marketplace for flexible work, minijobs, student gigs, and verified neighborhood rooms across all 12 districts.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressRegion: 'Berlin',
      postalCode: '10115',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.5200,
      longitude: 13.4050,
    },
    areaServed: {
      '@type': 'City',
      name: 'Berlin',
    },
    priceRange: '€€',
    sameAs: [
      'https://twitter.com/jobroofs',
      'https://www.linkedin.com/company/jobroofs',
      'https://www.instagram.com/jobroofs.berlin',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
