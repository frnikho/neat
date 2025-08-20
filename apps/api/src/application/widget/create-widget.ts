import {AuthContext} from "@entity/auth-context.entity";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";
import {CreateWidget} from "@entity/widget.entity";
import {hasAnyPermission, hasPermission} from "@service/permission.service";
import {errAsync, okAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutCacheRepo, layoutRepo} from "@repo/layout.repo";
import {redisClient} from "@service/cache.service";
import {isSome} from "fp-ts/Option";
import {optionToResult} from "@infra/utils/type.utils";

type Input = {
    auth: AuthContext;
    body: CreateWidget;
}

export default ({body, auth}: Input) => {
    if (!hasAnyPermission(auth.roles, ['widget.create', 'widget.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create widget"));
    }

    const repo = widgetRepo(db);

    return repo.findByKey(body.key).andThen((widget) => {
        if (isSome(widget)) {
            return errAsync(appException(apiErrorCodeToStatus.BAD_REQUEST, `Widget with key ${body.key} already exists`));
        }
        return okAsync(widget);
    }).andThen(() => {
        return widgetRepo(db).create({
            ...body,
            createdBy: auth.user.id,
        })
    }).andThen((widget) => {
        return layoutRepo(db).findById(widget.layout)
            .andThen((layout) => optionToResult(layout, appException(apiErrorCodeToStatus.NOT_FOUND, `Layout with id ${widget.layout} not found`)))
            .andThen((layout) => layoutCacheRepo(redisClient()).delete(layout.key))
            .map(() => widget);
    });
}