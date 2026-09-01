import Firecrawl, { type Document } from 'firecrawl';

const MAJOR_JOB_BOARD_DOMAINS = [
  'indeed.com',
  'indeed.de',
  'stepstone.de',
  'glassdoor.com',
  'linkedin.com',
  'xing.com',
  'monster.de',
];

export function getFirecrawlReadiness() {
  return {
    configured: Boolean(process.env.FIRECRAWL_API_KEY),
    keyName: 'FIRECRAWL_API_KEY',
    mode: process.env.FIRECRAWL_API_KEY
      ? 'ready_for_approved_sources'
      : 'fail_closed',
  } as const;
}

function getClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error('FIRECRAWL_NOT_CONFIGURED');
  return new Firecrawl({ apiKey, timeoutMs: 45_000, maxRetries: 2 });
}

export type SourceCandidate = {
  url: string;
  title: string | null;
  description: string | null;
  discoveredFor: string;
  reviewState: 'candidate';
};

export async function discoverDirectSourceCandidates(input: {
  nicheLabel: string;
  queryTerm?: string;
  limit?: number;
}) {
  const client = getClient();
  const query = `Berlin ${input.queryTerm ?? input.nicheLabel} (jobs OR karriere OR stellenangebote OR aushilfe OR minijob) -Indeed -StepStone -LinkedIn -Glassdoor`;
  const result = await client.search(query, {
    sources: ['web'],
    location: 'Berlin, Germany',
    limit: Math.min(input.limit ?? 10, 25),
    excludeDomains: MAJOR_JOB_BOARD_DOMAINS,
    ignoreInvalidURLs: true,
    highlights: false,
  });

  return (result.web ?? []).flatMap<SourceCandidate>((item) => {
    const url = getDocumentUrl(item);
    if (!url || !isPublicHttpUrl(url) || isMajorBoard(url)) return [];
    const metadata = 'metadata' in item ? item.metadata : undefined;
    const title =
      'title' in item && typeof item.title === 'string'
        ? item.title
        : (metadata?.title ?? null);
    const description =
      'description' in item && typeof item.description === 'string'
        ? item.description
        : (metadata?.description ?? null);
    return [
      {
        url: canonicalizeUrl(url),
        title,
        description,
        discoveredFor: input.nicheLabel,
        reviewState: 'candidate',
      },
    ];
  });
}

export async function scrapeApprovedJobPage(input: {
  sourceUrl: string;
  crawlPolicy: 'approved' | 'review_required' | 'blocked';
  maxAgeMs?: number;
}) {
  if (input.crawlPolicy !== 'approved') throw new Error('SOURCE_NOT_APPROVED');
  if (!isPublicHttpUrl(input.sourceUrl))
    throw new Error('SOURCE_URL_NOT_PUBLIC_HTTP');

  const client = getClient();
  const fetchedAt = new Date().toISOString();
  const document = await client.scrape(input.sourceUrl, {
    formats: ['markdown', 'links'],
    onlyMainContent: true,
    maxAge: Math.max(0, input.maxAgeMs ?? 1_800_000),
    timeout: 40_000,
    blockAds: true,
  });

  const markdown = document.markdown ?? '';
  if (!markdown.trim()) throw new Error('EMPTY_SOURCE_EVIDENCE');

  return {
    sourceUrl: canonicalizeUrl(getDocumentUrl(document) ?? input.sourceUrl),
    fetchedAt,
    contentHash: await sha256(markdown),
    markdown,
    links: document.links ?? [],
    metadata: document.metadata ?? {},
    cacheState: readMetadataString(document, 'cacheState'),
    cachedAt: readMetadataString(document, 'cachedAt'),
  };
}

function getDocumentUrl(
  item: Document | { url?: string; metadata?: Document['metadata'] },
) {
  if ('url' in item && typeof item.url === 'string') return item.url;
  return item.metadata?.url;
}

function readMetadataString(document: Document, key: string) {
  const value = (document.metadata as Record<string, unknown> | undefined)?.[
    key
  ];
  return typeof value === 'string' ? value : null;
}

function isMajorBoard(value: string) {
  const hostname = new URL(value).hostname.toLowerCase();
  return MAJOR_JOB_BOARD_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

export function canonicalizeUrl(value: string) {
  const url = new URL(value);
  url.hash = '';
  for (const key of url.searchParams.keys()) {
    if (
      key.toLowerCase().startsWith('utm_') ||
      ['fbclid', 'gclid', 'mc_cid', 'mc_eid'].includes(key.toLowerCase())
    ) {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
}

export function isSameSourceHost(sourceUrl: string, jobUrl: string) {
  const normalize = (hostname: string) =>
    hostname.toLowerCase().replace(/^www\./, '');
  return (
    normalize(new URL(sourceUrl).hostname) ===
    normalize(new URL(jobUrl).hostname)
  );
}

export function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname === '0.0.0.0' ||
      hostname === '::1'
    )
      return false;
    if (
      hostname.startsWith('10.') ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.')
    )
      return false;
    const private172 = hostname.match(/^172\.(\d{1,3})\./);
    if (
      private172 &&
      Number(private172[1]) >= 16 &&
      Number(private172[1]) <= 31
    )
      return false;
    return true;
  } catch {
    return false;
  }
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
