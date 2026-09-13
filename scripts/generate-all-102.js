const fs = require('fs');
const path = require('path');
const { renderPostSvg, renderSvgToPng } = require('./generate-100-campaign');

const dataPath = path.join(__dirname, '../data/campaign-100-posts.json');
const posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const outDir = path.join(__dirname, '../reports/campaign-100');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

console.log(`Starting full batch render of ${posts.length} posts...`);
let count = 0;

for (const post of posts) {
  const pngPath = path.join(outDir, `post-${post.id}.png`);
  if (!fs.existsSync(pngPath)) {
    const svg = renderPostSvg(post);
    fs.writeFileSync(pngPath, renderSvgToPng(svg));
    count++;
    if (count % 10 === 0) {
      console.log(`Rendered ${count} new posts (currently at Post #${post.id})...`);
    }
  }
}

console.log(`✅ Finished rendering! Total posts available in ${outDir}: ${posts.length}`);
