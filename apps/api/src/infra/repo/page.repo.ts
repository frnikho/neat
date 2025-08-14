import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {PageCacheInterface, PageInterface} from "@interface/page.interface";
import {op} from "@infra/utils/db.utils";
import {mapPage, mapPageOption, page} from "@schema/page.schema";
import {Json, JsonParse, oneOreResultOption, oneOrThrow} from "@infra/utils/type.utils";
import {DbException} from "@infra/exception/db.exception";
import {eq, sql} from "drizzle-orm";
import {RedisClient} from "bun";
import {okAsync} from "neverthrow";
import {none, some} from "fp-ts/Option";
import {PageCache} from "@entity/page.entity";
import {Layout, layout, mapLayout} from "@schema/layout.schema";

const PAGE_TTL = 60 * 60 * 24; // 1 day

export const pageRepo =  (db: NodePgDatabase): PageInterface => ({
    create: (data) => {
        return op(db.insert(page).values({
            ...data,
        }).returning()
        ).andThen((r) => oneOrThrow(r, new DbException("Page creation failed"))).map(mapPage);
    },

    creates: (data) => {
        return op(db.insert(page).values(data).returning())
            .map((rows) => rows.map(mapPage));
    },

    delete: (id) => {
        return op(db.delete(page).where(eq(page.id, id)).returning())
            .andThen((r) => oneOrThrow(r, new DbException("Page deletion failed")))
            .map(mapPage);
    },

    findById: (id) => {
        return op(db.select().from(page).where(eq(page.id, id)))
            .andThen(oneOreResultOption)
            .map(mapPageOption);
    },

    findBySlugWithLayouts: (slug) => {
        const result = op(db
            .select({
                page,
                layouts: sql`COALESCE(json_agg(${layout}) FILTER (WHERE ${layout}.id IS NOT NULL), '[]')`
            })
            .from(page)
            .leftJoin(layout, eq(layout.page, page.id))
            .where(eq(page.slug, slug))
            .groupBy(page.id));

        return result
            .andThen((result) => oneOrThrow(result, new DbException("Page with layouts not found")))
            .map(({ page, layouts }) => ({
                page: mapPage(page),
                layouts: (layouts as Layout[]).map(mapLayout)
            }));
    },

    update: (id, data) => {
        return op(db.update(page)
            .set({
                ...data,
            })
            .where(eq(page.id, id))
            .returning()
        ).andThen((r) => oneOrThrow(r, new DbException("Page update failed")))
            .map(mapPage);
    },

    findBySlug: (slug) => {
        return op(db.select().from(page).where(eq(page.slug, slug)))
            .andThen(oneOreResultOption)
            .map(mapPageOption);
    },

    list: (p = 1, limit = 20) => {
        return op(db
            .select()
            .from(page)
            .limit(limit)
            .offset((p) * (limit))
        ).map((rows) => rows.map(mapPage));
    },

    softDelete: (id, deletedBy) => {
        return op(db.update(page)
            .set({
                deletedAt: new Date(),
                deletedBy,
            })
            .where(eq(page.id, id))
            .returning()
        ).andThen((r) => oneOrThrow(r, new DbException("Page soft delete failed")))
            .map(mapPage);
    },
});

export const pageCacheRepo = (client: RedisClient): PageCacheInterface => ({
    set: (slug, data) => {
        return Json.Stringify(data).andThen((strData) => {
            return op(client.set(`page:${slug}`, strData))
                .andThen(() => op(client.expire(`page:${slug}`, PAGE_TTL)))
                .andThen(() => okAsync())
        })
    },

    get: (slug) => {
        return op(client.get(`page:${slug}`)).andThen((r) => {
            if (r === null) {
                return okAsync(none);
            }
            return JsonParse<PageCache>(r)().map((d) => some(d));
        })
    },

    delete: (slug) => {
        return op(client.del(`page:${slug}`))
            .andThen(() => okAsync());
    }
})