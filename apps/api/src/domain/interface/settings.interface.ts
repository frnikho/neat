import {ResultAsync} from "neverthrow";
import {Option} from "fp-ts/Option";
import {DbException} from "@infra/exception/db.exception";
import {CreateSettings, Settings, UpdateSettings} from "@entity/settings.entity";
import {SettingsKey, SettingsValue} from "@service/settings.service";

type Result<T> = ResultAsync<T, DbException>;

export type SettingsInterface = {
    create: <T = object>(body: CreateSettings<T>) => Result<Settings<T>>;
    update: <K extends SettingsKey, T = object>(key: K, body: UpdateSettings<T>) => Result<Settings<T>>;
    find: <K extends SettingsKey>(key: K) => Result<Settings<SettingsValue<K>>>;
    list: (page?: number, limit?: number) => Result<Settings<object>[]>;
}