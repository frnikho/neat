import { DbException } from "@infra/exception/db.exception";
import { op } from "@infra/utils/db.utils";
import { oneOreResultOption, oneOrThrow } from "@infra/utils/type.utils";
import type { WidgetInterface } from "@interface/widget.interface";
import { mapWidget, mapWidgetOption, widget } from "@schema/widget.schema";
import {eq, sql} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export default (client: NodePgDatabase): WidgetInterface => ({
	create: (body) => {
		return op(
			client
				.insert(widget)
				.values({
					name: body.name,
                    key: body.key,
					value: body.value,
					layout: body.layout,
					createdBy: body.createdBy,
				})
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Widget creation failed")))
			.map(mapWidget);
	},

	delete: (id) => {
		return op(client.delete(widget).where(eq(widget.id, id)).returning())
			.andThen((r) => oneOrThrow(r, new DbException("Widget deletion failed")))
			.map(mapWidget);
	},

	findById: (id) => {
		return op(client.select().from(widget).where(eq(widget.id, id)).limit(1))
			.andThen(oneOreResultOption)
			.map(mapWidgetOption);
	},

    findByKey: (key) => {
        return op(client.select().from(widget).where(eq(widget.key, key)).limit(1))
            .andThen(oneOreResultOption)
            .map(mapWidgetOption);
    },

	findAll: (page = 1, limit = 10) => {
		return op(
			client
				.select({
                    widget,
                    total: sql<number>`count(*) over()`
                })
				.from(widget)
				.limit(limit)
				.offset((page - 1) * limit),
		).map((rows) => {
            return {
                widgets: rows.map((e) => mapWidget(e.widget)),
                total: rows.length > 0 ? Number(rows[0].total) : 0
            }
        })
	},

	update: (id, body) => {
		return op(
			client
				.update(widget)
				.set({
					name: body.name,
					value: body.value,
					layout: body.layout,
					updatedBy: body.updatedBy,
				})
				.where(eq(widget.id, id))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Widget update failed")))
			.map(mapWidget);
	},

    softDelete: (id, deletedBy) => {
        return op(
            client
                .update(widget)
                .set({
                    deletedAt: new Date(),
                    deletedBy: deletedBy,
                })
                .where(eq(widget.id, id))
                .returning(),
        )
            .andThen((r) => oneOrThrow(r, new DbException("Widget soft deletion failed")))
            .map(mapWidget
        )
    }
});
