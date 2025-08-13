import { uid } from "@infra/utils/db.utils";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import { permission } from "./permission.schema";
import { role } from "./role.schema";

export const role_permission = p.pgTable(
	"role_permission",
	{
		roleId: uid("role_id").references(() => role.id, { onDelete: "cascade" }),
		permissionId: uid("permission_id").references(() => permission.id, {
			onDelete: "cascade",
		}),
	},
	(table) => [p.primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export type RolePermission = InferSelectModel<typeof role_permission>;
export type CreateRolePermission = InferInsertModel<typeof role_permission>;
