import {AnyPgColumn, jsonb, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {uid} from "@core/db";
import {sql} from "drizzle-orm";
import {user} from "$user/infra/schema/user.schema";

export const settings = pgTable('settings', {
    id: uid().primaryKey(),
    name: varchar({length: 255}).notNull(),
    key: varchar({length: 255}).notNull().unique(),
    value: jsonb().notNull(),
    description: varchar({length: 255}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
    updatedBy: varchar('updated_by').references((): AnyPgColumn => user.id, {onDelete: 'set null'}).default(sql`NULL`),
    deletedAt: timestamp('deleted_at'),
    deletedBy: varchar('deleted_by').references((): AnyPgColumn => user.id, {onDelete: 'set null'}).default(sql`NULL`),
});