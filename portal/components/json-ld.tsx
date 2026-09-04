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
