import {ResultAsync} from "neverthrow";
import userRepo from "@infra/repo/user.repo";
import {db} from "@infra/service/db.service";
import roleRepo from "@infra/repo/role.repo";
import userRoleRepo from "@infra/repo/user-role.repo";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {optionToResult} from "@infra/utils/type.utils";
import { AuthContext } from "@entity/auth-context.entity";
import {appException} from "@application/app.exception";

type Input = {
    auth: AuthContext;
    userId: string;
    roleId: string;
}

type Output = void;

export default ({roleId, userId}: Input): ResultAsync<Output, Error> => {

    const user = userRepo(db).findUserById(userId)
        .andThen((u) => optionToResult(u, appException(apiErrorCodeToStatus.BAD_REQUEST, 'User not found')));

    const role = roleRepo(db).findById(roleId)
        .andThen((u) => optionToResult(u, appException(apiErrorCodeToStatus.BAD_REQUEST, 'Role not found')));

    return ResultAsync.combine([user, role]).andThen(([user, role]) => {
        return userRoleRepo(db).add(user.id, role.id)
    })
}