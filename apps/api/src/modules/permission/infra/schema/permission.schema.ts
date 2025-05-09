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
  createdAt: p.timestamp().defaultNow().notNull(),
  createdBy: uid().references(() => user.id, {onDelete: 'set null'}).default('null'),
  updatedAt: p.timestamp(),
  updatedBy: uid().references(() => user.id, {onDelete: 'set null'}).default('null'),
  deletedAt: p.timestamp(),
  deletedBy: uid().references(() => user.id, {onDelete: 'set null'}).default('null'),
})

export type Permission = InferSelectModel<typeof permission>;
export type CreatePermission = InferInsertModel<typeof permission>;