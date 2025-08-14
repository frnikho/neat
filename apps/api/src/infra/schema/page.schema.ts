import { uid } from "@infra/utils/db.utils";
import { user } from "@schema/user.schema";
import * as p from "drizzle-orm/pg-core";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {mapOption} from "@infra/utils/type.utils";
import {Option} from "fp-ts/Option";
import * as entity from "@entity/page.entity";

export const page = p.pgTable("page", {
	id: uid().primaryKey(),
	name: p.varchar({ length: 255 }).notNull(),
	description: p.varchar({ length: 255 }).notNull(),
    slug: p.varchar({ length: 255 }).notNull().unique(),
	createdAt: p.timestamp("created_at").defaultNow().notNull(),
	createdBy: p.varchar("created_by").references(() => user.id, { onDelete: "set null" }),
	updatedAt: p.timestamp("updated_at"),
	updatedBy: p.varchar("updated_by").references(() => user.id, { onDelete: "set null" }),
	deletedAt: p.timestamp("deleted_at"),
	deletedBy: p.varchar("deleted_by").references(() => user.id, { onDelete: "set null" }),
});

export type Page = InferSelectModel<typeof page>;
export type PageCreate = InferInsertModel<typeof page>;

export const mapPage = (row: Page): entity.Page => ({
    ...row,
    createdBy: row.createdBy ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
    deletedAt: row.deletedAt ?? undefined,
    deletedBy: row.deletedBy ?? undefined,
});

export const mapPageOption = (row: Option<Page>): Option<entity.Page> => mapOption(row, mapPage);