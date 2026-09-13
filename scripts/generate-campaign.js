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
 * Post 1: Pure Double-Color Logo + Subline
 * Minimalist, elegant, silent luxury announcement post.
 */
function renderLogoLaunchPoster(bgColor = '#385542', textColor = '#F6F4EB') {
  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Color 1 (Background) -->
  <rect width="1080" height="1350" fill="${bgColor}" />

  <!-- Top Accent Wordmark & Domain -->
  <g transform="translate(540, 180)">
    <text x="0" y="0" text-anchor="middle" fill="${textColor}" fill-opacity="0.55" font-family="ui-monospace, monospace" font-size="13" font-weight="600" letter-spacing="4">JOBROOFS.COM</text>
    <line x1="-30" y1="20" x2="30" y2="20" stroke="${textColor}" stroke-opacity="0.35" stroke-width="1.5" />
  </g>

  <!-- Centered Optical Group: Logo Mark + Wordmark + Subline -->
  <g transform="translate(540, 640)">
    <!-- Architectural Chevron Mark (Jobroofs Mark: 1.5px rafter, beam, keystone) -->
    <g transform="translate(0, -95) scale(3.4)">
      <path d="M5 19L16 7L27 19" stroke="${textColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" transform="translate(-16, -16)" />
      <path d="M9.5 19H22.5" stroke="${textColor}" stroke-opacity="0.75" stroke-width="1.2" stroke-linecap="round" transform="translate(-16, -16)" />
      <circle cx="0" cy="-2.5" r="1.8" fill="${textColor}" />
    </g>

    <!-- Main Wordmark -->
    <text x="0" y="45" text-anchor="middle" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" letter-spacing="10">JOBROOFS</text>

    <!-- Subline (Non-negotiable) -->
    <text x="0" y="95" text-anchor="middle" fill="${textColor}" fill-opacity="0.85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" letter-spacing="5">THE PORTAL FOR TEMP JOBS</text>

    <!-- Subtle Divider -->
    <line x1="-40" y1="135" x2="40" y2="135" stroke="${textColor}" stroke-opacity="0.3" stroke-width="1.5" />
  </g>

  <!-- Bottom Subtitle / Manifest -->
  <g transform="translate(540, 1220)">
    <text x="0" y="0" text-anchor="middle" fill="${textColor}" fill-opacity="0.75" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" letter-spacing="3">MINIJOBS • TEMP GIGS • DIRECT CONTACT</text>
  </g>
</svg>`;
}

/**
 * Campaign Poster: Double Color Typographic Poster (Matching the Kiel inspiration layout)
 */
function renderTypographicRolePoster({
  role1 = 'NEED A',
  role2 = 'HELPER?',
  subline = 'MINIJOB &amp; ALLROUNDER',
  tags = '0 € ERSTINSERAT   |   1-KLICK WHATSAPP   |   KEIN ABO',
  buttonText = 'JETZT INSERIEREN',
  bgColor = '#385542',
  textColor = '#F6F4EB',
}) {
  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Color 1 (Background) -->
  <rect width="1080" height="1350" fill="${bgColor}" />

  <!-- Top Header Subtitle -->
  <g transform="translate(540, 160)">
    <text x="0" y="0" text-anchor="middle" fill="${textColor}" fill-opacity="0.8" font-family="ui-monospace, monospace" font-size="14" font-weight="600" letter-spacing="4">JOBROOFS.COM</text>
    <line x1="-35" y1="25" x2="35" y2="25" stroke="${textColor}" stroke-opacity="0.45" stroke-width="1.5" />
  </g>

  <!-- Massive Hero Typography (Exact Reference Style: Huge, Ultra-Bold Grotesk) -->
  <g transform="translate(540, 480)">
    <!-- Line 1 -->
    <text x="0" y="0" text-anchor="middle" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="124" font-weight="900" letter-spacing="-2.5" line-height="0.95">${escapeXml(role1)}</text>
    <!-- Line 2 -->
    <text x="0" y="125" text-anchor="middle" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="124" font-weight="900" letter-spacing="-2.5" line-height="0.95">${escapeXml(role2)}</text>

    <!-- Subtitle below hero -->
    <text x="0" y="225" text-anchor="middle" fill="${textColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" letter-spacing="4.5">${escapeXml(subline)}</text>

    <!-- Keyword Tags Row -->
    <text x="0" y="325" text-anchor="middle" fill="${textColor}" fill-opacity="0.85" font-family="ui-monospace, monospace" font-size="14" font-weight="600" letter-spacing="3.5">${escapeXml(tags)}</text>
  </g>

  <!-- Pill Button (Matching the Kiel inspiration button) -->
  <g transform="translate(540, 990)">
    <rect x="-240" y="0" width="480" height="78" rx="39" fill="${textColor}" />
    <text x="0" y="48" text-anchor="middle" fill="${bgColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" letter-spacing="4">${escapeXml(buttonText)}</text>
  </g>

  <!-- Bottom Brand Footer: Logo + Tagline -->
  <g transform="translate(540, 1220)">
    <g transform="translate(-165, -12) scale(1.4)">
      <path d="M5 19L16 7L27 19" stroke="${textColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.5 19H22.5" stroke="${textColor}" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" />
      <circle cx="16" cy="13.5" r="1.5" fill="${textColor}" />
    </g>
    <line x1="-120" y1="-1" x2="-120" y2="21" stroke="${textColor}" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="-105" y="15" fill="${textColor}" fill-opacity="0.85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="3">DAS PORTAL FÜR TEMPORÄRE JOBS</text>
  </g>
</svg>`;
}

