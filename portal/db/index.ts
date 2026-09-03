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

// In-memory local D1 fallback store for local development / testing when Cloudflare D1 binding is not attached
const localTables = new Map<string, Map<string, any>>();

function getLocalTable(name: string) {
  const key = name.toLowerCase();
  if (!localTables.has(key)) {
    localTables.set(key, new Map());
  }
  return localTables.get(key)!;
}

class LocalMockD1PreparedStatement {
  private sql: string;
  private params: any[] = [];

  constructor(sql: string) {
    this.sql = sql;
  }

  bind(...params: any[]) {
    this.params = params;
    return this;
  }

  async run() {
    const trimmed = this.sql.trim();
    // Support INSERT INTO table ...
    const insertMatch = trimmed.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
    if (insertMatch) {
      const table = insertMatch[1];
      const id = this.params[0] || crypto.randomUUID();
      const store = getLocalTable(table);
      store.set(String(id), {
        id,
        params: this.params,
        insertedAt: new Date().toISOString(),
      });
    }

    // Support UPDATE table SET ...
    const updateMatch = trimmed.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
    if (updateMatch) {
      const table = updateMatch[1];
      const store = getLocalTable(table);
      if (this.params.length > 0) {
        const lastParam = String(this.params[this.params.length - 1]);
        if (store.has(lastParam)) {
          const item = store.get(lastParam);
          item.updatedAt = new Date().toISOString();
        }
      }
    }

    return { success: true, meta: { changes: 1 } };
  }

  async first<T = any>(): Promise<T | null> {
    const trimmed = this.sql.trim();
    const selectMatch = trimmed.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (selectMatch) {
      const table = selectMatch[1];
      const store = getLocalTable(table);
      if (this.params.length > 0) {
        const target = String(this.params[0]);
        if (store.has(target)) {
          const item = store.get(target);
          return {
            id: target,
            payload_json: item.params?.[2] || '{}',
            submitter_email: item.params?.[1] || 'dev@kiezjob.de',
            ...item,
          } as unknown as T;
        }
        for (const item of store.values()) {
          if (item.params?.map(String).includes(target)) {
            return {
              id: item.id,
              payload_json: item.params?.[2] || '{}',
              submitter_email: item.params?.[1] || 'dev@kiezjob.de',
              ...item,
            } as unknown as T;
          }
        }
      }
    }
    return null;
  }

  async all<T = any>(): Promise<{ results: T[]; success: boolean }> {
    const trimmed = this.sql.trim();
    const selectMatch = trimmed.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (selectMatch) {
      const table = selectMatch[1];
      const store = getLocalTable(table);
      const items = Array.from(store.values());
      return { results: items as unknown as T[], success: true };
    }
    return { results: [], success: true };
  }

  async raw<T = any>(): Promise<T[]> {
    return [];
  }
}

class LocalMockD1 {
  prepare(sql: string) {
    return new LocalMockD1PreparedStatement(sql);
  }

  async batch(statements: any[]) {
    return statements.map(() => ({ success: true }));
  }

  async exec(sql: string) {
    return { count: 0, duration: 0 };
  }
}

const localMockD1 = new LocalMockD1();

export function getDb() {
  const d1 = getD1();
  return drizzle(d1, { schema });
}

export function getD1() {
  const env = cfWorkersEnv || (globalThis as any).env;
  if (env && env.DB) {
    return env.DB;
  }
  // In local development or node runtime outside Cloudflare Workers, use local in-memory fallback
  return localMockD1;
}
