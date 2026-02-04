import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

// Build connection string from DATABASE_URL or individual POSTGRES_* variables.
let connectionString = process.env.DATABASE_URL || '';
if (!connectionString && process.env.POSTGRES_USER) {
  connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD || 'password'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'notifyflow'}`;
}

// Optionally allow setting SSL mode via PGSSLMODE (e.g. 'require'). This appends an sslmode query parameter
if (process.env.PGSSLMODE && connectionString && !/sslmode=/i.test(connectionString)) {
  connectionString += (connectionString.includes('?') ? '&' : '?') + `sslmode=${process.env.PGSSLMODE}`;
}

if (!connectionString) {
  throw new Error('No database connection configured. Set DATABASE_URL or POSTGRES_* environment variables.');
}

const config: Config = {
  // Accept an array so you can add multiple schema files later
  schema: ['./src/db/schema.ts'],
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString,
  },
};

export default config;

