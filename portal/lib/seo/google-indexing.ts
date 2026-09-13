import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Cached token & expiration
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function getServiceAccountKey(): any | null {
  // 1. Try environment variable
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
      return JSON.parse(json);
    } catch (e) {
      console.warn('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY env var:', e);
    }
  }

  // 2. Try file in project root or portal/
  const searchDirs = [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), 'portal'),
  ];

  for (const dir of searchDirs) {
    try {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir);
      const keyFile = files.find(
        (f) =>
          (f.startsWith('jobroofs-') && f.endsWith('.json')) ||
          f === 'service-account.json',
      );
      if (keyFile) {
        const fullPath = path.join(dir, keyFile);
        return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      }
    } catch (e) {
      // Continue searching
    }
  }

  return null;
}

function createJwt(key: any, scopes: string[]) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const b64 = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signInput = b64(header) + '.' + b64(claim);
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(key.private_key, 'base64url');
  return signInput + '.' + signature;
}

export async function getIndexingAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const key = getServiceAccountKey();
  if (key && key.client_email && key.private_key) {
    const jwt = createJwt(key, ['https://www.googleapis.com/auth/indexing']);
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      cachedToken = data.access_token;
      tokenExpiresAt = now + (data.expires_in || 3600) * 1000;
      return cachedToken;
    }
  }

  // 3. Ambient GCP Cloud Run metadata server fallback
  try {
    const metaRes = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      {
        headers: { 'Metadata-Flavor': 'Google' },
      },
    );
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      if (metaData.access_token) {
        cachedToken = metaData.access_token;
        tokenExpiresAt = now + (metaData.expires_in || 3600) * 1000;
        return cachedToken;
      }
    }
  } catch (e) {
    // Not running on GCP metadata server
  }

  return null;
}

/**
 * Publishes a URL to Google's real-time Indexing API.
 * Triggers Googlebot to crawl and rank the page in priority mode within minutes.
 */
export async function notifyGoogleIndexing(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED',
) {
  try {
    const token = await getIndexingAccessToken();
    if (!token) {
      console.warn('[Google Indexing] Could not obtain access token. Skipping instant notification.');
      return { success: false, reason: 'no_token' };
    }

    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        type,
      }),
    });

    const data = await res.json();

    if (res.ok && data.urlNotificationMetadata) {
      console.log(`[Google Indexing] ✅ Successfully notified Googlebot for: ${url}`);
      return { success: true, data };
    } else {
      console.warn(`[Google Indexing] ⚠️ Google API responded:`, data);
      return { success: false, error: data };
    }
  } catch (err: any) {
    console.error(`[Google Indexing] ❌ Error notifying Googlebot for ${url}:`, err.message);
    return { success: false, error: err.message };
  }
}
