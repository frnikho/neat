import {ResultAsync} from "neverthrow";
import {Option} from "fp-ts/Option";
import {DbException} from "@infra/exception/db.exception";
import {Settings} from "@entity/settings.entity";

type Result<T> = ResultAsync<Settings<T>, DbException>;

export type SettingsInterface = {
    create: <T>(body: any) => Promise<Result<T>>;
    update: <T>(key: string, body: any) => Promise<Result<T>>;
    findByKey: <T>(key: string, body: any) => Promise<Option<Result<T>>>;
}