import type * as entity from "@entity/permission.entity";
import { uid } from "@infra/utils/db.utils";
import { mapOption } from "@infra/utils/type.utils";
import { user } from "@schema/user.schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import type { Option } from "fp-ts/Option";

export const permission = p.pgTable("permission", {
	id: uid().primaryKey(),
	name: p.varchar({ length: 255 }).notNull(),
	description: p.text().notNull(),
	resource: p.varchar({ length: 255 }).notNull(),
	action: p.varchar({ length: 255 }).notNull(),
	attributes: p.jsonb(),
	createdAt: p.timestamp("created_at").defaultNow().notNull(),
	createdBy: uid("created_by").references(() => user.id, {
		onDelete: "set null",
	}),
	updatedAt: p.timestamp("updated_at"),
	updatedBy: uid("updated_by").references(() => user.id, {
		onDelete: "set null",
	}),
	deletedAt: p.timestamp("deleted_at"),
	deletedBy: uid("deleted_by").references(() => user.id, {
		onDelete: "set null",
	}),
});

export type Permission = InferSelectModel<typeof permission>;
export type CreatePermission = InferInsertModel<typeof permission>;

export const mapPermission = (row: Permission): entity.Permission => {
	return {
		...row,
		attributes: row.attributes ?? undefined,
		updatedAt: row.updatedAt ?? undefined,
		createdBy: row.createdBy ?? undefined,
		updatedBy: row.updatedBy ?? undefined,
		deletedAt: row.deletedAt ?? undefined,
		deletedBy: row.deletedBy ?? undefined,
	};
};

export const mapPermissionOption = (row: Option<Permission>) => mapOption(row, mapPermission);
export const mapPermissions = (rows: Permission[]) => rows.map((r) => mapPermission(r));
