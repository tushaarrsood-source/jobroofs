import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

if (!fs.existsSync(envPath)) {
  console.error("No .env.local found at", envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/STRIPE_SECRET_KEY=([^\r\n]+)/);
if (!match || !match[1]) {
  console.error("STRIPE_SECRET_KEY not found in .env.local");
  process.exit(1);
}

const STRIPE_SECRET_KEY = match[1].trim();

const PRODUCTS_TO_CREATE = [
  {
    lookupKey: "jobroofs_job_standard",
    name: "JOBROOFS Standard Job Listing (30 Days)",
    description: "30 Tage Laufzeit für eine Stellenanzeige in Berlin. Inklusive Kiez- & Bezirks-Matching.",
    unitAmount: 2900, // €29.00
    currency: "eur",
    metadata: {
      service: "jobroofs",
      type: "job",
      tier: "standard",
      duration_days: "30",
    },
  },
  {
    lookupKey: "jobroofs_job_premium",
    name: "JOBROOFS Premium Job Listing (60 Days) - Top Placement",
    description: "60 Tage Laufzeit (volle 2 Monate), ⭐ Top-Platzierung ganz oben in den Suchergebnissen, priorisierter Karten-Pin & Refresh nach 30 Tagen.",
    unitAmount: 4900, // €49.00
    currency: "eur",
    metadata: {
      service: "jobroofs",
      type: "job",
      tier: "premium",
      duration_days: "60",
      featured: "true",
    },
  },
  {
    lookupKey: "jobroofs_job_annual",
    name: "JOBROOFS Annual Unlimited Employer Pass (1 Year)",
    description: "Unbegrenzte Stellenanzeigen für 365 Tage für dein Berliner Unternehmen. Inklusive Unternehmensprofil und Team-Zugang.",
    unitAmount: 49900, // €499.00
    currency: "eur",
    metadata: {
      service: "jobroofs",
      type: "job",
      tier: "annual",
      duration_days: "365",
      unlimited: "true",
    },
  },
  {
    lookupKey: "jobroofs_housing_standard",
    name: "JOBROOFS Standard Housing Listing (30 Days)",
    description: "30 Tage Laufzeit für Wohnungs- und WG-Angebote in Berlin. Direkter Mieterkontakt ohne Maklerprovision.",
    unitAmount: 2900, // €29.00
    currency: "eur",
    metadata: {
      service: "jobroofs",
      type: "housing",
      tier: "standard",
      duration_days: "30",
    },
  },
  {
    lookupKey: "jobroofs_housing_premium",
    name: "JOBROOFS Premium Housing Listing (60 Days) - Top Placement",
    description: "60 Tage Laufzeit, ⭐ Top-Platzierung ganz oben in der Wohnungsbörse, farblich hervorgehoben & priorisierter Karten-Pin.",
    unitAmount: 4900, // €49.00
    currency: "eur",
    metadata: {
      service: "jobroofs",
      type: "housing",
      tier: "premium",
      duration_days: "60",
      featured: "true",
    },
  },
];

async function stripeRequest(endpoint, options = {}) {
  const url = `https://api.stripe.com/v1/${endpoint}`;
  const headers = {
    Authorization: `Basic ${Buffer.from(STRIPE_SECRET_KEY + ":").toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
    ...options.headers,
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Stripe API Error [${response.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

async function run() {
  console.log("Checking Stripe Account...");
  const account = await stripeRequest("account");
  console.log(`Connected to Stripe account: ${account.id} (${account.business_profile?.name || account.settings?.dashboard?.display_name || "JobRoofs"})`);

  const existingProducts = await stripeRequest("products?limit=100");
  const existingPrices = await stripeRequest("prices?limit=100");

  const results = {};

  for (const item of PRODUCTS_TO_CREATE) {
    console.log(`\nProcessing ${item.name}...`);

    // Check if product already exists by metadata or name
    let product = existingProducts.data.find(
      (p) => p.metadata?.lookup_key === item.lookupKey || p.name === item.name
    );

    if (!product) {
      console.log(`Creating Product '${item.name}'...`);
      const body = new URLSearchParams({
        name: item.name,
        description: item.description,
        "metadata[service]": item.metadata.service,
        "metadata[type]": item.metadata.type,
        "metadata[tier]": item.metadata.tier,
        "metadata[lookup_key]": item.lookupKey,
      });

      product = await stripeRequest("products", {
        method: "POST",
        body: body.toString(),
      });
      console.log(`Created Product: ${product.id}`);
    } else {
      console.log(`Found existing Product: ${product.id}`);
    }

    // Check if price already exists for this product
    let price = existingPrices.data.find(
      (p) => p.product === product.id && p.unit_amount === item.unitAmount && p.currency === item.currency
    );

    if (!price) {
      console.log(`Creating Price for ${product.id} (€${(item.unitAmount / 100).toFixed(2)})...`);
      const priceBody = new URLSearchParams({
        product: product.id,
        unit_amount: item.unitAmount.toString(),
        currency: item.currency,
        lookup_key: item.lookupKey,
        "metadata[tier]": item.metadata.tier,
        "metadata[service]": item.metadata.service,
      });

      price = await stripeRequest("prices", {
        method: "POST",
        body: priceBody.toString(),
      });
      console.log(`Created Price: ${price.id}`);
    } else {
      console.log(`Found existing Price: ${price.id}`);
    }

    results[item.lookupKey] = {
      productId: product.id,
      priceId: price.id,
      name: item.name,
      amountEur: item.unitAmount / 100,
      metadata: item.metadata,
    };
  }

  console.log("\n=======================================================");
  console.log("ALL JOBROOFS STRIPE PRODUCTS & PRICES CONFIGURED:");
  console.log(JSON.stringify(results, null, 2));
  console.log("=======================================================\n");

  // Output to a json config file
  const outPath = path.resolve(__dirname, '../lib/stripe/stripe-catalog.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Saved catalog to ${outPath}`);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
