import {AuthContext} from "@entity/auth-context.entity";
import {pageCacheRepo, pageRepo} from "@repo/page.repo";
import {redisClient} from "@service/cache.service";
import {layoutCacheRepo, layoutRepo} from "@repo/layout.repo";
import {isNone, isSome} from "fp-ts/Option";
import {okAsync, ResultAsync} from "neverthrow";
import {db} from "@service/db.service";
import {PageCache} from "@entity/page.entity";

type Input = {
    pageSlug: string;
}

export default ({pageSlug}: Input) => {

    const client = redisClient();
    const pageCache = pageCacheRepo(client);
    const layoutCache = layoutCacheRepo(client);

    const pageContent = pageCache.get(pageSlug)
        .andThen((pCache) => {
            if (isNone(pCache)) {
                return pageRepo(db).findBySlugWithLayouts(pageSlug).andThen((data) =>
                    pageCache.set(data.page.slug, data).map(() => data)
                );
            }
            return okAsync(pCache.value);
        });

    return pageContent.andThen(({page, layouts}) => {
        const layoutsCache = ResultAsync.combine(layouts.map((layout => layoutCache.get(layout.key))))
            .andThen((cache) => {
                if (cache.some(isNone)) {
                    return layoutRepo(db).findManyWithWidgets(layouts.map((l) => l.id)).andThen((layoutsWithWidgets) => {
                        return ResultAsync.combine(layoutsWithWidgets.map((l) => layoutCache.set(l.layout.key, l))).map(() => layoutsWithWidgets);
                    })
                }
                return okAsync(cache.filter(isSome).map(c => c.value));
            });

        return layoutsCache.map((layoutWithWidget) => {
            return {
                page: {
                    ...page,
                    layouts: layoutWithWidget
                }
            }
        });
    })
}