import type * as entity from "@entity/role.entity";
import { uid } from "@infra/utils/db.utils";
import { mapOption } from "@infra/utils/type.utils";
import { user } from "@schema/user.schema";
import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import type { Option } from "fp-ts/Option";

export const role = p.pgTable("role", {
	id: uid().primaryKey(),
	name: p.varchar({ length: 255 }).notNull(),
	description: p.text().notNull(),
	isActive: p.boolean("is_active").default(true).notNull(),
	isBuiltIn: p.boolean("is_built_in").default(false).notNull(),
	isDefault: p.boolean("is_default").default(false).notNull(),
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

export type Role = InferSelectModel<typeof role>;
export type CreateRole = InferInsertModel<typeof role>;

export const mapRole = (row: Role): entity.Role => {
	return {
		...row,
		createdBy: row.createdBy ?? undefined,
		updatedAt: row.updatedAt ?? undefined,
		updatedBy: row.updatedBy ?? undefined,
		deletedAt: row.deletedAt ?? undefined,
		deletedBy: row.deletedBy ?? undefined,
	};
};

export const mapRoleOption = (row: Option<Role>) => mapOption(row, mapRole);

export const mapRoles = (rows: Role[]) => rows.map(mapRole);
