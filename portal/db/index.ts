import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

let cfWorkersEnv: any = null;
try {
  // Dynamically import cloudflare:workers so Node runtime doesn't crash on unrecognized scheme
  // @ts-ignore
  const mod = await import('cloudflare:workers');
  cfWorkersEnv = mod?.env;
} catch {
  // Outside Cloudflare runtime (Node.js fallback)
}

export function getDb() {
  const d1 = getD1();

  return drizzle(d1, { schema });
}

export function getD1() {
  const env = cfWorkersEnv || (globalThis as any).env;
  if (!env || !env.DB) {
    throw new Error(
      'Cloudflare D1 binding `DB` is unavailable. In local development or node runtime, preview data is used.',
    );
  }
  return env.DB;
}
