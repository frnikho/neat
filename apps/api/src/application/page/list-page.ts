import {AuthContext} from "@entity/auth-context.entity";
import {hasAnyPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {pageRepo} from "@repo/page.repo";
import {db} from "@service/db.service";
import {Pagination} from "@entity/pagination.entity";

type Input = {
    auth: AuthContext;
    pag: Pagination;
}

export default ({auth, pag}: Input) => {
    if (!hasAnyPermission(auth.roles, ['page.read', 'page.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to read page"));
    }

    return pageRepo(db).list(pag.page, pag.limit);
}