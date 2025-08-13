import { DbException } from "@infra/exception/db.exception";
import { op } from "@infra/utils/db.utils";
import { oneOreResultOption, oneOrOption, oneOrThrow } from "@infra/utils/type.utils";
import type { WidgetInterface } from "@interface/widget.interface";
import { mapWidget, mapWidgetOption, widget } from "@schema/widget.schema";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export default (client: NodePgDatabase): WidgetInterface => ({
	create: (body) => {
		return op(
			client
				.insert(widget)
				.values({
					name: body.name,
					value: body.value,
					layout: body.layout,
					createdBy: body.createdBy,
					updatedBy: body.updatedBy,
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

	findAll: (page = 1, limit = 10) => {
		return op(
			client
				.select()
				.from(widget)
				.limit(limit)
				.offset((page - 1) * limit),
		).map((rows) => rows.map(mapWidget));
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
});
