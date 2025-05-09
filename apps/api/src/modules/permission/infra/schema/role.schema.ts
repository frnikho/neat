import * as p from 'drizzle-orm/pg-core'
import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {uid} from "@core/db";
import {user} from "$user/infra/schema/user.schema";

export const role = p.pgTable('role', {
  id: uid().primaryKey(),
  name: p.varchar({length: 255}).notNull(),
  description: p.text(),
  isActive: p.boolean('is_active').default(true).notNull(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  createdBy: uid('created_by').references(() => user.id, {onDelete: 'set null'}).default('null'),
  updatedAt: p.timestamp('updated_at'),
  updatedBy: uid('updated_by').references(() => user.id, {onDelete: 'set null'}).default('null'),
  deletedAt: p.timestamp('deleted_at'),
  deletedBy: uid('deleted_by').references(() => user.id, {onDelete: 'set null'}).default('null'),
})

export type Role = InferSelectModel<typeof role>;
export type CreateRole = InferInsertModel<typeof role>;