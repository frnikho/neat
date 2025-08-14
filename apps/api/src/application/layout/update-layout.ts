import {AuthContext} from "@entity/auth-context.entity";
import {CreateLayout, UpdateLayout} from "@entity/layout.entity";
import {hasPermission} from "@service/permission.service";
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
    if (!hasPermission(auth.roles, 'layout.update')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to update layout"));
    }

    return layoutRepo(db).update(id, {
        ...body,
        updatedBy: auth.user.id
    });
}