import {AuthContext} from "@entity/auth-context.entity";
import {hasAnyPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";
import {layoutCacheRepo, layoutRepo} from "@repo/layout.repo";
import {optionToResult} from "@infra/utils/type.utils";
import {redisClient} from "@service/cache.service";

type Input = {
    auth: AuthContext;
    id: string;
}

export default ({id, auth}: Input) => {
    if (!hasAnyPermission(auth.roles, ['widget.delete', 'widget.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to delete widgets"));
    }

    return widgetRepo(db).softDelete(id, auth.user.id)
        .andThen((widget) => {
            return layoutRepo(db).findById(widget.layout)
                .andThen((layout) => optionToResult(layout, appException(apiErrorCodeToStatus.NOT_FOUND, `Layout with id ${widget.layout} not found`)))
                .andThen((layout) => layoutCacheRepo(redisClient()).delete(layout.key))
                .map(() => widget);
        });
}