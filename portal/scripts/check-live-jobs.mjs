import crypto from 'crypto';

const keyB64 = 'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiam9icm9vZnMtMzIxYzciLAogICJwcml2YXRlX2tleV9pZCI6ICI5N2JmYzhhM2NiOTA1OGEwMmFhNjc2NGE3YWUxYjY0MWY2ZDc0M2M3IiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5NSUlFdkFJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0JLWXdnZ1NpQWdFQUFvSUJBUUNnN3dXL2QxV3hadmZmXG5rSTIrSFAxbGRiS2M0TzdKeXc5R29NYzhldmhjNmN3aFZqZVpITFppVnZibTZVWDZxL1M1akprT1VWRGVHZWNoXG5zYTN2bTFKdSt1cjQ1Z0x2NEtjc1NmT2xGUHVsUWJmRWhKc1B4empaazVFY1RTbFBaVlhFdTk3c3RoWDJ1Rld1XG43Z2IzQzBSaFBRZ0dMS3pJT1NZNU50N2RIRmZWZ09aWm5TM2lKU1BLblZMVDI1amMxTEZrVkhERkh4OU1iVHVwXG42UnlHcVNzd0UvSmxtNENvUGhBaWRXV1U2V2crS2hHbnEvcVdyQlV3alZOV0c5NkFiU3UvWXRKbVhMbXF3Z0VRXG5oOGxZQmh4ZFpYTk02azV0eGdha1k2TWNwUjdySkVZOERzaTBpR1JkaUQ5Yk95NjNKMGNveVVDSVFpYUdVTkd1XG54VVlYMDNNTkFnTUJBQUVDZ2dFQU5iT3MrbGdxNnpqTjYvZERwVFh0UktjQ3hDQzI3ZlZwa29yaUVRZUR5eFZsXG5QWmFVbE80azJpbmsxK2J0cUJrclg2TlFDNXdNM1NCTnBVdXlHK3Q3bFhiN1k3VDFNL0NHT0Z3eEJsdzdJTWtPXG5ObkI5Z2NWYjdoYTA3SG0vR0RSYmEzdTVoc200Q0kwNFlsZ2hVTnljbzhvRzNIQ1o4M0pHay84QVhVNHc3UmcvXG5wV1NMaUplL0tjR2FYUmhJTjBoUklFZWRJdlkzN2JLdFd6TUVXRnFZT0JZRWw2RytvMTlsSTA0ZktUZDZkaEhZXG4yU0xQdk5tQjNRaDZRTWk4QlhudmFHbGtKd215VUdFcHRIVURua3ZWaTFKTjBiZTgvRVFBb3hjS1pEWGM0bVl5XG41OW8xWVFiazdlWVh5cUFIOE9MQkZ0cVBrYlNuZzN6YTVrc3pyVEE4RFFLQmdRRFZKNElhSHpBWTVrdFFGeWpSXG5HdCtpUysxZjBiRWg0MVphTURVSnZNK1p0THprS1BpS25oSC9qTDQyRWJPR0VxQnA4dGFBZStJSlNhTlNlcGgxXG5qOUcyb3BmTERYUlYyekZSaG5PYzZoUEYrQTBicll5UENCY3pBbjVTRnZwUzlLRjA1aVB0ZkVtRUNCNkt0ajdMXG5pZS8wWmdTdTFXckE3bWNDb2xRUWMzZ3N4d0tCZ1FEQlNGaFYvaXpIS3BnNDU1VHpHVDVBa2VRbkFwVzR1R1FSXG41NlIyZkJaUTZqU1l3a1RqVWdNS2JsSlZGY1pSRkNJNG83QkF6ckpxVVJ1SFEzT2U1d0kvODM4VnQ2S1NIbjVkXG5YZ0k5TFY3anhLdGNMUW5Ja3lCQ2R1RTJ0elhMSVBUTHowdlpuL3RKTmZKZHEvUDh6dHRvVS9aWm41Z1FnQlpQXG5pMXUwc2ZMRml3S0JnQWxQeTRnMm1wUkw0emhoZXAvLzY0c2NoQWN1a3UxbkVBdXFsWGFTY0FOSCtRU0NvYkQwXG5qTmE4SUVjZWFOaFBrZ0J1NGw0RWkzQmFiaThaT2ZYUXpabUw2dE90QjhzRVkxZ3JabnVSWWtIQXYxblpNQTNEXG5qYmZsd1B6M0VnSnp1Mlh1ODl6WkZDRVhkYllibGd5d1B2SlBUcDhRcGJROTlmUVFnVm1pb2JwYkFvR0FUR1k5XG5USmh3dUxVMGdHSEJ0YW5IdXB3d1U5OG9zV0JwWmM1cmFzNDN2L29qbWpKSUtwYXpUdjgybWgxR1M2d3FycnE5XG5JNURRWTBmMkdxeGwybXl6cmZXZ3lVUFNCZkg1dnd3MjFGbkh4VDVyQWI5bnU1bTBTYkZWNmx2VzdwanpTbENCXG5TZDk3NDM5b2N2QlNQQjdFQ1dRTzMzUS9GbDZhOHd4QnpwWDhRV3NDZ1lBc2hDV3dmY3R2akQxdmRseUk4Qlc2XG5IZ1pQaVRkTlVrMnAyaFlXUTBDdmhrT0NBaER5RE9jdm9XVnJBZG9iNDZkRm93bXRqdGUwV3Y5WkdBbjhpdlY3XG52UGNyaW9RT1NSVVl6MXR0Znk1ZG9mVEl4T21sK2R0TG0yelUyYlZTUHpaKzBDT2lHWDByWTJ6SzB1OUd6QWlHXG5jRDdMUWhURStmOU9TOUt3OGlEV3BRPT1cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICJzZWFyY2gtY29uc29sZS1hZ2VudEBqb2Jyb29mcy0zMjFjNy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgImNsaWVudF9pZCI6ICIxMDExMzA1NzQzODcxMzc4MTU1NzQiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L3NlYXJjaC1jb25zb2xlLWFnZW50JTQwam9icm9vZnMtMzIxYzcuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0K';
const key = JSON.parse(Buffer.from(keyB64, 'base64').toString('utf8'));

