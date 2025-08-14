import { uid } from "@infra/utils/db.utils";
import { user } from "@schema/user.schema";
import * as p from "drizzle-orm/pg-core";
import {page} from "@schema/page.schema";
import {Option} from "fp-ts/Option";
import {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {mapOption} from "@infra/utils/type.utils";
import * as entity from "@entity/layout.entity";

export const layout = p.pgTable("layout", {
    id: uid().primaryKey(),
    name: p.varchar({ length: 255 }).notNull(),
    key: p.varchar({ length: 255 }).notNull(),
    page:  p.varchar().references(() => page.id, { onDelete: 'cascade' }).notNull(),
    createdAt: p.timestamp("created_at").defaultNow().notNull(),
    createdBy: p.varchar("created_by").references(() => user.id, { onDelete: "set null" }),
    updatedAt: p.timestamp("updated_at"),
    updatedBy: p.varchar("updated_by").references(() => user.id, { onDelete: "set null" }),
    deletedAt: p.timestamp("deleted_at"),
    deletedBy: p.varchar("deleted_by").references(() => user.id, { onDelete: "set null" }),
});

export type Layout = InferSelectModel<typeof layout>;
export type LayoutCreate = InferInsertModel<typeof layout>;

export const mapLayout = (row: Layout): entity.Layout => ({
    ...row,
    createdBy: row.createdBy ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
    deletedAt: row.deletedAt ?? undefined,
    deletedBy: row.deletedBy ?? undefined,
});

export const mapLayoutOption = (row: Option<Layout>): Option<entity.Layout> => mapOption(row, mapLayout);
