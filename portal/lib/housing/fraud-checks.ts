export function runHousingFraudChecks(payload: {
  title?: string;
  description?: string;
  kaltmieteEur?: number;
  warmmieteEur?: number;
  kautionEur?: number;
  postcode?: string;
  contactEmail?: string;
  anmeldungPossible?: boolean;
  subletAuthorized?: boolean;
}): {
  passed: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  const kalt = Number(payload.kaltmieteEur) || 0;
  const warm = Number(payload.warmmieteEur) || 0;
  const kaution = Number(payload.kautionEur) || 0;

  // 1. Mietpreis sanity
  if (kalt < 150) {
    reasons.push('Kaltmiete ist unrealistisch niedrig (< 150 €).');
  }
  if (warm < kalt) {
    reasons.push('Warmmiete darf nicht niedriger als Kaltmiete sein.');
  }

  // 2. German BGB § 551 deposit cap: Max 3x Netto-Kaltmiete
  if (kalt > 0 && kaution > kalt * 3.05) {
    reasons.push(
      `Kaution übersteigt die gesetzliche Grenze nach § 551 BGB (max. 3 Kaltmieten = ${Math.round(kalt * 3)} €).`,
    );
  }

  // 3. Postcode check: Berlin postcodes start with '1' and have 5 digits
  if (payload.postcode) {
    const pc = payload.postcode.toString().trim();
    if (!pc.startsWith('1') || pc.length !== 5) {
      reasons.push('Postleitzahl muss eine 5-stellige Berliner PLZ (beginnend mit 1) sein.');
    }
  }

  // 4. Blacklisted disposable email domains
  const blacklistedDomains = [
    'tempmail.com',
    'mailinator.com',
    '10minutemail.com',
    'guerrillamail.com',
    'throwawaymail.com',
    'yopmail.com',
    'sharklasers.com',
  ];
  if (payload.contactEmail) {
    const domain = payload.contactEmail.split('@')[1]?.toLowerCase();
    if (domain && blacklistedDomains.includes(domain)) {
      reasons.push('Wegwerf-E-Mail-Adressen sind nicht zulässig.');
    }
  }

  // 5. Anti-scam keyword detector (English & German common scam triggers)
  const scamKeywords = [
    'western union',
    'moneygram',
    'bitcoin',
    'crypto',
    'airbnb payment',
    'airbnb reservation',
    'dhl delivery',
    'dhl courier',
    'keys by post',
    'keys by mail',
    'schlüssel per post',
    'schlüssel per dhl',
    'currently abroad',
    'bin derzeit im ausland',
    'working abroad',
    'bin beruflich im ausland',
    'advance payment',
    'vorabüberweisung',
    'vorab überweisen',
    'reservierungsgebühr',
    'reservation fee',
    'send money before',
    'geld vor besichtigung',
    'money before viewing',
    'revolut payment link',
  ];

  const fullText = [payload.title, payload.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const keyword of scamKeywords) {
    if (fullText.includes(keyword)) {
      reasons.push(`Verdächtiges Betrugsmuster erkannt: "${keyword}".`);
    }
  }

  return {
    passed: reasons.length === 0,
    reasons,
  };
}
