import {AuthContext} from "@entity/auth-context.entity";
import {hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
}

export default ({auth}: Input) => {
    if (!hasPermission(auth.roles, 'widget.read')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to list widgets"));
    }

    return widgetRepo(db).findAll()
}