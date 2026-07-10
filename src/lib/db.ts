import { createClient } from "@libsql/client/web";

const TURSO_DB_URL = import.meta.env.VITE_TURSO_DB_URL;
const TURSO_AUTH_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!_client) {
    _client = createClient({
      url: TURSO_DB_URL!,
      authToken: TURSO_AUTH_TOKEN!,
    });
  }
  return _client;
}

export const turso = {
  execute: (sql: string, args?: any[]) => {
    if (!TURSO_DB_URL || !TURSO_AUTH_TOKEN) {
      return Promise.reject(new Error("Turso DB not configured"));
    }
    const client = getClient();
    return client.execute({ sql: sql.trim(), args });
  },
};

export async function queryAll<T = Record<string, unknown>>(sql: string, args?: any[]): Promise<T[]> {
  const result = await turso.execute(sql, args);
  return result.rows as unknown as T[];
}

export async function queryOne<T = Record<string, unknown>>(sql: string, args?: any[]): Promise<T | null> {
  const result = await turso.execute(sql, args);
  return (result.rows[0] as unknown as T) ?? null;
}

export function isTursoConfigured(): boolean {
  return !!(TURSO_DB_URL && TURSO_AUTH_TOKEN);
}
