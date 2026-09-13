const fs = require('fs');
const path = require('path');

const scratchResvg = path.join(
  'C:\\Users\\tusha\\.gemini\\antigravity\\brain\\3f78e4f2-4365-423d-9733-8e113c3f1062\\scratch\\node_modules\\@resvg\\resvg-js'
);
let Resvg;
try {
  Resvg = require('@resvg/resvg-js').Resvg;
} catch (e) {
  Resvg = require(scratchResvg).Resvg;
}

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
 * Official Jobroofs Architectural Logo Header
 * Strictly matches portal/components/brand-logo.tsx
 */
function renderHeader(theme = 'light') {
  const isDark = theme === 'dark';
  const stroke = isDark ? '#FFFFFF' : '#09090B';
  const subtext = isDark ? '#A1A1AA' : '#71717A';
  const border = isDark ? '#27272A' : '#E4E4E7';

  return `
  <!-- Official Jobroofs Header -->
  <g transform="translate(80, 80)">
    <!-- Architectural Mark: 1.5px rafter chevron, rafter beam, keystone dot -->
    <g transform="translate(0, 2) scale(1.5)">
      <path d="M5 19L16 7L27 19" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.5 19H22.5" stroke="${subtext}" stroke-width="1.2" stroke-linecap="round" />
      <circle cx="16" cy="13.5" r="1.5" fill="${stroke}" />
    </g>

    <!-- Wordmark & Tagline -->
    <text x="60" y="24" fill="${stroke}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" letter-spacing="3.5">JOBROOFS</text>
    <text x="60" y="42" fill="${subtext}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="600" letter-spacing="2.2">THE PORTAL FOR TEMP JOBS</text>

    <!-- Domain Tag Right -->
    <text x="920" y="30" text-anchor="end" fill="${subtext}" font-family="ui-monospace, monospace" font-size="13" font-weight="600" letter-spacing="2">JOBROOFS.COM</text>
  </g>
  <line x1="80" y1="155" x2="1000" y2="155" stroke="${border}" stroke-width="1.2" />
  `;
}

/**
 * Poster Style 1: Modern Gallery Window (Light Studio Minimalist)
 */
