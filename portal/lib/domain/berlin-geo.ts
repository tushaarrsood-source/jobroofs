/**
 * Berlin Geolocation & Map Pin Data Resolver
 * Maps Berlin districts and 5-digit PLZ postcodes to precise coordinates
 * Generates custom monetary badge labels (e.g. "€14.20/h", "€520/mo")
 */

export interface JobGeoLocation {
  lat: number;
  lng: number;
  badgeLabel: string;
  isExact: boolean;
}

// Center of Berlin
export const BERLIN_CENTER = { lat: 52.520008, lng: 13.404954 };

// District Coordinate Centers
export const BERLIN_DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  mitte: { lat: 52.5200, lng: 13.4050 },
  kreuzberg: { lat: 52.4986, lng: 13.3918 },
  friedrichshain: { lat: 52.5132, lng: 13.4539 },
  neukölln: { lat: 52.4812, lng: 13.4352 },
  neukoelln: { lat: 52.4812, lng: 13.4352 },
  prenzlauer_berg: { lat: 52.5404, lng: 13.4187 },
  pankow: { lat: 52.5694, lng: 13.4011 },
  charlottenburg: { lat: 52.5159, lng: 13.3039 },
  wilmersdorf: { lat: 52.4871, lng: 13.3211 },
  schöneberg: { lat: 52.4827, lng: 13.3571 },
  schoeneberg: { lat: 52.4827, lng: 13.3571 },
  tempelhof: { lat: 52.4647, lng: 13.3857 },
  wedding: { lat: 52.5507, lng: 13.3619 },
  moabit: { lat: 52.5312, lng: 13.3364 },
  tiergarten: { lat: 52.5145, lng: 13.3501 },
  lichtenberg: { lat: 52.5322, lng: 13.4986 },
  treptow: { lat: 52.4764, lng: 13.4839 },
  köpenick: { lat: 52.4456, lng: 13.5750 },
  koepenick: { lat: 52.4456, lng: 13.5750 },
  steglitz: { lat: 52.4578, lng: 13.3214 },
  zehlendorf: { lat: 52.4339, lng: 13.2592 },
  spandau: { lat: 52.5373, lng: 13.1979 },
  reinickendorf: { lat: 52.5724, lng: 13.3228 },
  marzahn: { lat: 52.5436, lng: 13.5414 },
  hellersdorf: { lat: 52.5381, lng: 13.6042 },
};

