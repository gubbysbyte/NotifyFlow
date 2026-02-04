import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * Minimal `notifications` table to monitor notification flows in Drizzle Studio.
 * You can extend fields as needed (e.g., provider_status, attempt_count, metadata JSON).
 */
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 10 }).notNull(),
  "to": text('to').notNull(),
  content: text('content').notNull(),
  status: varchar('status', { length: 20 }).default('queued').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export default { notifications };
