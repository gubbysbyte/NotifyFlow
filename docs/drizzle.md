# Drizzle ORM & Drizzle Studio — Setup Guide 🔧

This guide helps you install Drizzle ORM, configure it, and run Drizzle Studio to visually inspect your DB schema and data.

## 1) Install required packages
Run (prefer pnpm):

```bash
pnpm add -D drizzle-kit drizzle-orm
pnpm add -D @drizzle-orm/pg-core
# (pg is already a dependency) 
```

> If you prefer npm: replace `pnpm add` with `npm i -D`.


## 2) Files added to this repo
- `drizzle.config.ts` — Drizzle Kit config using your `.env` DB connection.
- `src/db/schema.ts` — Example `notifications` table defined with Drizzle DSL.
- `src/db/drizzle.ts` — Small wrapper that exports `db` (Drizzle connected to your Postgres).

These were added so Studio has a schema to show and you can start writing queries through Drizzle.

## 3) Environment variables
Make sure your `.env` has valid Postgres credentials (already read by `src/config/index.ts`):

```
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=notifyflow
# or set DATABASE_URL
```

If you prefer a single connection string, set `DATABASE_URL`.

## 4) Commands (scripts)
You can start Drizzle Studio with:

```bash
pnpm drizzle:studio
# or directly:
npx drizzle-kit studio --config drizzle.config.ts
```

Other useful commands:
- `pnpm drizzle:generate` — generate migrations or SQL from your schema (depends on your Drizzle Kit setup)
- `pnpm drizzle:push` — push migrations to DB


## 5) How to use Studio
1. Run the above `drizzle:studio` command.
2. In the Studio UI, connect using the connection string (it should be picked up from `drizzle.config.ts`).
3. Explore schema, run queries, and inspect rows.


## 6) Tips
- If you want Drizzle to manage your database tables and migrations, move schema definitions into `src/db/schema.ts` and use `drizzle-kit` generate/push commands.
- For production, review connection pooling and reuse a single `Pool` across your app (you can export the pool from `src/db/index.ts` and reuse it in `src/db/drizzle.ts`).

---
If you want, I can also:
- Add a migration for the `notifications` table and a `pnpm migrate` script, or
- Wire `src/db/index.ts` to export a single pool and use it with Drizzle (reduces duplicate pools).

Reply with **migrate** or **single-pool** (or **none**) and I’ll implement it. ✅
