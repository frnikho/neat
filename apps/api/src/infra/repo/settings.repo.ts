import type { CreateSettings, UpdateSettings } from "@entity/settings.entity";
import { op } from "@infra/utils/db.utils";
import { oneOrThrow } from "@infra/utils/type.utils";
import type { SettingsInterface } from "@interface/settings.interface";
import { mapSettings, mapSettingsList, settings } from "@schema/settings.schema";
import type { SettingsKey, SettingsValue } from "@service/settings.service";
import { and, eq, isNotNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { isNull } from "drizzle-orm/sql/expressions/conditions";

export default (client: NodePgDatabase): SettingsInterface => ({
	create: <T>(body: CreateSettings<T>) => {
		return op(
			client
				.insert(settings)
				.values({
					...body,
					updatedBy: null,
					deletedBy: null,
				})
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Settings not created")))
			.map(mapSettings<T>);
	},

	list: (page = 1, limit = 50) => {
		return op(
			client
				.select()
				.from(settings)
				.limit(limit)
				.offset((page - 1) * limit)
				.where(isNull(settings.deletedAt)),
		).map(mapSettingsList);
	},

	update: <K extends SettingsKey, T = object>(key: K, body: UpdateSettings<T>) => {
		return op(
			client
				.update(settings)
				.set({
					...body,
					updatedBy: body.updatedBy ?? null,
					deletedBy: null,
				})
				.where(and(eq(settings.key, key), isNull(settings.deletedAt)))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Settings not updated")))
			.map(mapSettings<T>);
	},

	find: <K extends SettingsKey>(key: K) => {
		return op(
			client
				.select()
				.from(settings)
				.where(and(eq(settings.key, key), isNotNull(settings.value), isNull(settings.deletedAt))),
		)
			.andThen((r) => oneOrThrow(r, new Error("Settings not found")))
			.map(mapSettings<SettingsValue<K>>);
	},
});