function renderGalleryPoster({ role, photoPath, category = 'MINIJOBS & TEMP GIGS', subtext = '100% direct contact with employers — no agencies, no middlemen.' }) {
  const photoBuffer = fs.readFileSync(photoPath);
  const base64Photo = 'data:image/jpeg;base64,' + photoBuffer.toString('base64');

  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Canvas Background -->
  <rect width="1080" height="1350" fill="#FAFAF9" />

  ${renderHeader('light')}

  <!-- Photo Showcase Card (Rounded with subtle border) -->
  <g transform="translate(80, 195)">
    <!-- Clip Path for rounded corners -->
    <defs>
      <clipPath id="photoClip">
        <rect width="920" height="660" rx="28" />
      </clipPath>
    </defs>

    <!-- Base photo -->
    <g clip-path="url(#photoClip)">
      <image href="${base64Photo}" width="920" height="660" preserveAspectRatio="xMidYMid slice" />
      <!-- Subtle top & bottom photo scrim for text overlay -->
      <rect width="920" height="120" fill="black" fill-opacity="0.25" />
    </g>

    <!-- Outer hairline border -->
    <rect width="920" height="660" rx="28" stroke="#09090B" stroke-opacity="0.1" stroke-width="1.5" />

    <!-- Frosted Badge inside Photo -->
    <g transform="translate(30, 30)">
      <rect width="260" height="38" rx="19" fill="#09090B" fill-opacity="0.75" />
      <circle cx="20" cy="19" r="4.5" fill="#10B981" />
      <text x="140" y="24" text-anchor="middle" fill="#FFFFFF" font-family="ui-monospace, monospace" font-size="11" font-weight="700" letter-spacing="2">${escapeXml(category)}</text>
    </g>
  </g>

  <!-- Typographic Hero (Bold, Impactful, Sleek) -->
  <g transform="translate(80, 920)">
    <!-- Line 1: Question -->
    <text x="0" y="52" fill="#09090B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.8">
      Need a ${escapeXml(role)}?
    </text>

    <!-- Line 2: Answer -->
    <text x="0" y="128" fill="#09090B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.8">
      Post at <tspan fill="#10B981">JOBROOFS.</tspan>
    </text>

    <!-- Subtitle / Value Prop (from website hero) -->
    <text x="0" y="185" fill="#52525B" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="400">
      ${escapeXml(subtext)}
    </text>
  </g>

  <!-- CTA Buttons Row (Exactly matching website pills) -->
  <g transform="translate(80, 1175)">
    <!-- Primary Black Pill Button: "Post your job (free) ->" -->
    <rect width="320" height="68" rx="34" fill="#09090B" />
    <text x="145" y="42" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600">Post your job (free)</text>
    <path d="M260 42H280M280 42L272 34M280 42L272 50" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Secondary Pill: "0 € Erstinserat" -->
    <g transform="translate(345, 0)">
      <rect width="250" height="68" rx="34" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="1.8" />
      <circle cx="32" cy="34" r="5" fill="#10B981" />
      <text x="145" y="42" text-anchor="middle" fill="#09090B" font-family="ui-monospace, monospace" font-size="14" font-weight="700">1ST POST 100% FREE</text>
    </g>

    <!-- Right Side Direct Draht Tag -->
    <g transform="translate(920, 42)">
      <text x="0" y="0" text-anchor="end" fill="#71717A" font-family="ui-monospace, monospace" font-size="14" font-weight="600">WHATSAPP DIRECT CONTACT</text>
    </g>
  </g>
</svg>`;
}

/**
 * Poster Style 2: Full-Bleed Dark Editorial Poster (Cinematic, Modern, High Fashion)
 */
function renderCinematicPoster({ role, photoPath, category = 'NOW HIRING ACROSS GERMANY', subtext = 'Direct WhatsApp contact with reliable talent. No agencies. No middleman.' }) {
  const photoBuffer = fs.readFileSync(photoPath);
  const base64Photo = 'data:image/jpeg;base64,' + photoBuffer.toString('base64');

  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark gradient scrim from 25% to deep black -->
    <linearGradient id="darkFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#09090B" stop-opacity="0.4" />
      <stop offset="45%" stop-color="#09090B" stop-opacity="0.75" />
      <stop offset="75%" stop-color="#09090B" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#09090B" stop-opacity="1" />
    </linearGradient>
  </defs>

  <!-- Full-bleed photo -->
  <image href="${base64Photo}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice" />

  <!-- Gradient overlay -->
  <rect width="1080" height="1350" fill="url(#darkFade)" />

  <!-- Top Header (Dark Mode) -->
  ${renderHeader('dark')}

  <!-- Badge Tag -->
  <g transform="translate(80, 720)">
    <rect width="330" height="42" rx="21" fill="#18181B" stroke="#27272A" stroke-width="1.5" />
    <circle cx="25" cy="21" r="5" fill="#10B981" />
    <text x="180" y="26" text-anchor="middle" fill="#34D399" font-family="ui-monospace, monospace" font-size="12" font-weight="700" letter-spacing="2">${escapeXml(category)}</text>
  </g>

  <!-- Big Editorial Headline -->
  <g transform="translate(80, 810)">
    <text x="0" y="65" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="76" font-weight="800" letter-spacing="-2">
      Need a ${escapeXml(role)}?
    </text>
    <text x="0" y="150" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="76" font-weight="800" letter-spacing="-2">
      Post at <tspan fill="#10B981">JOBROOFS.</tspan>
    </text>
    <text x="0" y="225" fill="#A1A1AA" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="400">
      ${escapeXml(subtext)}
    </text>
  </g>

  <!-- Bottom CTA Row -->
  <g transform="translate(80, 1170)">
    <!-- White Pill Button with arrow -->
    <rect width="340" height="70" rx="35" fill="#FFFFFF" />
    <text x="155" y="43" text-anchor="middle" fill="#09090B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="21" font-weight="700">Post your job (free)</text>
    <path d="M280 43H302M302 43L294 35M302 43L294 51" stroke="#09090B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Value Tag -->
    <g transform="translate(370, 0)">
      <rect width="250" height="70" rx="35" fill="#18181B" stroke="#27272A" stroke-width="1.8" />
      <text x="125" y="43" text-anchor="middle" fill="#FFFFFF" font-family="ui-monospace, monospace" font-size="14" font-weight="700">0 € ERSTINSERAT</text>
    </g>

    <!-- Domain -->
    <text x="920" y="44" text-anchor="end" fill="#A1A1AA" font-family="ui-monospace, monospace" font-size="16" font-weight="600">jobroofs.com</text>
  </g>
</svg>`;
}

