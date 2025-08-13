import type { CreateSettings, Settings, UpdateSettings } from "@entity/settings.entity";
import type { DbException } from "@infra/exception/db.exception";
import type { SettingsKey, SettingsValue } from "@service/settings.service";
import type { ResultAsync } from "neverthrow";

type Result<T> = ResultAsync<T, DbException>;

export type SettingsInterface = {
	create: <T = object>(body: CreateSettings<T>) => Result<Settings<T>>;
	update: <K extends SettingsKey, T = object>(key: K, body: UpdateSettings<T>) => Result<Settings<T>>;
	find: <K extends SettingsKey>(key: K) => Result<Settings<SettingsValue<K>>>;
	list: (page?: number, limit?: number) => Result<Settings<object>[]>;
};
