/**
 * High-Intent Hashtag Matrix Engine for JOBROOFS Social Media
 * 
 * Optimized for Instagram's semantic search and explore ranking algorithms (2026).
 * Follows a 4-Tier Hashtag Architecture:
 *   Tier 1: High Search Volume Intent (Broad Job/Hiring Discovery)
 *   Tier 2: Role & Industry Specific Niche (High Conversion, Low Competition)
 *   Tier 3: Hyper-Local Geo-Intent (City & Neighborhood Indexing)
 *   Tier 4: Value-Proposition & Conversion Brand Tags
 * 
 * Optimal tag count: 14 - 18 hashtags per post.
 */

// 1. ROLE / INDUSTRY CLUSTERS (High Intent, Targeted)
const ROLE_CLUSTERS = {
  barista: [
    '#barista',
    '#baristajobs',
    '#specialtycoffee',
    '#caféberlin',
    '#servicekraft',
    '#gastronomie',
    '#gastrojobs',
    '#kellnergesucht',
    '#baristalife'
  ],
  koch: [
    '#kochgesucht',
    '#küchenhilfe',
    '#beikoch',
    '#gastroberlin',
    '#gastronomie',
    '#gastrojobs',
    '#küchenteam',
    '#köchin'
  ],
  kellner: [
    '#kellner',
    '#kellnergesucht',
    '#servicekraft',
    '#gastronomie',
    '#gastrojobs',
    '#barkeeper',
    '#tresenkraft',
    '#servicepersonal'
  ],
  fahrer: [
    '#kurierfahrer',
    '#auslieferungsfahrer',
    '#fahrergesucht',
    '#lieferant',
    '#kurier',
    '#logistikjobs',
    '#pkwfahrer',
    '#lieferdienst'
  ],
  reinigung: [
    '#reinigungskraft',
    '#reinigungskraftgesucht',
    '#putzstelle',
    '#unterhaltsreinigung',
    '#gebaeudereinigung',
    '#sauberkeit',
    '#haushaltshilfe'
  ],
  einzelhandel: [
    '#einzelhandel',
    '#kassierer',
    '#verkäuferin',
    '#shopassistant',
    '#storemanager',
    '#kiezladen',
    '#ladeninhaber'
  ],
  lager: [
    '#lagerhelfer',
    '#kommissionierer',
    '#lagerarbeit',
    '#logistikjobs',
    '#packhelfer',
    '#aushilfe'
  ],
  event: [
    '#eventpersonal',
    '#promotionjob',
    '#messepersonal',
    '#aushilfegesucht',
    '#wochenendjob',
    '#eventjobs'
  ],
  student: [
    '#studentenjob',
    '#werkstudent',
    '#studentenleben',
    '#minijobberlin',
    '#campuslife',
    '#geldverdienen',
    '#studiumundjob'
  ],
  minijob: [
    '#minijob',
    '#minijob603',
    '#nebenjob',
    '#steuerfrei',
    '#fairebezahlung',
    '#stundenlohn',
    '#aushilfsjob'
  ]
};

// 2. PILLAR-LEVEL INTENT CLUSTERS
const PILLAR_CLUSTERS = {
  seeker: [
    '#minijob',
    '#nebenjob',
    '#studentenjob',
    '#stellenangebot',
    '#jobsuche',
    '#aushilfe',
    '#geldverdienen',
    '#quereinsteiger',
    '#flexiblerjob'
  ],
  employer: [
    '#mitarbeitersuche',
    '#personalsuche',
    '#stellenanzeige',
    '#recruitingtipps',
    '#arbeitgeber',
    '#personalgewinnung',
    '#hiringnow',
    '#mittelstand',
    '#gastronomiedeutschland',
    '#keineagentur'
  ],
  contrarian: [
    '#recruitingtipps',
    '#mitarbeitergewinnung',
    '#personalgewinnung',
    '#unternehmertum',
    '#fachkräftemangel',
    '#zeitarbeit',
    '#personalleasing',
    '#stepstone',
    '#indeed',
    '#recruitinghacks',
    '#arbeitgeber',
    '#mittelstand',
    '#keineagentur'
  ],
  kiez: [
    '#kiezjobs',
    '#lokalearbeit',
    '#nachbarschaft',
    '#kiezliebe',
    '#stellenangebote',
    '#vorortarbeiten',
    '#kiez'
  ],
  manifesto: [
    '#recruitingrevolution',
    '#arbeitswelt',
    '#unternehmertum',
    '#leadership',
    '#arbeitskultur',
    '#transparentelöhne',
    '#keinezeitarbeit',
    '#futureofwork',
    '#arbeitgeber',
    '#mittelstand'
  ]
};

