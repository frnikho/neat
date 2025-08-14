import {AuthContext} from "@entity/auth-context.entity";
import {CreateLayout} from "@entity/layout.entity";
import {hasPermission} from "@service/permission.service";
import {errAsync} from "neverthrow";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {layoutRepo} from "@repo/layout.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    body: CreateLayout;
}

export default ({auth, body}: Input) => {
    if (!hasPermission(auth.roles, 'layout.read')) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to create layout"));
    }

    return layoutRepo(db).create({
        ...body,
        createdBy: auth.user.id
    });
}