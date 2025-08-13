import type * as entity from "@entity/user.entity";
import { uid } from "@infra/utils/db.utils";
import { mapOption } from "@infra/utils/type.utils";
import { file } from "@schema/file.schema";
import { type InferSelectModel, sql } from "drizzle-orm";
import { type AnyPgColumn, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import type { Option } from "fp-ts/Option";

export const user = pgTable("user", {
	id: uid().primaryKey(),
	password: varchar(),
	email: varchar().notNull().unique(),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
	profilePictureFile: varchar("profile_picture_file").references((): AnyPgColumn => file.id, { onDelete: "set null" }),
	profilePictureUpdatedAt: timestamp("profile_picture_updated_at"),
	profilePictureUpdatedBy: varchar("profile_picture_updated_by").references((): AnyPgColumn => user.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	createdBy: varchar("created_by").references((): AnyPgColumn => user.id, {
		onDelete: "set null",
	}),
	updatedAt: timestamp("updated_at"),
	updatedBy: varchar("updated_by").references((): AnyPgColumn => user.id, {
		onDelete: "set null",
	}),
	deletedAt: timestamp("deleted_at"),
	deletedBy: varchar("deleted_by").references((): AnyPgColumn => user.id, {
		onDelete: "set null",
	}),
});

type User = InferSelectModel<typeof user>;

export const mapUserToEntity = (row: User): entity.User => {
	return {
		...row,
		password: row.password ?? undefined,
		profilePictureFile: row.profilePictureFile ?? undefined,
		profilePictureUpdatedAt: row.profilePictureUpdatedAt ?? undefined,
		profilePictureUpdatedBy: row.profilePictureUpdatedBy ?? undefined,
		updatedAt: row.updatedAt ?? undefined,
		createdBy: row.createdBy ?? undefined,
		updatedBy: row.updatedBy ?? undefined,
		deletedAt: row.deletedAt ?? undefined,
		deletedBy: row.deletedBy ?? undefined,
	};
};

export const mapUserOption = (row: Option<User>) => mapOption(row, mapUserToEntity);
export const mapUsersToEntities = (rows: User[]) => rows.map(mapUserToEntity);
