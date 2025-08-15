import {CreatePage} from "@entity/page.entity";
import {AuthContext} from "@entity/auth-context.entity";
import {hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {pageRepo} from "@repo/page.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    body: CreatePage;
}

export default ({auth, body}: Input) => {
    if (!hasPermission(auth.roles, 'page.create')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create page"));
    }

    return pageRepo(db).create({
        ...body,
        createdBy: auth.user.id
    });
}