import {ResultAsync} from "neverthrow";
import {DbException} from "@infra/exception/db.exception";
import {CreateLayout, Layout, LayoutCache, LayoutWithWidgets, UpdateLayout} from "@entity/layout.entity";
import {Option} from "fp-ts/Option";
import {CacheException} from "@infra/exception/cache.exception";

type Result<T> = ResultAsync<T, DbException>;

export interface LayoutInterface {
    create: (data: CreateLayout) => Result<Layout>;
    findById: (id: string) => Result<Option<Layout>>;
    findByKey: (key: string) => Result<Option<Layout>>;
    findByPage: (pageId: string) => Result<Layout[]>;
    findWithWidgets: (layoutId: string) => Result<LayoutWithWidgets>;
    findManyWithWidgets: (ids: string[]) => Result<LayoutWithWidgets[]>;
    update: (id: string, data: UpdateLayout) => Result<Layout>;
    delete: (id: string) => Result<Layout>;
    list: (page?: number, limit?: number) => Result<Layout[]>;
    softDelete: (id: string, deletedBy?: string) => Result<Layout>;
}

type ResultCache<T> = ResultAsync<T, CacheException>;

export interface LayoutCacheInterface {
    get: (key: string) => ResultCache<Option<LayoutCache>>;
    set: (key: string, data: LayoutCache) => ResultCache<void>;
    delete: (key: string) => ResultCache<void>;
}