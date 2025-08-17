import {AuthContext} from "@entity/auth-context.entity";
import {hasAnyPermission} from "@service/permission.service";
import {appException} from "@application/app.exception";
import {errAsync} from "neverthrow";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";

type Input = {
    id: string;
    auth: AuthContext;
}

export default ({auth, id}: Input) => {
    if (!hasAnyPermission(auth.roles, ['layout.delete', 'layout.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to delete layout"));
    }

    return layoutRepo(db).softDelete(id, auth.user.id);
}