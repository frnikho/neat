import {AuthContext} from "@entity/auth-context.entity";
import {hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {pageRepo} from "@repo/page.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    id: string;
}

export default ({id, auth}: Input) => {
    if (!hasPermission(auth.roles, 'page.delete')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to delete page"));
    }

    return pageRepo(db).softDelete(id, auth.user.deletedBy);
}