const fs = require('fs');
const path = require('path');

/**
 * Generates an ultra-sleek, Apple/Emil-inspired 1080x1350 Instagram feed card (SVG format).
 * Can be directly converted to PNG or posted to Instagram/Stories.
 */
function generateInstagramJobCard({
  title = 'Barista & Café Allrounder (m/w/d)',
  company = 'Café Silo Berlin',
  city = 'Berlin',
  district = 'Friedrichshain',
  wage = '16,00 € / Std.',
  employmentType = 'Minijob (bis 603 €)',
  hours = '10–15 Std. / Woche',
}) {
  const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0" y1="0" x2="1080" y2="1350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#09090b" />
      <stop offset="100%" stop-color="#18181b" />
    </linearGradient>
    <linearGradient id="badgeGradient" x1="0" y1="0" x2="300" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1350" fill="url(#bgGradient)" />

  <!-- Subtle grid dots for modern texture -->
  <g opacity="0.07" fill="#ffffff">
    ${Array.from({ length: 12 })
      .map((_, i) =>
        Array.from({ length: 15 })
          .map((_, j) => `<circle cx="${80 + i * 85}" cy="${80 + j * 85}" r="2" />`)
          .join('')
      )
      .join('')}
  </g>

  <!-- Top Brand Header -->
  <g transform="translate(100, 110)">
    <rect width="48" height="48" rx="12" fill="#10b981" />
    <path d="M16 28L24 16L32 28H16Z" fill="#ffffff" />
    <text x="68" y="33" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" letter-spacing="2">JOBROOFS</text>
    <text x="960" y="32" text-anchor="end" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600">DEUTSCHLAND</text>
  </g>

  <!-- Divider -->
  <line x1="100" y1="190" x2="980" y2="190" stroke="#27272a" stroke-width="1.5" />

  <!-- Tag Pill -->
  <g transform="translate(100, 250)">
    <rect width="320" height="52" rx="26" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.3" stroke-width="1.5" />
    <circle cx="28" cy="26" r="6" fill="#10b981" />
    <text x="46" y="33" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700">${employmentType}</text>
  </g>

  <!-- Job Title -->
  <g transform="translate(100, 360)">
    <text x="0" y="70" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" letter-spacing="-1">
      ${title.length > 32 ? title.slice(0, 30) + '...' : title}
    </text>
    <text x="0" y="150" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="600">
      bei ${company}
    </text>
  </g>

  <!-- Key Metrics Bento Grid -->
  <g transform="translate(100, 580)">
    <!-- Box 1: Wage -->
    <rect x="0" y="0" width="420" height="180" rx="24" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="40" y="60" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600">STUNDENLOHN</text>
    <text x="40" y="125" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="800">${wage}</text>

    <!-- Box 2: Location -->
    <rect x="460" y="0" width="420" height="180" rx="24" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="500" y="60" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600">STANDORT</text>
    <text x="500" y="125" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800">${district}, ${city}</text>

    <!-- Box 3: Hours -->
    <rect x="0" y="210" width="880" height="130" rx="24" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="40" y="260" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600">ARBEITSZEITEN &amp; SCHICHTEN</text>
    <text x="40" y="305" fill="#e4e4e7" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700">${hours} · Flexible Schichteinteilung</text>
  </g>

  <!-- CTA Box -->
  <g transform="translate(100, 990)">
    <rect width="880" height="140" rx="28" fill="#10b981" />
    <text x="440" y="65" text-anchor="middle" fill="#022c22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="800">
      DIREKT BEWERBEN IN 1-KLICK
    </text>
    <text x="440" y="105" text-anchor="middle" fill="#064e3b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600">
      Ohne langes Anschreiben · jobroofs.com
    </text>
  </g>

  <!-- Footer Tagline -->
  <g transform="translate(100, 1220)">
    <text x="440" y="0" text-anchor="middle" fill="#52525b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500">
      100% Unabhängige Inserate · Kostenlos Stellen inserieren auf jobroofs.com
    </text>
  </g>
</svg>`;

  return svg;
}

// Demo generation
const sampleCard = generateInstagramJobCard({
  title: 'Barista & Café Allrounder (m/w/d)',
  company: 'Five Elephant Café',
  city: 'Berlin',
  district: 'Mitte',
  wage: '16,50 € / Std.',
  employmentType: 'Minijob (bis 603 €)',
  hours: '12 Std. / Woche (Wochenende)',
});

const outDir = path.resolve(__dirname, '..', 'reports', 'social');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, 'sample-job-card.svg');
fs.writeFileSync(outPath, sampleCard, 'utf8');
console.log('✅ Generated sample Instagram post graphic at:', outPath);

module.exports = { generateInstagramJobCard };
