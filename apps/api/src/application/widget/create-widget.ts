import {AuthContext} from "@entity/auth-context.entity";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";
import {CreateWidget} from "@entity/widget.entity";
import {hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";

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
    });
}

const canCreateWidget = ({ roles }: AuthContext): boolean => {
    return hasPermission(roles, 'widget.create');
};