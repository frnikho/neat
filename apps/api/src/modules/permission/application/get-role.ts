import {ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {Role} from "$permission/domain/entity/role.entity";
import roleRepo from "$permission/infra/repo/role.repo";
import {AuthContext} from "$auth/api/auth.middleware";
import {db} from "@core/db";
import {Permission} from "$permission/domain/entity/permission.entity";
import {handle, optionToResult} from "@core/type";

type Input = {
    auth: AuthContext;
    roleId: string;
}

type Output = {
    role: Role;
    permissions: Permission[];
};

const getRole = ({roleId}: Input): ResultAsync<Output, ApiError> => {
    const result = roleRepo(db).findByIdWithPermissions(roleId)
        .andThen((role) => optionToResult(role, apiError(ApiErrorCode.BAD_REQUEST, 'Role not found !')))
        .map(([role, permissions]) => {
            return {
                role: role,
                permissions: permissions,
            };
        });

    return handle(result);
}

export default _trace(getRole, 'app.permission/list-role');