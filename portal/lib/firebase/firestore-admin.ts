import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

const DEFAULT_KEY_B64 =
  'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiam9icm9vZnMtMzIxYzciLAogICJwcml2YXRlX2tleV9pZCI6ICI5N2JmYzhhM2NiOTA1OGEwMmFhNjc2NGE3YWUxYjY0MWY2ZDc0M2M3IiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5NSUlFdkFJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0JLWXdnZ1NpQWdFQUFvSUJBUUNnN3dXL2QxV3hadmZmXG5rSTIrSFAxbGRiS2M0TzdKeXc5R29NYzhldmhjNmN3aFZqZVpITFppVnZibTZVWDZxL1M1akprT1VWRGVHZWNoXG5zYTN2bTFKdSt1cjQ1Z0x2NEtjc1NmT2xGUHVsUWJmRWhKc1B4empaazVFY1RTbFBaVlhFdTk3c3RoWDJ1Rld1XG43Z2IzQzBSaFBRZ0dMS3pJT1NZNU50N2RIRmZWZ09aWm5TM2lKU1BLblZMVDI1amMxTEZrVkhERkh4OU1iVHVwXG42UnlHcVNzd0UvSmxtNENvUGhBaWRXV1U2V2crS2hHbnEvcVdyQlV3alZOV0c5NkFiU3UvWXRKbVhMbXF3Z0VRXG5oOGxZQmh4ZFpYTk02azV0eGdha1k2TWNwUjdySkVZOERzaTBpR1JkaUQ5Yk95NjNKMGNveVVDSVFpYUdVTkd1XG54VVlYMDNNTkFnTUJBQUVDZ2dFQU5iT3MrbGdxNnpqTjYvZERwVFh0UktjQ3hDQzI3ZlZwa29yaUVRZUR5eFZsXG5QWmFVbE80azJpbmsxK2J0cUJrclg2TlFDNXdNM1NCTnBVdXlHK3Q3bFhiN1k3VDFNL0NHT0Z3eEJsdzdJTWtPXG5ObkI5Z2NWYjdoYTA3SG0vR0RSYmEzdTVoc200Q0kwNFlsZ2hVTnljbzhvRzNIQ1o4M0pHay84QVhVNHc3UmcvXG5wV1NMaUplL0tjR2FYUmhJTjBoUklFZWRJdlkzN2JLdFd6TUVXRnFZT0JZRWw2RytvMTlsSTA0ZktUZDZkaEhZXG4yU0xQdk5tQjNRaDZRTWk4QlhudmFHbGtKd215VUdFcHRIVURua3ZWaTFKTjBiZTgvRVFBb3hjS1pEWGM0bVl5XG41OW8xWVFiazdlWVh5cUFIOE9MQkZ0cVBrYlNuZzN6YTVrc3pyVEE4RFFLQmdRRFZKNElhSHpBWTVrdFFGeWpSXG5HdCtpUysxZjBiRWg0MVphTURVSnZNK1p0THprS1BpS25oSC9qTDQyRWJPR0VxQnA4dGFBZStJSlNhTlNlcGgxXG5qOUcyb3BmTERYUlYyekZSaG5PYzZoUEYrQTBicll5UENCY3pBbjVTRnZwUzlLRjA1aVB0ZkVtRUNCNkt0ajdMXG5pZS8wWmdTdTFXckE3bWNDb2xRUWMzZ3N4d0tCZ1FEQlNGaFYvaXpIS3BnNDU1VHpHVDVBa2VRbkFwVzR1R1FSXG41NlIyZkJaUTZqU1l3a1RqVWdNS2JsSlZGY1pSRkNJNG83QkF6ckpxVVJ1SFEzT2U1d0kvODM4VnQ2S1NIbjVkXG5YZ0k5TFY3anhLdGNMUW5Ja3lCQ2R1RTJ0elhMSVBUTHowdlpuL3RKTmZKZHEvUDh6dHRvVS9aWm41Z1FnQlpQXG5pMXUwc2ZMRml3S0JnQWxQeTRnMm1wUkw0emhoZXAvLzY0c2NoQWN1a3UxbkVBdXFsWGFTY0FOSCtRU0NvYkQwXG5qTmE4SUVjZWFOaFBrZ0J1NGw0RWkzQmFiaThaT2ZYUXpabUw2dE90QjhzRVkxZ3JabnVSWWtIQXYxblpNQTNEXG5qYmZsd1B6M0VnSnp1Mlh1ODl6WkZDRVhkYllibGd5d1B2SlBUcDhRcGJROTlmUVFnVm1pb2JwYkFvR0FUR1k5XG5USmh3dUxVMGdHSEJ0YW5IdXB3d1U5OG9zV0JwWmM1cmFzNDN2L29qbWpKSUtwYXpUdjgybWgxR1M2d3FycnE5XG5JNURRWTBmMkdxeGwybXl6cmZXZ3lVUFNCZkg1dnd3MjFGbkh4VDVyQWI5bnU1bTBTYkZWNmx2VzdwanpTbENCXG5TZDk3NDM5b2N2QlNQQjdFQ1dRTzMzUS9GbDZhOHd4QnpwWDhRV3NDZ1lBc2hDV3dmY3R2akQxdmRseUk4Qlc2XG5IZ1pQaVRkTlVrMnAyaFlXUTBDdmhrT0NBaER5RE9jdm9XVnJBZG9iNDZkRm93bXRqdGUwV3Y5WkdBbjhpdlY3XG52UGNyaW9RT1NSVVl6MXR0Znk1ZG9mVEl4T21sK2R0TG0yelUyYlZTUHpaKzBDT2lHWDByWTJ6SzB1OUd6QWlHXG5jRDdMUWhURStmOU9TOUt3OGlEV3BRPT1cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJzZWFyY2gtY29uc29sZS1hZ2VudEBqb2Jyb29mcy0zMjFjNy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgImNsaWVudF9pZCI6ICIxMDExMzA1NzQzODcxMzc4MTU1NzQiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L3NlYXJjaC1jb25zb2xlLWFnZW50JTQwam9icm9vZnMtMzIxYzcuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0K';

