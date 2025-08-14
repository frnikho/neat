import {UpdateWidget} from "@entity/widget.entity";
import {AuthContext} from "@entity/auth-context.entity";
import {hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    id: string;
    body: UpdateWidget;
}

export default ({body, auth, id}: Input) => {
    if (!hasPermission(auth.roles, 'widget.update')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create widgets"));
    }
    return widgetRepo(db).update(id, {
        ...body,
        updatedBy: auth.user.id,
    })
}