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
 * Renders a high-impact double-color typographic poster
 * Matching the exact Sport- und Freizeitcenter Kiel reference layout
 */
function renderPostSvg(post) {
  const { role1, role2, subline, tags, buttonText, palette } = post;
  const { bg, text } = palette;

  // Responsive font sizing based on line length
  const maxLen = Math.max(role1.length, role2.length);
  let fontSize = 120;
  if (maxLen > 12) fontSize = 92;
  else if (maxLen > 10) fontSize = 104;
  else if (maxLen > 8) fontSize = 114;

  const lineSpacing = fontSize * 1.05;

  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Color 1 (Background) -->
  <rect width="1080" height="1350" fill="${bg}" />

  <!-- Top Header Subtitle (Matching reference top element) -->
  <g transform="translate(540, 160)">
    <text x="0" y="0" text-anchor="middle" fill="${text}" fill-opacity="0.75" font-family="'Helvetica Neue', Helvetica, Arial, Roboto, sans-serif" font-size="14" font-weight="700" letter-spacing="4">JOBROOFS.COM</text>
    <line x1="-35" y1="25" x2="35" y2="25" stroke="${text}" stroke-opacity="0.45" stroke-width="1.5" />
  </g>

  <!-- Massive Hero Typography (Exact Reference Style: Ultra-Bold Grotesk) -->
  <g transform="translate(540, 490)">
    <!-- Line 1 -->
    <text x="0" y="0" text-anchor="middle" fill="${text}" font-family="'Helvetica Neue', Helvetica, Arial, Roboto, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-2.5">${escapeXml(role1)}</text>
    
    <!-- Line 2 -->
    <text x="0" y="${lineSpacing}" text-anchor="middle" fill="${text}" font-family="'Helvetica Neue', Helvetica, Arial, Roboto, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-2.5">${escapeXml(role2)}</text>

    <!-- Subtitle below hero -->
    <text x="0" y="${lineSpacing + 100}" text-anchor="middle" fill="${text}" font-family="'Helvetica Neue', Helvetica, Arial, Roboto, sans-serif" font-size="24" font-weight="700" letter-spacing="4.5">${escapeXml(subline)}</text>

    <!-- Keyword Tags Divider Row -->
    <text x="0" y="${lineSpacing + 195}" text-anchor="middle" fill="${text}" fill-opacity="0.85" font-family="ui-monospace, monospace" font-size="14" font-weight="600" letter-spacing="3.5">${escapeXml(tags)}</text>
  </g>

  <!-- Pill Button (Matching the Kiel inspiration button) -->
  <g transform="translate(540, 990)">
    <rect x="-240" y="0" width="480" height="78" rx="39" fill="${text}" />
    <text x="0" y="49" text-anchor="middle" fill="${bg}" font-family="'Helvetica Neue', Helvetica, Arial, Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="4">${escapeXml(buttonText)}</text>
  </g>

  <!-- Bottom Brand Footer: Logo Mark + Tagline -->
  <g transform="translate(540, 1220)">
    <g transform="translate(-165, -12) scale(1.4)">
      <path d="M5 19L16 7L27 19" stroke="${text}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.5 19H22.5" stroke="${text}" stroke-opacity="0.8" stroke-width="1.2" stroke-linecap="round" />
      <circle cx="16" cy="13.5" r="1.5" fill="${text}" />
    </g>
    <line x1="-120" y1="-1" x2="-120" y2="21" stroke="${text}" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="-105" y="15" fill="${text}" fill-opacity="0.85" font-family="'Helvetica Neue', Helvetica, Arial, Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="3">DAS PORTAL FÜR TEMPORÄRE JOBS</text>
  </g>
</svg>`;
}

function renderSvgToPng(svgString) {
  const resvg = new Resvg(svgString, { fitTo: { mode: 'width', value: 1080 } });
  return resvg.render().asPng();
}

function renderPostById(id) {
  const dataPath = path.join(__dirname, '../data/campaign-100-posts.json');
  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const post = posts.find(p => p.id === parseInt(id, 10));
  if (!post) throw new Error(`Post with ID ${id} not found.`);

  const outDir = path.join(__dirname, '../reports/campaign-100');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const svg = renderPostSvg(post);
  const svgPath = path.join(outDir, `post-${post.id}.svg`);
  const pngPath = path.join(outDir, `post-${post.id}.png`);

  fs.writeFileSync(svgPath, svg);
  const pngBuffer = renderSvgToPng(svg);
  fs.writeFileSync(pngPath, pngBuffer);

  console.log(`✅ Rendered Post #${post.id}: "${post.role1} ${post.role2}" -> ${pngPath} (${pngBuffer.length} bytes)`);
  return { post, svgPath, pngPath };
}

function renderBatch(count = 12) {
  const dataPath = path.join(__dirname, '../data/campaign-100-posts.json');
  const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const target = posts.slice(0, count);

  const outDir = path.join(__dirname, '../reports/campaign-100');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const post of target) {
    const svg = renderPostSvg(post);
    const pngPath = path.join(outDir, `post-${post.id}.png`);
    fs.writeFileSync(pngPath, renderSvgToPng(svg));
    console.log(`Rendered Post #${post.id} (${post.colorway}): "${post.role1} ${post.role2}"`);
  }
}

module.exports = {
  renderPostSvg,
  renderSvgToPng,
  renderPostById,
  renderBatch,
};

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--id')) {
    const idIdx = args.indexOf('--id') + 1;
    renderPostById(args[idIdx]);
  } else {
    // Default: render first 12 posts (4 days of content)
    console.log('Rendering first 12 posts (Days 1 to 4)...');
    renderBatch(12);
  }
}
