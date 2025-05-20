import {_trace} from "@core/instrumentation";
import {ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import userRepo from "$user/infra/repo/user.repo";
import {db} from "@core/db";
import {handle, optionToResult} from "@core/type";
import roleRepo from "$permission/infra/repo/role.repo";
import userRoleRepo from "$permission/infra/repo/user-role.repo";
import {AuthContext} from "$auth/api/auth.middleware";

type Input = {
    auth: AuthContext;
    userId: string;
    roleId: string;
}

type Output = void;

const addUserRole = ({roleId, userId}: Input): ResultAsync<Output, ApiError> => {

    const user = userRepo.findUserById(db, userId)
        .andThen((u) => optionToResult(u, apiError(ApiErrorCode.BAD_REQUEST, 'User not found')));

    const role = roleRepo.findById(roleId)
        .andThen((u) => optionToResult(u, apiError(ApiErrorCode.BAD_REQUEST, 'Role not found')));

    const result = ResultAsync.combine([user, role]).andThen(([user, role]) => {
        return userRoleRepo.add(user.id, role.id)
    })

    return handle(result);
}

export default _trace(addUserRole, 'app.permission/add-user-role');