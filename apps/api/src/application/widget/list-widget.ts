import {AuthContext} from "@entity/auth-context.entity";
import {hasAnyPermission, hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
}

export default ({auth}: Input) => {
    if (!hasAnyPermission(auth.roles, ['widget.read', 'widget.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to list widget"));
    }

    return widgetRepo(db).findAll()
}