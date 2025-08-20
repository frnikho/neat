import {AuthContext} from "@entity/auth-context.entity";
import {CreateLayout} from "@entity/layout.entity";
import {hasAnyPermission} from "@service/permission.service";
import {errAsync, okAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";
import {pageCacheRepo, pageRepo} from "@repo/page.repo";
import {optionToResult} from "@infra/utils/type.utils";
import {redisClient} from "@service/cache.service";
import {isSome} from "fp-ts/Option";

type Input = {
    auth: AuthContext;
    body: CreateLayout;
}

export default ({auth, body}: Input) => {
    if (!hasAnyPermission(auth.roles, ['layout.create', 'layout.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create layout"));
    }

    return layoutRepo(db).findByKey(body.key).andThen((existingLayout) => {
        if (isSome(existingLayout)) {
            return errAsync(appException(apiErrorCodeToStatus.BAD_REQUEST, `Layout with key ${body.key} already exists`));
        }
        return okAsync();
    }).andThen(() => {
        return layoutRepo(db).create({
            ...body,
            createdBy: auth.user.id
        })
    }).andThen((layout) => {
        return pageRepo(db).findById(layout.page)
            .andThen((page) => optionToResult(page, appException(apiErrorCodeToStatus.NOT_FOUND, `Page with id ${layout.page} not found`)))
            .andThen((page) => pageCacheRepo(redisClient()).delete(page.slug))
            .map(() => layout);
    });
}