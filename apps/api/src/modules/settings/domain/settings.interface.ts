import {Settings} from "$settings/domain/settings.entity.ts";
import {ResultAsync} from "neverthrow";
import {DbException} from "@core/exceptions";
import {Option} from "fp-ts/Option";

type Result<T> = ResultAsync<Settings<T>, DbException>;

export type SettingsInterface = {
    create: <T>(body: any) => Promise<Result<T>>;
    update: <T>(key: string, body: any) => Promise<Result<T>>;
    findByKey: <T>(key: string, body: any) => Promise<Option<Result<T>>>;
}