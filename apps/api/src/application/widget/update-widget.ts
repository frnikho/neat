import {UpdateWidget} from "@entity/widget.entity";
import {AuthContext} from "@entity/auth-context.entity";
import {hasAnyPermission, hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";
import {layoutCacheRepo, layoutRepo} from "@repo/layout.repo";
import {redisClient} from "@service/cache.service";
import {optionToResult} from "@infra/utils/type.utils";

type Input = {
    auth: AuthContext;
    id: string;
    body: UpdateWidget;
}

export default ({body, auth, id}: Input) => {
    if (!hasAnyPermission(auth.roles, ['widget.update', 'widget.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create widgets"));
    }
    return widgetRepo(db).update(id, {
        ...body,
        updatedBy: auth.user.id,
    }).andThen((widget) => {
        return layoutRepo(db).findById(widget.layout)
            .andThen((layout) => optionToResult(layout, appException(apiErrorCodeToStatus.NOT_FOUND, `Layout with id ${widget.layout} not found`)))
            .andThen((layout) => layoutCacheRepo(redisClient()).delete(layout.key))
            .map(() => widget);
    })
}