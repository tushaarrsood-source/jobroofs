const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function findKeyFile() {
  const root = path.resolve(__dirname, '..');
  const files = fs.readdirSync(root);
  const keyFile = files.find(f => f.startsWith('jobroofs-') && f.endsWith('.json'));
  if (keyFile) return path.join(root, keyFile);
  const fallback = path.join(root, 'service-account.json');
  if (fs.existsSync(fallback)) return fallback;
  throw new Error('Could not find Google service account JSON key');
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
  const signature = sign.sign(key.private_key, 'base64url');
  return signInput + '.' + signature;
}

async function getAccessToken() {
  const jwt = createJwt(['https://www.googleapis.com/auth/cloud-platform']);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function checkBuildAndRollout(buildId) {
  const token = await getAccessToken();
  const buildName = `projects/jobroofs-321c7/locations/europe-west4/backends/jobroofs/builds/${buildId}`;

  const buildRes = await fetch(`https://firebaseapphosting.googleapis.com/v1/${buildName}`, {
    headers: { Authorization: 'Bearer ' + token }
  });
  const build = await buildRes.json();
  console.log(`Build ${buildId} Status: ${build.state}`);

  if (build.state === 'FAILED') {
    console.error('❌ Build failed! Details:', JSON.stringify(build.error));
    process.exit(1);
  }

  if (build.state === 'READY') {
    console.log('✅ Build is READY! Creating Rollout to deploy live...');
    const rolloutId = 'r' + Date.now();
    const rolloutRes = await fetch(`https://firebaseapphosting.googleapis.com/v1/projects/jobroofs-321c7/locations/europe-west4/backends/jobroofs/rollouts?rolloutId=${rolloutId}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        build: buildName
      })
    });
    const rolloutData = await rolloutRes.json();
    console.log('Rollout creation response:', JSON.stringify(rolloutData, null, 2));
    return { state: 'ROLLING_OUT', rolloutId };
  }

  return { state: build.state };
}

const buildId = process.argv[2] || 'b1789303291351';
checkBuildAndRollout(buildId).catch(console.error);