// Common Berlin PLZ Postal Code Coordinates
export const BERLIN_POSTCODE_COORDS: Record<string, { lat: number; lng: number }> = {
  // Mitte / Tiergarten / Wedding
  '10115': { lat: 52.5332, lng: 13.3842 },
  '10117': { lat: 52.5170, lng: 13.3889 },
  '10119': { lat: 52.5303, lng: 13.4038 },
  '10178': { lat: 52.5218, lng: 13.4132 },
  '10179': { lat: 52.5135, lng: 13.4182 },
  '10551': { lat: 52.5318, lng: 13.3392 },
  '10553': { lat: 52.5298, lng: 13.3197 },
  '10555': { lat: 52.5212, lng: 13.3421 },
  '10557': { lat: 52.5255, lng: 13.3695 },
  '10559': { lat: 52.5369, lng: 13.3498 },
  '13347': { lat: 52.5482, lng: 13.3642 },
  '13351': { lat: 52.5539, lng: 13.3412 },
  '13353': { lat: 52.5418, lng: 13.3582 },
  '13355': { lat: 52.5432, lng: 13.3889 },
  '13357': { lat: 52.5521, lng: 13.3821 },
  '13359': { lat: 52.5612, lng: 13.3912 },

  // Friedrichshain-Kreuzberg
  '10243': { lat: 52.5121, lng: 13.4398 },
  '10245': { lat: 52.5065, lng: 13.4589 },
  '10247': { lat: 52.5168, lng: 13.4682 },
  '10249': { lat: 52.5239, lng: 13.4478 },
  '10961': { lat: 52.4939, lng: 13.3982 },
  '10963': { lat: 52.5032, lng: 13.3812 },
  '10965': { lat: 52.4892, lng: 13.3855 },
  '10967': { lat: 52.4912, lng: 13.4215 },
  '10969': { lat: 52.5028, lng: 13.4021 },
  '10997': { lat: 52.4998, lng: 13.4412 },
  '10999': { lat: 52.4962, lng: 13.4248 },

  // Pankow / Prenzlauer Berg
  '10405': { lat: 52.5328, lng: 13.4241 },
  '10407': { lat: 52.5342, lng: 13.4489 },
  '10409': { lat: 52.5462, lng: 13.4421 },
  '10435': { lat: 52.5389, lng: 13.4098 },
  '10437': { lat: 52.5472, lng: 13.4142 },
  '10439': { lat: 52.5532, lng: 13.4112 },
  '13187': { lat: 52.5712, lng: 13.4052 },
  '13189': { lat: 52.5642, lng: 13.4258 },

  // Neukölln
  '12043': { lat: 52.4839, lng: 13.4412 },
  '12045': { lat: 52.4892, lng: 13.4478 },
  '12047': { lat: 52.4912, lng: 13.4312 },
  '12049': { lat: 52.4789, lng: 13.4258 },
  '12051': { lat: 52.4712, lng: 13.4412 },
  '12053': { lat: 52.4798, lng: 13.4382 },
  '12055': { lat: 52.4732, lng: 13.4542 },
  '12057': { lat: 52.4642, lng: 13.4612 },
  '12059': { lat: 52.4872, lng: 13.4512 },

  // Charlottenburg-Wilmersdorf
  '10585': { lat: 52.5182, lng: 13.3082 },
  '10587': { lat: 52.5212, lng: 13.3212 },
  '10589': { lat: 52.5298, lng: 13.3021 },
  '10623': { lat: 52.5089, lng: 13.3289 },
  '10625': { lat: 52.5098, lng: 13.3082 },
  '10627': { lat: 52.5062, lng: 13.2982 },
  '10629': { lat: 52.5012, lng: 13.3082 },
  '10707': { lat: 52.4932, lng: 13.3082 },
  '10709': { lat: 52.4962, lng: 13.2942 },
  '10711': { lat: 52.4982, lng: 13.2842 },
  '10713': { lat: 52.4842, lng: 13.3112 },
  '10715': { lat: 52.4842, lng: 13.3242 },
  '10717': { lat: 52.4912, lng: 13.3282 },
  '10719': { lat: 52.4998, lng: 13.3282 },

  // Tempelhof-Schöneberg
  '10777': { lat: 52.4982, lng: 13.3442 },
  '10779': { lat: 52.4912, lng: 13.3412 },
  '10781': { lat: 52.4942, lng: 13.3582 },
  '10783': { lat: 52.4982, lng: 13.3642 },
  '10785': { lat: 52.5042, lng: 13.3612 },
  '10787': { lat: 52.5032, lng: 13.3442 },
  '10789': { lat: 52.5012, lng: 13.3382 },
  '10823': { lat: 52.4872, lng: 13.3512 },
  '10825': { lat: 52.4842, lng: 13.3442 },
  '10827': { lat: 52.4812, lng: 13.3582 },
  '10829': { lat: 52.4872, lng: 13.3642 },
  '12101': { lat: 52.4782, lng: 13.3882 },
  '12103': { lat: 52.4642, lng: 13.3712 },
  '12105': { lat: 52.4512, lng: 13.3812 },

  // Steglitz-Zehlendorf
  '12157': { lat: 52.4612, lng: 13.3442 },
  '12159': { lat: 52.4712, lng: 13.3342 },
  '12161': { lat: 52.4712, lng: 13.3242 },
  '12163': { lat: 52.4612, lng: 13.3182 },
  '12165': { lat: 52.4542, lng: 13.3212 },
  '14163': { lat: 52.4382, lng: 13.2512 },
  '14165': { lat: 52.4282, lng: 13.2642 },
  '14193': { lat: 52.4782, lng: 13.2382 },
  '14195': { lat: 52.4582, lng: 13.2842 },

  // Spandau & Reinickendorf
  '13403': { lat: 52.5682, lng: 13.3212 },
  '13407': { lat: 52.5612, lng: 13.3542 },
  '13581': { lat: 52.5312, lng: 13.1842 },
  '13583': { lat: 52.5382, lng: 13.1742 },
  '13585': { lat: 52.5482, lng: 13.1942 },
  '13587': { lat: 52.5682, lng: 13.2042 },

  // Treptow-Köpenick & Lichtenberg
  '12435': { lat: 52.4882, lng: 13.4682 },
  '12437': { lat: 52.4682, lng: 13.4882 },
  '12459': { lat: 52.4612, lng: 13.5182 },
  '12489': { lat: 52.4312, lng: 13.5382 },
  '12555': { lat: 52.4482, lng: 13.5782 },
  '10317': { lat: 52.5082, lng: 13.4882 },
  '10318': { lat: 52.4982, lng: 13.5282 },
  '10365': { lat: 52.5212, lng: 13.4982 },
};

