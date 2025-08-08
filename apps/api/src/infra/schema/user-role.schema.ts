import * as p from "drizzle-orm/pg-core";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import { role } from "./role.schema";
import {uid} from "@infra/utils/db.utils";
import {user} from "@schema/user.schema";

export const user_role = p.pgTable('user_role', {
    userId: uid('user_id').references(() => user.id, {onDelete: 'cascade'}).notNull(),
    roleId: uid('role_id').references(() => role.id, {onDelete: 'cascade'}).notNull(),
}, (table) => [
    p.primaryKey({columns: [table.userId, table.roleId]}),
]);

export type UserRolePermission = InferSelectModel<typeof user_role>;
export type CreateUserRolePermission = InferInsertModel<typeof user_role>;