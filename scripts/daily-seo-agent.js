const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Locate key file
function findKeyFile() {
  const root = path.resolve(__dirname, '..');
  const files = fs.readdirSync(root);
  const keyFile = files.find(f => f.startsWith('jobroofs-') && f.endsWith('.json'));
  if (keyFile) return path.join(root, keyFile);
  const fallback = path.join(root, 'service-account.json');
  if (fs.existsSync(fallback)) return fallback;
  throw new Error('Could not find Google service account JSON key in project root');
}

const keyPath = findKeyFile();
const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/indexing'
];

function createJwt(scopes) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signInput = b64(header) + '.' + b64(claim);
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(key.private_key, 'base64url');
  return signInput + '.' + signature;
}

async function getAccessToken() {
  const jwt = createJwt(SCOPES);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth2 failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function runDailyAudit() {
  const timestamp = new Date().toISOString();
  console.log(`====================================================`);
  console.log(`📅 RUNNING DAILY SEO & GOOGLE RANKING AUDIT`);
  console.log(`⏱️ Timestamp: ${timestamp}`);
  console.log(`🌐 Target: sc-domain:jobroofs.com`);
  console.log(`====================================================\n`);

  const token = await getAccessToken();

  // 1. Sitemaps check & refresh
  console.log('1️⃣ Checking and synchronizing Sitemaps...');
  const sitemapsRes = await fetch('https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ajobroofs.com/sitemaps', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const sitemapsData = await sitemapsRes.json();
  const mainSitemap = sitemapsData.sitemap ? sitemapsData.sitemap[0] : null;
  console.log(`   - Last Downloaded by Google: ${mainSitemap?.lastDownloaded || 'N/A'}`);
  console.log(`   - Submitted URLs: ${mainSitemap?.contents?.[0]?.submitted || 'N/A'}`);
  console.log(`   - Errors: ${mainSitemap?.errors || '0'}, Warnings: ${mainSitemap?.warnings || '0'}`);

  // 2. Query Search Performance (Past 28 Days & Past 7 Days)
  console.log('\n2️⃣ Querying Search Analytics & Keyword Rankings...');
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 28);

  const perfRes = await fetch('https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ajobroofs.com/searchAnalytics/query', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      dimensions: ['query'],
      rowLimit: 50
    })
  });
  const perfData = await perfRes.json();
  const queries = perfData.rows || [];
  console.log(`   - Total Ranking Keywords: ${queries.length}`);
  if (queries.length > 0) {
    console.log('   - Top Queries:');
    queries.slice(0, 5).forEach((q, idx) => {
      console.log(`     ${idx + 1}. "${q.keys[0]}" — Clicks: ${q.clicks}, Impr: ${q.impressions}, Pos: ${q.position.toFixed(1)}`);
    });
  } else {
    console.log('   - Note: Site is newly indexed today; impressions will populate within 24-48h.');
  }

  // 3. Inspect Core Routes
  console.log('\n3️⃣ Inspecting Core Landing Pages...');
  const coreUrls = [
    'https://jobroofs.com/',
    'https://jobroofs.com/?city=berlin',
    'https://jobroofs.com/?city=muenchen',
    'https://jobroofs.com/pricing'
  ];

  const inspectionReport = [];
  for (const url of coreUrls) {
    try {
      const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl: 'sc-domain:jobroofs.com'
        })
      });
      const data = await res.json();
      const status = data.inspectionResult?.indexStatusResult;
      const coverage = status?.coverageState || 'UNKNOWN';
      inspectionReport.push({ url, coverage });
      console.log(`   - ${url}: ${coverage}`);
    } catch (e) {
      console.log(`   - ${url}: Inspection failed`);
    }
  }

  // 4. Save report
  const reportsDir = path.resolve(__dirname, '..', 'reports', 'seo-daily');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  const dateStr = new Date().toISOString().split('T')[0];
  const reportPath = path.join(reportsDir, `seo-report-${dateStr}.json`);
  const reportContent = {
    timestamp,
    sitemap: mainSitemap,
    keywordCount: queries.length,
    topQueries: queries.slice(0, 10),
    coreUrls: inspectionReport
  };
  fs.writeFileSync(reportPath, JSON.stringify(reportContent, null, 2), 'utf8');
  console.log(`\n💾 Daily SEO report saved to: ${reportPath}`);
  console.log(`====================================================\n`);
  return reportContent;
}

if (require.main === module) {
  runDailyAudit().catch(console.error);
}

module.exports = { runDailyAudit };
