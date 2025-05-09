import { createId } from '@paralleldrive/cuid2'
import {
  pgTable,
  varchar,
  timestamp
} from 'drizzle-orm/pg-core'

export const ContactFormTable = pgTable('contact', {
  id: varchar('abcdef').$defaultFn(() => createId()).primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ContactFormResultTable = pgTable('contact_result', {
  id: varchar('id').$defaultFn(() => createId()).primaryKey(),
  contactId: varchar('contact_id').notNull(),
  status: varchar('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});