// 3. GEO / DISTRICT CLUSTERS (Hyper-Local Ranking)
const GEO_CLUSTERS = {
  mitte: ['#berlinmitte', '#mitteberlin', '#torstrasse', '#rosenthalerplatz', '#berlinjobs', '#gastroberlin'],
  kreuzberg: ['#kreuzberg', '#xberg', '#kotti', '#oranienstrasse', '#wrangelkiez', '#berlinjobs', '#gastrokreuzberg'],
  neukölln: ['#neukölln', '#weserstrasse', '#pannierkiez', '#sonnenallee', '#berlinjobs', '#gastroneukölln'],
  prenzlauer: ['#prenzlauerberg', '#prenzlberg', '#helmholtzplatz', '#kollwitzplatz', '#berlinjobs', '#caféberlin'],
  friedrichshain: ['#friedrichshain', '#fhain', '#boxhagenerplatz', '#warschauerstrasse', '#berlinjobs'],
  charlottenburg: ['#charlottenburg', '#kudamm', '#kantstrasse', '#westberlin', '#berlinjobs'],
  hamburg: ['#hamburgjobs', '#schanze', '#stpauli', '#schanzenviertel', '#hamburggastro', '#hhjobs'],
  münchen: ['#münchenjobs', '#glockenbachviertel', '#schwabing', '#münchengastro', '#mucjobs'],
  köln: ['#kölnjobs', '#belgischesviertel', '#ehrenfeld', '#kölngastro', '#veedel', '#nrwjobs'],
  frankfurt: ['#frankfurtjobs', '#frankfurtsachsenhausen', '#bornheim', '#ffmjobs'],
  default: ['#berlinjobs', '#kiezjobs', '#kiezberlin', '#berlingigs']
};

// 4. BRAND & CONVERSION FOOTER
const BRAND_TAGS = ['#direktkontakt', '#jobroofs'];

/**
 * Detects the specific role category from post
 */
function detectRoleKey(post) {
  const headline = `${post.role1 || ''} ${post.role2 || ''}`.toLowerCase();
  
  if (/\bbarista|\bkaffee|\bcafe|\bcafé|espresso|siebträger/i.test(headline)) return 'barista';
  if (/\bkoch|\bköch|\bküche|\bspül/i.test(headline)) return 'koch';
  if (/\bkellner|\bservice|\bbarkeeper|\btresen/i.test(headline)) return 'kellner';
  if (/\bfahrer|\bkurier|\bliefer/i.test(headline)) return 'fahrer';
  if (/\breinigung|\bputz/i.test(headline)) return 'reinigung';
  if (/\bkassier|\beinzelhandel|\bstore-manager|\bladen/i.test(headline)) return 'einzelhandel';
  if (/\blager|\bkommissionier/i.test(headline)) return 'lager';
  if (/\bevent|\bmesse|\bpromotion/i.test(headline)) return 'event';
  if (/\bstudent|\bstudi/i.test(headline)) return 'student';
  if (/\bminijob|\b603|brutto = netto|\bnebenjob/i.test(headline)) return 'minijob';

  // Secondary search in subline / tags
  const secondary = `${post.subline || ''} ${post.tags || ''}`.toLowerCase();
  if (/\bbarista/i.test(secondary)) return 'barista';
  if (/\bkoch|\bküche/i.test(secondary)) return 'koch';
  if (/\bkellner|\bservice/i.test(secondary)) return 'kellner';
  if (/\bfahrer|\bkurier/i.test(secondary)) return 'fahrer';
  if (/\breinigung/i.test(secondary)) return 'reinigung';
  if (/\beinzelhandel|\bkasse/i.test(secondary)) return 'einzelhandel';
  if (/\blager/i.test(secondary)) return 'lager';
  if (/\bevent/i.test(secondary)) return 'event';
  if (/\bstudent/i.test(secondary)) return 'student';
  if (/\bminijob/i.test(secondary)) return 'minijob';

  return null;
}

/**
 * Detects geo/district focus from post
 */
