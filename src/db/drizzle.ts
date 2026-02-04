import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '../config/index.js';

/**
 * Lightweight wrapper exposing a Drizzle `db` instance.
 * Note: this creates its own Pool — if you want a single shared pool, import and reuse the Pool from `src/db/index.ts`.
 */
const pool = new Pool(config.postgres);
export const db = drizzle(pool);

export type DB = typeof db;
