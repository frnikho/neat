import * as p from 'drizzle-orm/pg-core'
import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {uid} from "@core/db";
import {user} from "$user/infra/schema/user.schema";

export const permission = p.pgTable('permission', {
  id: uid().primaryKey(),
  name: p.varchar({length: 255}).notNull(),
  description: p.text(),
  resource: p.varchar({length: 255}).notNull(),
  action: p.varchar({length: 255}).notNull(),
  attributes: p.jsonb(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  createdBy: uid('created_by').references(() => user.id, {onDelete: 'set null'}),
  updatedAt: p.timestamp('updated_at'),
  updatedBy: uid('updated_by').references(() => user.id, {onDelete: 'set null'}),
  deletedAt: p.timestamp('deleted_at'),
  deletedBy: uid('deleted_by').references(() => user.id, {onDelete: 'set null'}),
})

export type Permission = InferSelectModel<typeof permission>;
export type CreatePermission = InferInsertModel<typeof permission>;