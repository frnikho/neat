import {AuthContext} from "@entity/auth-context.entity";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";
import {CreateWidget} from "@entity/widget.entity";
import {hasAnyPermission, hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutCacheRepo} from "@repo/layout.repo";
import {redisClient} from "@service/cache.service";

type Input = {
    auth: AuthContext;
    body: CreateWidget;
}

export default ({body, auth}: Input) => {

    if (!canCreateWidget(auth)) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create widgets"));
    }
    return widgetRepo(db).create({
        ...body,
        createdBy: auth.user.id,
    }).andThen((widget) => {
        return layoutCacheRepo(redisClient()).delete(`layout:${body.layout}`).map(() => widget);
    });
}

const canCreateWidget = ({ roles }: AuthContext): boolean => {
    return hasAnyPermission(roles, ['widget.create', 'widget.*']);
};