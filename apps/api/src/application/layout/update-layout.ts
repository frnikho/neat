import {AuthContext} from "@entity/auth-context.entity";
import {UpdateLayout} from "@entity/layout.entity";
import {hasAnyPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    id: string;
    body: UpdateLayout;
}

export default ({auth, body, id}: Input) => {
    if (!hasAnyPermission(auth.roles, ['layout.update', 'layout.*'])) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to update layout"));
    }

    return layoutRepo(db).update(id, {
        ...body,
        updatedBy: auth.user.id
    });
}