import {AuthContext} from "@entity/auth-context.entity";
import {hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";
import {Pagination} from "@entity/pagination.entity";

export type Input = {
    auth: AuthContext;
    pag: Pagination;
}

export default ({auth, pag}: Input) => {
    if (!hasPermission(auth.roles, 'layout.read')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create layout"));
    }

    return layoutRepo(db).list(pag.page, pag.limit);
}