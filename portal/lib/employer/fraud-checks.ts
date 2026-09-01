export function runAutomatedFraudChecks(payload: any): {
  passed: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Pay sanity
  if (payload.compensationRateInterval === "hour") {
    if (
      payload.compensationAmountMinimum &&
      payload.compensationAmountMinimum < 13.9
    ) {
      reasons.push("Minimum hourly rate is below €13.90");
    }
    if (
      payload.compensationAmountMaximum &&
      payload.compensationAmountMaximum > 100
    ) {
      reasons.push("Maximum hourly rate exceeds €100");
    }
  }

  // Blacklisted email domains
  const blacklistedDomains = [
    "tempmail.com",
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
  ];
  if (payload.applicationEmail) {
    const domain = payload.applicationEmail.split("@")[1];
    if (domain && blacklistedDomains.includes(domain.toLowerCase())) {
      reasons.push("Email domain is blacklisted");
    }
  }

  // Keyword scan for scam patterns
  const scamKeywords = [
    "advance payment",
    "send money",
    "equipment purchase",
    "whatsapp only",
    "telegram only",
    "crypto",
    "bitcoin",
    "western union",
  ];

  const textToScan = [
    payload.title,
    payload.company,
    ...(payload.responsibilities || []),
    ...(payload.requirements || []),
    payload.applicationInstructions,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const keyword of scamKeywords) {
    if (textToScan.includes(keyword)) {
      reasons.push(`Suspicious keyword found: ${keyword}`);
    }
  }

  // Berlin postcode
  if (payload.postcode && !payload.postcode.toString().startsWith("1")) {
    reasons.push(
      "Postcode is not a valid Berlin postcode (does not start with 1)",
    );
  }

  return {
    passed: reasons.length === 0,
    reasons,
  };
}