function renderSvgToPng(svgString) {
  const resvg = new Resvg(svgString, { fitTo: { mode: 'width', value: 1080 } });
  return resvg.render().asPng();
}

const ROLES = [
  {
    id: 'helper',
    role: 'Helper',
    photo: path.join(__dirname, '../assets/poster-photos/helper.jpg'),
    category: 'MINIJOBS & ALLROUNDER',
    subtext: 'Find reliable helpers for your store, warehouse or studio in 2 minutes.',
  },
  {
    id: 'barista',
    role: 'Barista',
    photo: path.join(__dirname, '../assets/poster-photos/barista.jpg'),
    category: 'CAFÉ & SERVICE GIGS',
    subtext: 'Direct 1-click WhatsApp contact with passionate café & service talent.',
  },
  {
    id: 'driver',
    role: 'Driver',
    photo: path.join(__dirname, '../assets/poster-photos/driver.jpg'),
    category: 'LOGISTICS & DELIVERY',
    subtext: 'Courier, delivery & transit drivers across Germany. 0% agency fees.',
  },
  {
    id: 'cook',
    role: 'Cook',
    photo: path.join(__dirname, '../assets/poster-photos/cook.jpg'),
    category: 'GASTRO & KITCHEN',
    subtext: 'From line cooks to kitchen assistants. Fill your open shifts today.',
  },
  {
    id: 'cashier',
    role: 'Cashier',
    photo: path.join(__dirname, '../assets/poster-photos/retail.jpg'),
    category: 'RETAIL & STORE STAFF',
    subtext: 'Friendly retail staff and cashiers for your local business.',
  },
];

function generateAllPosters() {
  const outputDir = path.join(__dirname, '../reports/posters');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const results = [];

  for (const item of ROLES) {
    console.log(`Generating posters for: "${item.role}"...`);

    // 1. Gallery Light Style
    const gallerySvg = renderGalleryPoster({
      role: item.role,
      photoPath: item.photo,
      category: item.category,
      subtext: item.subtext,
    });
    const gallerySvgPath = path.join(outputDir, `poster-${item.id}-gallery.svg`);
    const galleryPngPath = path.join(outputDir, `poster-${item.id}-gallery.png`);
    fs.writeFileSync(gallerySvgPath, gallerySvg);
    fs.writeFileSync(galleryPngPath, renderSvgToPng(gallerySvg));

    // 2. Cinematic Dark Style
    const cinematicSvg = renderCinematicPoster({
      role: item.role,
      photoPath: item.photo,
      category: item.category,
      subtext: item.subtext,
    });
    const cinematicSvgPath = path.join(outputDir, `poster-${item.id}-cinematic.svg`);
    const cinematicPngPath = path.join(outputDir, `poster-${item.id}-cinematic.png`);
    fs.writeFileSync(cinematicSvgPath, cinematicSvg);
    fs.writeFileSync(cinematicPngPath, renderSvgToPng(cinematicSvg));

    results.push({
      role: item.role,
      gallery: galleryPngPath,
      cinematic: cinematicPngPath,
    });
  }

  console.log(`✅ Generated ${results.length * 2} posters in: ${outputDir}`);
  return results;
}

module.exports = {
  renderGalleryPoster,
  renderCinematicPoster,
  renderSvgToPng,
  generateAllPosters,
  ROLES,
};

if (require.main === module) {
  generateAllPosters();
}
