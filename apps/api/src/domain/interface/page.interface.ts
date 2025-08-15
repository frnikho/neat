import {DbException} from "@infra/exception/db.exception";
import {ResultAsync} from "neverthrow";
import {CreatePage, Page, PageCache, PageWithLayouts, UpdatePage} from "@entity/page.entity";
import {Option} from "fp-ts/Option";
import {CacheException} from "@infra/exception/cache.exception";

type Result<T> = ResultAsync<T, DbException>;

export interface PageInterface {
    create: (data: CreatePage) => Result<Page>;
    creates: (data: CreatePage[]) => Result<Page[]>;
    findById: (id: string) => Result<Option<Page>>;
    findBySlug: (key: string) => Result<Option<Page>>;
    findBySlugWithLayouts: (pageId: string) => Result<PageWithLayouts>;
    update: (id: string, data: UpdatePage) => Result<Page>;
    delete: (id: string) => Result<Page>;
    list: (page?: number, limit?: number) => Result<Page[]>;
    softDelete: (id: string, deletedBy?: string) => Result<Page>;
}

type ResultCache<T> = ResultAsync<T, CacheException>;

export interface PageCacheInterface {
    get: (slug: string) => ResultCache<Option<PageCache>>;
    set: (slug: string, data: PageCache) => ResultCache<void>;
    delete: (slug: string) => ResultCache<void>;
}