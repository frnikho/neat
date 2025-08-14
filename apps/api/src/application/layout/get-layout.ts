import {AuthContext} from "@entity/auth-context.entity";
import {hasPermission} from "@service/permission.service";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {appException} from "@application/app.exception";
import {errAsync} from "neverthrow";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";

export type Input = {
    id: string;
    auth: AuthContext;
}

export default ({id, auth}: Input) => {
    if (!hasPermission(auth.roles, 'layout.read')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create layout"));
    }

    return layoutRepo(db).findById(id);
}