const fs = require('fs');
const path = require('path');

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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
  const safeTitle = escapeXml(title.length > 32 ? title.slice(0, 30) + '...' : title);
  const safeCompany = escapeXml(company);
  const safeCity = escapeXml(city);
  const safeDistrict = escapeXml(district);
  const safeWage = escapeXml(wage);
  const safeEmploymentType = escapeXml(employmentType);
  const safeHours = escapeXml(hours);

  // Multiline title handling to guarantee zero clipping
  const words = title.split(' ');
  let line1 = '';
  let line2 = '';
  for (const w of words) {
    if ((line1 + ' ' + w).trim().length <= 22 && !line2) {
      line1 = (line1 + ' ' + w).trim();
    } else {
      line2 = (line2 + ' ' + w).trim();
    }
  }
  if (line2.length > 25) line2 = line2.slice(0, 22) + '...';

  const titleSvg = line2
    ? `<text x="0" y="50" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">${escapeXml(line1)}</text>
       <text x="0" y="110" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1">${escapeXml(line2)}</text>
       <text x="0" y="170" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="600">bei ${safeCompany}</text>`
    : `<text x="0" y="70" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="60" font-weight="800" letter-spacing="-1">${escapeXml(line1 || title)}</text>
       <text x="0" y="150" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="600">bei ${safeCompany}</text>`;

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
    <text x="46" y="33" fill="#34d399" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700">${safeEmploymentType}</text>
  </g>

  <!-- Job Title -->
  <g transform="translate(100, 360)">
    ${titleSvg}
  </g>

  <!-- Key Metrics Bento Grid -->
  <g transform="translate(100, 580)">
    <!-- Box 1: Wage -->
    <rect x="0" y="0" width="420" height="180" rx="24" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="40" y="60" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600">STUNDENLOHN</text>
    <text x="40" y="125" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="800">${safeWage}</text>

    <!-- Box 2: Location -->
    <rect x="460" y="0" width="420" height="180" rx="24" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="500" y="60" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600">STANDORT</text>
    <text x="500" y="125" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800">${safeDistrict}, ${safeCity}</text>

    <!-- Box 3: Hours -->
    <rect x="0" y="210" width="880" height="130" rx="24" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
    <text x="40" y="260" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600">ARBEITSZEITEN &amp; SCHICHTEN</text>
    <text x="40" y="305" fill="#e4e4e7" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700">${safeHours} · Flexible Schichteinteilung</text>
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

function renderJobCardPng(jobData) {
  const svg = generateInstagramJobCard(jobData);
  const scratchResvg = path.join(
    'C:\\Users\\tusha\\.gemini\\antigravity\\brain\\3f78e4f2-4365-423d-9733-8e113c3f1062\\scratch\\node_modules\\@resvg\\resvg-js'
  );
  let ResvgClass;
  try {
    ResvgClass = require('@resvg/resvg-js').Resvg;
  } catch (e) {
    ResvgClass = require(scratchResvg).Resvg;
  }
  const resvg = new ResvgClass(svg, { fitTo: { mode: 'width', value: 1080 } });
  const pngData = resvg.render();
  return pngData.asPng();
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

try {
  const pngBuf = renderJobCardPng({
    title: 'Barista & Café Allrounder (m/w/d)',
    company: 'Five Elephant Café',
    city: 'Berlin',
    district: 'Mitte',
    wage: '16,50 € / Std.',
    employmentType: 'Minijob (bis 603 €)',
    hours: '12 Std. / Woche (Wochenende)',
  });
  const pngPath = path.join(outDir, 'sample-job-card.png');
  fs.writeFileSync(pngPath, pngBuf);
  console.log('✅ Generated high-resolution 1080x1350 PNG at:', pngPath);
} catch (err) {
  console.error('PNG render error:', err);
}

module.exports = { generateInstagramJobCard, renderJobCardPng };

