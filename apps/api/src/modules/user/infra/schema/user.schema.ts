import {AnyPgColumn, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {uid} from "@core/db";
import {sql} from "drizzle-orm";

export const user = pgTable('user', {
  id: uid().primaryKey(),
  password: varchar().notNull(),
  email: varchar().notNull().unique(),
  firstname: varchar({length: 255}).notNull(),
  lastname: varchar({length: 255}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by').references((): AnyPgColumn => user.id, {onDelete: 'set null'}).default(sql`NULL`),
  updatedAt: timestamp('updated_at'),
  updatedBy: varchar('updated_by').references((): AnyPgColumn => user.id, {onDelete: 'set null'}).default(sql`NULL`),
  deletedAt: timestamp('deleted_at'),
  deletedBy: varchar('deleted_by').references((): AnyPgColumn => user.id, {onDelete: 'set null'}).default(sql`NULL`),
})