function getServiceAccountKey(): any | null {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
      return JSON.parse(json);
    } catch (e) {
      console.warn('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY env var:', e);
    }
  }

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
    } catch {}
  }

  try {
    return JSON.parse(Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf8'));
  } catch {
    return null;
  }
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
  return signInput + '.' + sign.sign(key.private_key, 'base64url');
}

async function getAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const key = getServiceAccountKey();
  if (!key) {
    console.warn('[Firestore Admin] No service account key found.');
    return null;
  }

  try {
    const jwt = createJwt(key, [
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/cloud-platform',
    ]);
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
    console.error('[Firestore Admin] Token error:', data);
    return null;
  } catch (err) {
    console.error('[Firestore Admin] Failed to fetch access token:', err);
    return null;
  }
}

function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string') {
      fields[k] = { stringValue: v };
    } else if (typeof v === 'number') {
      fields[k] = Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    } else if (typeof v === 'boolean') {
      fields[k] = { booleanValue: v };
    } else if (Array.isArray(v)) {
      fields[k] = {
        arrayValue: {
          values: v.map((item) => {
            if (typeof item === 'object' && item !== null) {
              return { mapValue: { fields: toFirestoreFields(item) } };
            }
            return { stringValue: String(item) };
          }),
        },
      };
    } else if (typeof v === 'object') {
      fields[k] = { mapValue: { fields: toFirestoreFields(v) } };
    }
  }
  return fields;
}

function fromFirestoreDoc(doc: any): any {
  if (!doc || !doc.fields) return null;
  const res: Record<string, any> = {};
  for (const [k, v] of Object.entries(doc.fields as Record<string, any>)) {
    if (v.stringValue !== undefined) res[k] = v.stringValue;
    else if (v.integerValue !== undefined) res[k] = parseInt(v.integerValue, 10);
    else if (v.doubleValue !== undefined) res[k] = v.doubleValue;
    else if (v.booleanValue !== undefined) res[k] = v.booleanValue;
    else if (v.arrayValue?.values) {
      res[k] = v.arrayValue.values.map((val: any) => {
        if (val.mapValue?.fields) return fromFirestoreDoc(val.mapValue);
        return val.stringValue ?? val.integerValue ?? val.doubleValue ?? val.booleanValue ?? val;
      });
    } else if (v.mapValue?.fields) {
      res[k] = fromFirestoreDoc(v.mapValue);
    } else if (v.timestampValue) {
      res[k] = v.timestampValue;
    }
  }
  return res;
}

