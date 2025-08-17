import {AuthContext} from "@entity/auth-context.entity";
import {hasAnyPermission} from "@service/permission.service";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {appException} from "@application/app.exception";
import {errAsync} from "neverthrow";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";
import {optionToResult} from "@infra/utils/type.utils";

export type Input = {
    id: string;
    auth: AuthContext;
}

export default ({id, auth}: Input) => {
    if (!hasAnyPermission(auth.roles, ['layout.read', 'layout.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create layout"));
    }

    return layoutRepo(db).findById(id)
        .andThen((res) => optionToResult(res, appException(apiErrorCodeToStatus.NOT_FOUND, `Layout with id ${id} not found`)));
}