function renderSvgToPng(svgString) {
  const resvg = new Resvg(svgString, { fitTo: { mode: 'width', value: 1080 } });
  return resvg.render().asPng();
}

function generateCampaign() {
  const outDir = path.join(__dirname, '../reports/double-color-campaign');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const posts = [
    {
      id: 'post-1-logo-launch-green',
      type: 'logo',
      name: 'Launch Post (Forest Green & Cream)',
      svg: renderLogoLaunchPoster('#385542', '#F6F4EB'),
    },
    {
      id: 'post-1-logo-launch-obsidian',
      type: 'logo',
      name: 'Launch Post (Obsidian Black & Cream)',
      svg: renderLogoLaunchPoster('#0D0D10', '#FAF8F5'),
    },
    {
      id: 'post-2-need-a-helper',
      type: 'role',
      name: 'Need a Helper? (Forest Green & Cream)',
      svg: renderTypographicRolePoster({
        role1: 'NEED A',
        role2: 'HELPER?',
        subline: 'MINIJOB & ALLROUNDER',
        tags: '0 € ERSTINSERAT   |   1-KLICK WHATSAPP   |   KEIN ABO',
        buttonText: 'POST AT JOBROOFS',
        bgColor: '#385542',
        textColor: '#F6F4EB',
      }),
    },
    {
      id: 'post-3-need-a-barista',
      type: 'role',
      name: 'Need a Barista? (Warm Clay & Off-White)',
      svg: renderTypographicRolePoster({
        role1: 'NEED A',
        role2: 'BARISTA?',
        subline: 'CAFÉ, BAR & SERVICE GIGS',
        tags: 'DIREKTKONTAKT   |   OHNE AGENTUR   |   1. INSERAT GRATIS',
        buttonText: 'POST AT JOBROOFS',
        bgColor: '#4A3728',
        textColor: '#F7F4EE',
      }),
    },
    {
      id: 'post-4-need-a-driver',
      type: 'role',
      name: 'Need a Driver? (Deep Navy & Crisp Cream)',
      svg: renderTypographicRolePoster({
        role1: 'NEED A',
        role2: 'DRIVER?',
        subline: 'LOGISTIK, KURIER & SHUTTLE',
        tags: 'SCHNELLE BESETZUNG   |   0% ZEITARBEIT   |   KIEZ-FILTER',
        buttonText: 'POST AT JOBROOFS',
        bgColor: '#202E39',
        textColor: '#F5F5F0',
      }),
    },
    {
      id: 'post-5-need-a-cook',
      type: 'role',
      name: 'Need a Cook? (Dark Olive & Cream)',
      svg: renderTypographicRolePoster({
        role1: 'NEED A',
        role2: 'COOK?',
        subline: 'KÜCHENHILFE & GASTRO',
        tags: 'SOFORT-KONTAKT   |   1. INSERAT GRATIS   |   2 MIN ONLINE',
        buttonText: 'POST AT JOBROOFS',
        bgColor: '#364434',
        textColor: '#F6F4EB',
      }),
    },
  ];

  const results = [];
  for (const p of posts) {
    const svgPath = path.join(outDir, `${p.id}.svg`);
    const pngPath = path.join(outDir, `${p.id}.png`);
    fs.writeFileSync(svgPath, p.svg);
    const pngBuffer = renderSvgToPng(p.svg);
    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`Rendered ${p.id}.png (${pngBuffer.length} bytes)`);
    results.push({ ...p, svgPath, pngPath });
  }

  return results;
}

module.exports = {
  renderLogoLaunchPoster,
  renderTypographicRolePoster,
  renderSvgToPng,
  generateCampaign,
};

if (require.main === module) {
  generateCampaign();
}
