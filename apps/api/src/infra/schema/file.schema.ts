import type * as entity from "@entity/file.entity";
import { user } from "@infra/schema/user.schema";
import { uid } from "@infra/utils/db.utils";
import { mapOption } from "@infra/utils/type.utils";
import type { InferSelectModel } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import type { Option } from "fp-ts/Option";

export const file = p.pgTable("file", {
	id: uid().primaryKey(),
	name: p.varchar({ length: 255 }).notNull(),
	description: p.text().notNull(),
	key: p.varchar({ length: 255 }).notNull(),
	bucket: p.varchar({ length: 255 }).notNull(),
	size: p.integer("size").notNull(),
	contentType: p.varchar({ length: 100 }).notNull(),
	isPublic: p.boolean("is_public").default(false).notNull(),
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

export type File = InferSelectModel<typeof file>;

export const mapFileMetadata = (row: File): entity.FileMetadata => {
	return {
		...row,
		createdBy: row.createdBy ?? undefined,
		updatedAt: row.updatedAt ?? undefined,
		updatedBy: row.updatedBy ?? undefined,
		deletedAt: row.deletedAt ?? undefined,
		deletedBy: row.deletedBy ?? undefined,
	};
};

export const mapFileMetadataOption = (row: Option<File>) => mapOption(row, mapFileMetadata);

export const mapFilesMetadata = (rows: File[]) => rows.map(mapFileMetadata);
