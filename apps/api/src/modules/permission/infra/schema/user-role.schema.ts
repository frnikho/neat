import * as p from "drizzle-orm/pg-core";
import {uid} from "@core/db";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {user} from "$user/infra/schema/user.schema";
import { role } from "./role.schema";

export const user_role = p.pgTable('user_role', {
  userId: uid('user_id').references(() => user.id, {onDelete: 'cascade'}),
  roleId: uid('role_id').references(() => role.id, {onDelete: 'cascade'}),
}, (table) => [
  p.primaryKey({columns: [table.userId, table.roleId]}),
]);

export type UserRolePermission = InferSelectModel<typeof user_role>;
export type CreateUserRolePermission = InferInsertModel<typeof user_role>;