const now = Math.floor(Date.now() / 1000);
const header = { alg: 'RS256', typ: 'JWT' };
const claim = {
  iss: key.client_email,
  scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform',
  aud: 'https://oauth2.googleapis.com/token',
  exp: now + 3600,
  iat: now,
};
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const signInput = b64(header) + '.' + b64(claim);
const sign = crypto.createSign('RSA-SHA256');
sign.update(signInput);
const jwt = signInput + '.' + sign.sign(key.private_key, 'base64url');

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  }),
});
const tokenData = await tokenRes.json();
const token = tokenData.access_token;

const qRes = await fetch('https://firestore.googleapis.com/v1/projects/jobroofs-321c7/databases/(default)/documents:runQuery', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    structuredQuery: {
      from: [{ collectionId: 'jobs' }],
      limit: 30
    }
  })
});
const docs = await qRes.json();
console.log('--- FIRESTORE JOBS DUMP ---');
if (Array.isArray(docs)) {
  docs.forEach((d) => {
    if (d.document) {
      const f = d.document.fields;
      console.log({
        id: d.document.name.split('/').pop(),
        title: f.title?.stringValue,
        company: f.company?.stringValue,
        tier: f.tier?.stringValue,
        status: f.status?.stringValue,
        userId: f.userId?.stringValue,
        createdAt: f.createdAt?.stringValue || f.createdAt?.timestampValue,
        expiresAt: f.expiresAt?.stringValue || f.expiresAt?.timestampValue,
      });
    }
  });
} else {
  console.log('Query result:', docs);
}