/**
 * Deterministic pseudo-random jitter based on job ID
 * Spreads pins in the same postal code across a 300m radius so they don't stack directly on top of each other
 */
function getJitter(id: string, seedOffset: number = 0): { dLat: number; dLng: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i) + seedOffset;
    hash |= 0;
  }
  const angle = Math.abs(hash % 360) * (Math.PI / 180);
  const distance = ((Math.abs(hash >> 8) % 100) / 100) * 0.0035 + 0.0005;
  return {
    dLat: Math.cos(angle) * distance,
    dLng: Math.sin(angle) * distance * 1.6,
  };
}

/**
 * Format wage / monetary model badge for display on map pin
 * e.g. "€14.20/h", "€15/h", "€520/mo", "€18/shift"
 */
export function formatPinBadge(job: any): string {
  if (!job) return '€14+';

  if (job.compensation) {
    const { amountMin, rateInterval } = job.compensation;
    const intervalSuffix = rateInterval === 'hour' ? '/h' : rateInterval === 'month' ? '/mo' : rateInterval === 'shift' ? '/sh' : rateInterval === 'day' ? '/d' : '';
    
    if (amountMin !== null && amountMin !== undefined) {
      const formatted = amountMin % 1 === 0 ? `€${amountMin}` : `€${amountMin.toFixed(2)}`;
      return `${formatted}${intervalSuffix}`;
    }
  }

  if (job.compensationAmountMinimum !== null && job.compensationAmountMinimum !== undefined) {
    const min = parseFloat(job.compensationAmountMinimum);
    const interval = job.compensationRateInterval || 'hour';
    const intervalSuffix = interval === 'hour' ? '/h' : interval === 'month' ? '/mo' : interval === 'shift' ? '/sh' : interval === 'day' ? '/d' : '';
    if (!isNaN(min)) {
      const formatted = min % 1 === 0 ? `€${min}` : `€${min.toFixed(2)}`;
      return `${formatted}${intervalSuffix}`;
    }
  }

  const payText = job.payText || job.compensation?.label;
  if (payText && typeof payText === 'string') {
    const match = payText.match(/€\s*(\d+(?:[.,]\d+)?)/);
    if (match) {
      const num = parseFloat(match[1].replace(',', '.'));
      const isHourly = payText.toLowerCase().includes('hour') || payText.toLowerCase().includes('std');
      const isMonthly = payText.toLowerCase().includes('month') || payText.toLowerCase().includes('monat');
      const suffix = isHourly ? '/h' : isMonthly ? '/mo' : '';
      const formatted = num % 1 === 0 ? `€${num}` : `€${num.toFixed(2)}`;
      return `${formatted}${suffix}`;
    }
  }

  return '€14.20/h';
}

/**
 * Resolve latitude and longitude coordinates for any job item
 */
