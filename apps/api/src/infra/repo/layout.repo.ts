import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {LayoutCacheInterface, LayoutInterface} from "@interface/layout.interface";
import {layout, mapLayout, mapLayoutOption} from "@schema/layout.schema";
import {Json, oneOreResultOption, oneOrThrow} from "@infra/utils/type.utils";
import {op} from "@infra/utils/db.utils";
import {DbException} from "@infra/exception/db.exception";
import {eq, sql} from "drizzle-orm";
import {RedisClient} from "bun";
import {okAsync} from "neverthrow";
import {none, some} from "fp-ts/Option";
import {LayoutCache} from "@entity/layout.entity";
import {mapWidget, Widget, widget} from "@schema/widget.schema";
import {inArray} from "drizzle-orm/sql/expressions/conditions";

const LAYOUT_TTL = 60 * 60 * 24; // 1 day

export const layoutRepo = (client: NodePgDatabase): LayoutInterface => ({
    create: (data) => {
        return op(client
            .insert(layout)
            .values({
                name: data.name,
                key: data.key,
                page: data.page,
                createdBy: data.createdBy,
            }).returning()
        ).andThen((r) => oneOrThrow(r, new DbException("Widget creation failed"))).map(mapLayout);
    },

    delete: (id) => {
        return op(client
            .delete(layout)
            .where(eq(layout.id, id))
            .returning()
        ).andThen((r) => oneOrThrow(r, new DbException("Widget deletion failed")))
            .map(mapLayout);
    },

    findById: (id) => {
        return op(client
            .select()
            .from(layout)
            .where(eq(layout.id, id))
            .limit(1)
        ).andThen(oneOreResultOption)
            .map(mapLayoutOption);
    },

    findWithWidgets: (id) => {
        const result = op(client
            .select({
                layout,
                widgets: sql`COALESCE(json_agg(${widget}) FILTER (WHERE ${widget}.id IS NOT NULL), '[]')`
            })
            .from(layout)
            .leftJoin(widget, eq(widget.id, layout.id))
            .where(eq(layout.id, id))
            .groupBy(layout.id));

        return result
            .andThen((result) => oneOrThrow(result, new DbException("Layout with widget not found")))
            .map(({ layout, widgets }) => ({
                layout: mapLayout(layout),
                widgets: (widgets as Widget[]).map(mapWidget)
            }));
    },

    findManyWithWidgets: (ids) => {
        const result = op(client
            .select({
                layout,
                widgets: sql`COALESCE(json_agg(${widget}) FILTER (WHERE ${widget}.id IS NOT NULL), '[]')`
            })
            .from(layout)
            .leftJoin(widget, eq(widget.layout, layout.id))
            .where(inArray(layout.id, ids))
            .groupBy(layout.id)
        );

        return result.map(rows =>
            rows.map(({ layout, widgets }) => ({
                layout: mapLayout(layout),
                widgets: (widgets as Widget[]).map(mapWidget)
            }))
        );
    },

    update: (id, data) => {
        return op(client
            .update(layout)
            .set({
                name: data.name,
                key: data.key,
                page: data.page,
                updatedBy: data.updatedBy,
            })
            .where(eq(layout.id, id))
            .returning()
        ).andThen((r) => oneOrThrow(r, new DbException("Widget update failed")))
            .map(mapLayout);
    },

    findByKey: (key) => {
        return op(client
            .select()
            .from(layout)
            .where(eq(layout.key, key))
        ).andThen(oneOreResultOption)
            .map(mapLayoutOption);
    },

    findByPage: (pageId) => {
        return op(client
            .select()
            .from(layout)
            .where(eq(layout.page, pageId))
        ).map((rows) => rows.map(mapLayout));
    },

    list: (page = 1, limit = 20) => {
        return op(client
            .select()
            .from(layout)
            .limit(limit)
            .offset((page) * (limit))
        ).map((rows) => rows.map(mapLayout));
    },

    softDelete: (id, deletedBy) => {
        return op(client
            .update(layout)
            .set({
                deletedAt: new Date(),
                deletedBy: deletedBy,
            })
            .where(eq(layout.id, id))
            .returning()
        ).andThen((r) => oneOrThrow(r, new DbException("Widget soft deletion failed")))
            .map(mapLayout);
    },
})

export const layoutCacheRepo = (client: RedisClient): LayoutCacheInterface => ({
    set: (key, data) => {
        return Json.Stringify(data).andThen((data) => {
            return op(client.set(`layout:${key}`, data))
                .andThen(() => op(client.expire(`layout:${key}`, LAYOUT_TTL)))
                .andThen(() => okAsync())
        })
    },

    get: (key) => {
        return op(client.get(`layout:${key}`)).andThen((r) => {
            if (r === null) {
                return okAsync(none);
            }
            return Json.Parse(r).map((d) => some(d as LayoutCache));
        })
    },

    delete: (key) => {
        return op(client.del(`layout:${key}`))
            .andThen(() => okAsync());
    }
});