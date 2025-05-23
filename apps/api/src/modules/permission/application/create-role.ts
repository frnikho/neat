import {err, ok, ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {CreateRoleRequest} from "$permission/api/role.request";
import {Role} from "$permission/domain/entity/role.entity";
import {Permission} from "$permission/domain/entity/permission.entity";
import roleRepo from "$permission/infra/repo/role.repo";
import {db, opTx} from "@core/db";
import {AuthContext} from "$auth/api/auth.middleware";
import {handle, optionToResult} from "@core/type";
import {checkPermission} from "$permission/infra/role.service";

type Input = {
    auth: AuthContext;
    body: CreateRoleRequest
}

type Output = {
    role: Role;
    permissions: Permission[];
};

const _createRole = ({auth, body}: Input): ResultAsync<Output, ApiError> => {

    const createdRole = opTx(db, async (tx) => {
        const repo = roleRepo(tx);
        const createdRole = await repo.create({createdBy: auth.user.id, name: body.name, description: body.description, isActive: true});

        if (createdRole.isErr()) {
            throw createdRole.error;
        }
        const role = createdRole.value;

        if (body.permissions) {
            const addedPerms = await checkPermission(tx, body.permissions).andThen((perm) =>
                repo.addPermissions(role.id, perm.map((p) => p.id))
            );

            if (addedPerms.isErr()) {
                throw addedPerms.error;
            }
        }
        return role;
    })

    const result  = createdRole.andThen((role) => {
        return roleRepo(db).findByIdWithPermissions(role.id)
            .andThen((role) => optionToResult(role, apiError(ApiErrorCode.BAD_REQUEST, 'Role not found !')))
            .map(([role, permissions]) => {
                return {
                    role: role,
                    permissions: permissions,
                };
            })
    });

    return handle(result);
}



export default _trace(_createRole, 'app.permission/create-role');