const PROJECT_ID = 'jobroofs-321c7';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export async function adminCreateJob(jobData: any, customId?: string): Promise<any | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const id = customId || jobData.id || `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const slug = jobData.slug || id;
  const url = `${BASE_URL}/jobs/${id}`;

  const payload = {
    ...jobData,
    id,
    slug,
    status: jobData.status || 'active',
    createdAt: jobData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: toFirestoreFields(payload),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Firestore Admin] Create job failed:', res.status, err);
      return null;
    }

    const doc = await res.json();
    return fromFirestoreDoc(doc) || payload;
  } catch (err) {
    console.error('[Firestore Admin] Create job exception:', err);
    return null;
  }
}

export async function adminGetJobBySlugOrId(slugOrId: string): Promise<any | null> {
  if (!slugOrId) return null;
  const token = await getAccessToken();
  if (!token) return null;

  try {
    // 1. Try direct ID lookup
    const directRes = await fetch(`${BASE_URL}/jobs/${slugOrId}`, {
      headers: { Authorization: 'Bearer ' + token },
    });
    if (directRes.ok) {
      const doc = await directRes.json();
      return fromFirestoreDoc(doc);
    }

    // 2. Query by slug field
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
    const qRes = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'jobs' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: slugOrId },
            },
          },
          limit: 1,
        },
      }),
    });

    if (qRes.ok) {
      const items = await qRes.json();
      if (Array.isArray(items) && items.length > 0 && items[0].document) {
        return fromFirestoreDoc(items[0].document);
      }
    }
  } catch (err) {
    console.error('[Firestore Admin] Error fetching job:', err);
  }
  return null;
}

export async function adminGetJobs(limitCount = 50): Promise<any[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
    const qRes = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'jobs' }],
          limit: limitCount,
        },
      }),
    });

    if (qRes.ok) {
      const items = await qRes.json();
      if (Array.isArray(items)) {
        return items
          .filter((i) => i.document)
          .map((i) => fromFirestoreDoc(i.document));
      }
    }
  } catch (err) {
    console.error('[Firestore Admin] Error querying jobs:', err);
  }
  return [];
}

export async function adminDeleteJob(id: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  try {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    return res.ok;
  } catch (err) {
    console.error('[Firestore Admin] Delete job error:', err);
    return false;
  }
}

/**
 * Check whether an account is eligible for the 1st free 30-day job.
 * Enforces:
 * 1. User document hasUsedFreeListing !== true
 * 2. User has 0 existing jobs in the database
 */
export async function adminCheckUserFreeEligibility(userId: string): Promise<{
  isEligibleForFree: boolean;
  existingJobsCount: number;
  reason?: string;
}> {
  if (!userId) {
    return { isEligibleForFree: false, existingJobsCount: 0, reason: 'unauthenticated' };
  }

  const token = await getAccessToken();
  if (!token) {
    // If admin token fails, default to strict false for safety
    return { isEligibleForFree: false, existingJobsCount: 0, reason: 'auth_unavailable' };
  }

  try {
    // 1. Check user profile flag
    const userRes = await fetch(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: 'Bearer ' + token },
      cache: 'no-store',
    });

    if (userRes.ok) {
      const userDoc = await userRes.json();
      const fields = userDoc.fields || {};
      const hasUsed =
        fields.hasUsedFreeListing?.booleanValue === true ||
        fields.firstJobUsed?.booleanValue === true;
      if (hasUsed) {
        return { isEligibleForFree: false, existingJobsCount: 1, reason: 'free_already_used' };
      }
    }

    // 2. Query jobs collection for any existing jobs posted by this userId
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
    const qRes = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'jobs' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'userId' },
              op: 'EQUAL',
              value: { stringValue: userId },
            },
          },
          limit: 10,
        },
      }),
    });

    if (qRes.ok) {
      const items = await qRes.json();
      const validJobs = Array.isArray(items) ? items.filter((i) => i.document) : [];
      if (validJobs.length > 0) {
        return {
          isEligibleForFree: false,
          existingJobsCount: validJobs.length,
          reason: 'existing_jobs_found',
        };
      }
    }

    return { isEligibleForFree: true, existingJobsCount: 0 };
  } catch (err) {
    console.error('[Firestore Admin] Check eligibility error:', err);
    return { isEligibleForFree: false, existingJobsCount: 0, reason: 'error_checking' };
  }
}

/**
 * Permanently mark that a user has used their 1st free listing
 */
export async function adminMarkUserFreeJobUsed(userId: string, jobId?: string): Promise<boolean> {
  if (!userId) return false;
  const token = await getAccessToken();
  if (!token) return false;

  const url = `${BASE_URL}/users/${userId}?updateMask.fieldPaths=hasUsedFreeListing&updateMask.fieldPaths=freeListingJobId&updateMask.fieldPaths=freeListingUsedAt&updateMask.fieldPaths=updatedAt`;

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          hasUsedFreeListing: { booleanValue: true },
          freeListingJobId: { stringValue: jobId || '' },
          freeListingUsedAt: { timestampValue: new Date().toISOString() },
          updatedAt: { timestampValue: new Date().toISOString() },
        },
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[Firestore Admin] Mark free job used error:', err);
    return false;
  }
}

/**
 * Activate a pending job upon verified Stripe payment
 */
export async function adminActivatePaidJob(
  submissionIdOrSlug: string,
  stripeSessionId: string,
  durationDays = 30,
  tier = 'standard'
): Promise<any | null> {
  const token = await getAccessToken();
  if (!token) return null;

  // First find the existing job
  const existingJob = await adminGetJobBySlugOrId(submissionIdOrSlug);
  if (!existingJob) {
    console.error('[Firestore Admin] Job not found to activate:', submissionIdOrSlug);
    return null;
  }

  const docId = existingJob.id;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 86400000).toISOString();

  const url = `${BASE_URL}/jobs/${docId}?updateMask.fieldPaths=status&updateMask.fieldPaths=stripeSessionId&updateMask.fieldPaths=paidAt&updateMask.fieldPaths=expiresAt&updateMask.fieldPaths=tier&updateMask.fieldPaths=updatedAt`;

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          status: { stringValue: 'active' },
          stripeSessionId: { stringValue: stripeSessionId },
          paidAt: { timestampValue: now.toISOString() },
          expiresAt: { timestampValue: expiresAt },
          tier: { stringValue: tier },
          updatedAt: { timestampValue: now.toISOString() },
        },
      }),
    });

    if (res.ok) {
      const updatedDoc = await res.json();
      return fromFirestoreDoc(updatedDoc);
    }
    return null;
  } catch (err) {
    console.error('[Firestore Admin] Activate paid job error:', err);
    return null;
  }
}
