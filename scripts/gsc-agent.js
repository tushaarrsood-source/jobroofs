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

// Search Console APIs
async function listSites(token) {
  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function listSitemaps(token, siteUrl) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function submitSitemap(token, siteUrl, feedpath) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 204) return { success: true, message: 'Sitemap submitted successfully' };
  return res.json();
}

async function queryPerformance(token, siteUrl, days = 28) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const startDate = start.toISOString().split('T')[0];
  const endDate = end.toISOString().split('T')[0];

  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 25
    })
  });
  return res.json();
}

async function inspectUrl(token, siteUrl, inspectionUrl) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl
    })
  });
  return res.json();
}

// Indexing API (Instant notification for Googlebot)
async function notifyIndex(token, url, type = 'URL_UPDATED') {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      type
    })
  });
  return res.json();
}

// Main CLI command router
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'status';

  console.log(`🔑 Service Account: ${key.client_email}`);
  console.log(`🔐 Project: ${key.project_id}\n`);

  try {
    const token = await getAccessToken();

    if (cmd === 'status') {
      console.log('📡 Fetching Search Console Sites...');
      const sites = await listSites(token);
      console.log(JSON.stringify(sites, null, 2));

    } else if (cmd === 'sitemaps') {
      const siteUrl = args[1] || 'sc-domain:jobroofs.com';
      console.log(`🗺️ Checking sitemaps for ${siteUrl}...`);
      const res = await listSitemaps(token, siteUrl);
      console.log(JSON.stringify(res, null, 2));

    } else if (cmd === 'submit-sitemap') {
      const siteUrl = args[1] || 'sc-domain:jobroofs.com';
      const sitemapUrl = args[2] || 'https://jobroofs.com/sitemap.xml';
      console.log(`🚀 Submitting ${sitemapUrl} to ${siteUrl}...`);
      const res = await submitSitemap(token, siteUrl, sitemapUrl);
      console.log(JSON.stringify(res, null, 2));

    } else if (cmd === 'performance') {
      const siteUrl = args[1] || 'sc-domain:jobroofs.com';
      console.log(`📈 Querying performance for ${siteUrl}...`);
      const res = await queryPerformance(token, siteUrl);
      console.log(JSON.stringify(res, null, 2));

    } else if (cmd === 'inspect') {
      const url = args[1] || 'https://jobroofs.com/';
      const siteUrl = args[2] || 'sc-domain:jobroofs.com';
      console.log(`🔍 Inspecting URL: ${url}...`);
      const res = await inspectUrl(token, siteUrl, url);
      console.log(JSON.stringify(res, null, 2));

    } else if (cmd === 'index-url') {
      const url = args[1] || 'https://jobroofs.com/';
      console.log(`⚡ Sending instant index notification for ${url}...`);
      const res = await notifyIndex(token, url, 'URL_UPDATED');
      console.log(JSON.stringify(res, null, 2));

    } else {
      console.log(`Unknown command: ${cmd}`);
      console.log('Available commands: status, sitemaps, submit-sitemap, performance, inspect [url], index-url [url]');
    }
  } catch (err) {
    console.error('❌ Error executing command:', err.message);
  }
}

main();
