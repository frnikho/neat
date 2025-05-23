import {ok, okAsync, ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {Role} from "$permission/domain/entity/role.entity";
import roleRepo from "$permission/infra/repo/role.repo";
import {AuthContext} from "$auth/api/auth.middleware";
import {db, opTx} from "@core/db";
import {Permission} from "$permission/domain/entity/permission.entity";
import {handle, optionToResult} from "@core/type";
import {UpdateRoleRequest} from "$permission/api/role.request";
import {checkPermission} from "$permission/infra/role.service";

type Input = {
    auth: AuthContext;
    roleId: string;
    body: UpdateRoleRequest;
}

type Output = {
    role: Role;
    permissions: Permission[];
};

const updateRole = ({roleId, body}: Input): ResultAsync<Output, ApiError> => {

    const repo = roleRepo(db);

    const result = repo.findById(roleId)
        .andThen((role) => optionToResult(role, apiError(ApiErrorCode.BAD_REQUEST, 'Role not found !')))
        .andThen((role) => repo.update(role.id, body))
        .andThen((role) => {
            if (body.permissions) {
                return opTx(db, async (tx) => {
                    const repo = roleRepo(tx);

                    const addedPerms = await checkPermission(tx, body.permissions!).andThen((perm) =>
                        repo.removePermissions(role.id, perm.map((p) => p.id)).map(() => perm)
                    ).andThen((perm) =>
                        repo.addPermissions(role.id, perm.map((p) => p.id))
                    );

                    if (addedPerms.isErr()) {
                        throw addedPerms.error;
                    }
                    return role;
                });

            }
            return okAsync(role);
        })
        .andThen((role) => repo.findByIdWithPermissions(role.id))
        .andThen((role) => optionToResult(role, apiError(ApiErrorCode.BAD_REQUEST, 'Role not found !')))
        .map(([role, permissions]) => ({
            role,
            permissions,
        }))

    return handle(result);
}

export default _trace(updateRole, 'app.permission/update-role');