export function resolveJobCoordinates(job: any): JobGeoLocation {
  const badgeLabel = formatPinBadge(job);

  if (typeof job.latitude === 'number' && typeof job.longitude === 'number' && job.latitude > 50 && job.longitude > 10) {
    return {
      lat: job.latitude,
      lng: job.longitude,
      badgeLabel,
      isExact: true,
    };
  }

  const postcode = (job.postcode || '').toString().trim().replace(/[^0-9]/g, '');
  if (postcode && BERLIN_POSTCODE_COORDS[postcode]) {
    const base = BERLIN_POSTCODE_COORDS[postcode];
    const jitter = getJitter(job.id || job.slug || 'berlin-job');
    return {
      lat: base.lat + jitter.dLat,
      lng: base.lng + jitter.dLng,
      badgeLabel,
      isExact: false,
    };
  }

  const rawDistrict = (job.district || '').toLowerCase().trim();
  const normalizedDistrict = rawDistrict
    .replace(/berlin[- ]?/i, '')
    .replace(/[^a-zäöüß_]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');

  for (const [key, coords] of Object.entries(BERLIN_DISTRICT_COORDS)) {
    if (normalizedDistrict.includes(key) || key.includes(normalizedDistrict)) {
      const jitter = getJitter(job.id || job.slug || 'district-job', 123);
      return {
        lat: coords.lat + jitter.dLat,
        lng: coords.lng + jitter.dLng,
        badgeLabel,
        isExact: false,
      };
    }
  }

  const jitter = getJitter(job.id || job.slug || 'fallback', 456);
  return {
    lat: BERLIN_CENTER.lat + jitter.dLat * 2,
    lng: BERLIN_CENTER.lng + jitter.dLng * 2,
    badgeLabel,
    isExact: false,
  };
}

/**
 * Generate a direct Google Maps redirection link based on the job's real location
 */
export function getGoogleMapsUrl(job: any): string {
  if (!job) return 'https://www.google.com/maps/search/?api=1&query=Berlin';

  const address = job.streetAddress || job.workplace?.address;
  const district = job.district;
  const postcode = job.postcode;
  const company = job.company;

  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${postcode ? `${postcode} ` : ''}Berlin`)}`;
  }

  if (district || postcode) {
    const parts = [company, district, postcode, 'Berlin'].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`;
  }

  const coords = resolveJobCoordinates(job);
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}

/**
 * Format custom pin badge label for a housing listing (e.g. "€750/m", "€1.200/m")
 */
export function formatHousingBadge(listing: any): string {
  if (!listing) return '€750/m';

  const rent = listing.warmmieteEur || listing.kaltmieteEur;
  if (typeof rent === 'number' && !isNaN(rent) && rent > 0) {
    if (rent >= 1000) {
      const thousands = Math.floor(rent / 1000);
      const remainder = Math.round(rent % 1000);
      const formatted = remainder > 0 ? `€${thousands}.${remainder.toString().padStart(3, '0')}` : `€${thousands}.000`;
      return `${formatted}/m`;
    }
    return `€${Math.round(rent)}/m`;
  }

  return '€750/m';
}

/**
 * Resolve latitude and longitude coordinates for any housing listing
 */
export function resolveHousingCoordinates(listing: any): JobGeoLocation {
  const badgeLabel = formatHousingBadge(listing);

  if (
    typeof listing.latitude === 'number' &&
    typeof listing.longitude === 'number' &&
    listing.latitude > 50 &&
    listing.longitude > 10
  ) {
    return {
      lat: listing.latitude,
      lng: listing.longitude,
      badgeLabel,
      isExact: true,
    };
  }

  const postcode = (listing.postcode || '').toString().trim().replace(/[^0-9]/g, '');
  if (postcode && BERLIN_POSTCODE_COORDS[postcode]) {
    const base = BERLIN_POSTCODE_COORDS[postcode];
    const jitter = getJitter(listing.id || `housing-${postcode}`);
    return {
      lat: base.lat + jitter.dLat,
      lng: base.lng + jitter.dLng,
      badgeLabel,
      isExact: false,
    };
  }

  const rawDistrict = (listing.district || '').toLowerCase().trim();
  const rawKiez = (listing.neighborhood || '').toLowerCase().trim();
  const searchStr = `${rawDistrict} ${rawKiez}`
    .replace(/berlin[- ]?/i, '')
    .replace(/[^a-zäöüß_]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');

  for (const [key, coords] of Object.entries(BERLIN_DISTRICT_COORDS)) {
    if (searchStr.includes(key) || key.includes(searchStr)) {
      const jitter = getJitter(listing.id || `housing-${key}`, 789);
      return {
        lat: coords.lat + jitter.dLat,
        lng: coords.lng + jitter.dLng,
        badgeLabel,
        isExact: false,
      };
    }
  }

  const jitter = getJitter(listing.id || 'housing-fallback', 999);
  return {
    lat: BERLIN_CENTER.lat + jitter.dLat * 2,
    lng: BERLIN_CENTER.lng + jitter.dLng * 2,
    badgeLabel,
    isExact: false,
  };
}

/**
 * Generate a direct Google Maps redirection link for a housing listing
 */
export function getHousingGoogleMapsUrl(listing: any): string {
  if (!listing) return 'https://www.google.com/maps/search/?api=1&query=Berlin';

  const address = listing.streetAddress;
  const district = listing.district;
  const postcode = listing.postcode;
  const kiez = listing.neighborhood;

  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${postcode ? `${postcode} ` : ''}Berlin`)}`;
  }

  if (district || postcode || kiez) {
    const parts = [kiez, district, postcode, 'Berlin'].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`;
  }

  const coords = resolveHousingCoordinates(listing);
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}

