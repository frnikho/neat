import {UpdatePage} from "@entity/page.entity";
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
    body: UpdatePage;
}

export default ({id, auth, body}: Input) => {
    if (!hasPermission(auth.roles, 'page.update')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to update page"));
    }

    return pageRepo(db).update(id, {
        ...body,
        updatedBy: auth.user.id
    });
}