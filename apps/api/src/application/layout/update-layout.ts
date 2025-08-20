import {AuthContext} from "@entity/auth-context.entity";
import {UpdateLayout} from "@entity/layout.entity";
import {hasAnyPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";
import {pageCacheRepo, pageRepo} from "@repo/page.repo";
import {optionToResult} from "@infra/utils/type.utils";
import {redisClient} from "@service/cache.service";

type Input = {
    auth: AuthContext;
    id: string;
    body: UpdateLayout;
}

export default ({auth, body, id}: Input) => {
    if (!hasAnyPermission(auth.roles, ['layout.update', 'layout.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to update layout"));
    }

    return layoutRepo(db).update(id, {
        ...body,
        updatedBy: auth.user.id
    }).andThen((layout) => {
        return pageRepo(db).findById(layout.page)
            .andThen((page) => optionToResult(page, appException(apiErrorCodeToStatus.NOT_FOUND, `Page with id ${layout.page} not found`)))
            .andThen((page) => pageCacheRepo(redisClient()).delete(page.slug))
            .map(() => layout);
    });;
}