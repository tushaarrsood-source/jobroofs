const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function findKeyFile() {
  const root = path.resolve(__dirname, '..');
  const files = fs.readdirSync(root);
  const keyFile = files.find(f => f.startsWith('jobroofs-') && f.endsWith('.json'));
  if (keyFile) return path.join(root, keyFile);
  throw new Error('Key file not found');
}

const key = JSON.parse(fs.readFileSync(findKeyFile(), 'utf8'));

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
  return signInput + '.' + sign.sign(key.private_key, 'base64url');
}

async function trigger() {
  const jwt = createJwt(['https://www.googleapis.com/auth/cloud-platform']);
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const { access_token } = await tokenRes.json();
  const buildId = 'build-' + Date.now();
  const url = 'https://firebaseapphosting.googleapis.com/v1/projects/jobroofs-321c7/locations/europe-west4/backends/jobroofs/builds?buildId=' + buildId;

  console.log('Triggering build:', buildId);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source: {
        codebase: {
          branch: 'main'
        }
      }
    })
  });
  const data = await res.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

trigger().catch(console.error);