function detectGeoKey(post) {
  const cleanHeadlineAndSub = `${post.role1 || ''} ${post.role2 || ''} ${post.subline || ''}`.toLowerCase();

  if (/\bmitte\b|torstra(ß|ss)e|rosenthaler|hackesch/i.test(cleanHeadlineAndSub)) return 'mitte';
  if (/\bkreuzberg\b|\bxberg\b|\bkotti\b|oranienstra(ß|ss)e|wrangel/i.test(cleanHeadlineAndSub)) return 'kreuzberg';
  if (/\bneukölln\b|\bneukoelln\b|weserstra(ß|ss)e|sonnenallee|pannier/i.test(cleanHeadlineAndSub)) return 'neukölln';
  if (/\bprenzlauer\b|\bprenzlberg\b|helmholtz|kollwitz/i.test(cleanHeadlineAndSub)) return 'prenzlauer';
  if (/\bfriedrichshain\b|\bf-hain\b|\bfhain\b|boxhagener|warschauer/i.test(cleanHeadlineAndSub)) return 'friedrichshain';
  if (/\bcharlottenburg\b|ku-?damm|kantstra(ß|ss)e/i.test(cleanHeadlineAndSub)) return 'charlottenburg';
  if (/\bhamburg\b|\bschanze\b|st\.?\s*pauli/i.test(cleanHeadlineAndSub)) return 'hamburg';
  if (/\bmünchen\b|\bmuenchen\b|schwabing|glockenbach/i.test(cleanHeadlineAndSub)) return 'münchen';
  if (/\bköln\b|\bkoeln\b|ehrenfeld|belgisches\s*viertel|veedel/i.test(cleanHeadlineAndSub)) return 'köln';
  if (/\bfrankfurt\b|sachsenhausen|bornheim/i.test(cleanHeadlineAndSub)) return 'frankfurt';

  return 'default';
}

/**
 * Generates an algorithm-optimized array of 14-18 high-intent hashtags
 */
function generateHashtagsForPost(post) {
  const roleKey = detectRoleKey(post);
  const geoKey = detectGeoKey(post);
  const pillar = post.pillar || 'seeker';

  const selectedTags = new Set();

  // 1. Role Tags (if matched, 4-6 tags)
  if (roleKey && ROLE_CLUSTERS[roleKey]) {
    ROLE_CLUSTERS[roleKey].slice(0, 5).forEach((t) => selectedTags.add(t));
  }

  // 2. Pillar Tags (5-7 tags)
  const pillarTags = PILLAR_CLUSTERS[pillar] || PILLAR_CLUSTERS.seeker;
  pillarTags.forEach((t) => {
    if (selectedTags.size < 11) selectedTags.add(t);
  });

  // 3. Geo Tags (3-4 tags)
  const geoTags = GEO_CLUSTERS[geoKey] || GEO_CLUSTERS.default;
  geoTags.forEach((t) => {
    if (selectedTags.size < 15) selectedTags.add(t);
  });

  // 4. Seeker or Hiring specific conversion tag
  if (pillar === 'seeker') {
    selectedTags.add('#ohnelebenslauf');
    selectedTags.add('#whatsappbewerbung');
  } else if (pillar === 'employer' || pillar === 'contrarian') {
    selectedTags.add('#keinezeitarbeit');
    selectedTags.add('#direkthiring');
  }

  // 5. Brand Tags (always present)
  BRAND_TAGS.forEach((t) => selectedTags.add(t));

  // Return array capped between 14-16 hashtags
  return Array.from(selectedTags).slice(0, 16);
}

/**
 * Formats a clean caption with dot-spaced high-intent hashtag footer
 */
function formatCaptionWithHashtags(baseText, hashtags) {
  // Strip any trailing hashtags and dots from existing caption
  let cleanText = baseText
    .replace(/(#[\w\u00C0-\u017F]+[\s\n]*)+$/g, '')
    .trim();
  
  // Remove trailing dot spacers if present
  cleanText = cleanText.replace(/(\n\s*\.\s*)+$/g, '').trim();

  const tagString = hashtags.join(' ');
  return `${cleanText}\n\n.\n.\n.\n${tagString}`;
}

module.exports = {
  ROLE_CLUSTERS,
  PILLAR_CLUSTERS,
  GEO_CLUSTERS,
  generateHashtagsForPost,
  formatCaptionWithHashtags,
  detectRoleKey,
  detectGeoKey
};
