import {_trace} from "@core/instrumentation";
import {ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import userRepo from "$user/infra/repo/user.repo";
import {db} from "@core/db";
import {handle, optionToResult} from "@core/type";
import userRoleRepo from "$permission/infra/repo/user-role.repo";
import {Role} from "$permission/domain/entity/role.entity";
import {AuthContext} from "$auth/api/auth.middleware";

type Input = {
    auth: AuthContext;
    userId: string;
}

type Output = Role[];

const listUserRole = ({userId}: Input): ResultAsync<Output, ApiError> => {

    const result = userRepo.findUserById(db, userId)
        .andThen((u) => optionToResult(u, apiError(ApiErrorCode.BAD_REQUEST, 'User not found')))
        .andThen((u) => userRoleRepo(db).list(u.id));

    return handle(result);
}

export default _trace(listUserRole, 'app.permission/list-user-role');