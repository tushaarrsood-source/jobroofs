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

const imgBuffer = fs.readFileSync('test-photo.jpg');
const base64Img = 'data:image/jpeg;base64,' + imgBuffer.toString('base64');

const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="${base64Img}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice" />
  <rect width="1080" height="1350" fill="black" fill-opacity="0.4" />
  <text x="100" y="500" fill="white" font-family="sans-serif" font-size="60" font-weight="bold">TEST OVERLAY</text>
</svg>`;

const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } });
const png = resvg.render().asPng();
fs.writeFileSync('test-rendered.png', png);
console.log('SUCCESS, size:', fs.statSync('test-rendered.png').size);
