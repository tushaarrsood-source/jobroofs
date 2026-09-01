export function getIngestionAuthReadiness() {
  return {
    configured: Boolean(process.env.INGESTION_API_KEY),
    keyName: 'INGESTION_API_KEY',
    mode: process.env.INGESTION_API_KEY ? 'bearer_protected' : 'fail_closed',
  } as const;
}

export async function isAuthorizedIngestionRequest(request: Request) {
  const expected = process.env.INGESTION_API_KEY;
  if (!expected) return false;
  const authorization = request.headers.get('authorization');
  const presented = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';
  if (!presented) return false;

  const [expectedDigest, presentedDigest] = await Promise.all([
    digest(expected),
    digest(presented),
  ]);
  let difference = 0;
  for (let index = 0; index < expectedDigest.length; index += 1)
    difference |= expectedDigest[index] ^ presentedDigest[index];
  return difference === 0;
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
}
