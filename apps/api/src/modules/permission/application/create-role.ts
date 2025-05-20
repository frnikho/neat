import {err, errAsync, fromPromise, ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {CreateRoleRequest} from "$permission/api/role.request";
import {Role} from "$permission/domain/entity/role.entity";
import {Permission} from "$permission/domain/entity/permission.entity";
import roleRepo from "$permission/infra/repo/role.repo";
import {db} from "@core/db";
import {AuthContext} from "$auth/api/auth.middleware";

type Input = {
    auth: AuthContext;
    body: CreateRoleRequest
}

type Output = {
    role: Role;
    permissions: Permission[];
};

const _createRole = ({auth, body}: Input): ResultAsync<Output, ApiError> => {

    let createdRole = fromPromise(db.transaction(async (tx) => {
        const repo = roleRepo(tx);

        console.log({createdBy: auth.user.id, name: body.name, description: body.description, isActive: true});

        const createdRole = await repo.create({createdBy: auth.user.id, name: body.name, description: body.description, isActive: true});

        if (createdRole.isErr()) {
            throw createdRole.error;
        }

        const role = createdRole.value;

        if (body.permission) {
            const addedPerms = await repo.addPermissions(role.id, body.permission);
            if (addedPerms.isErr()) {
                console.log('ERRRROR !');
                throw addedPerms.error;
            }
        }

        return role;
    }), (e) => e);

    /*const result = createdRole
        .andThen((role) =>
            roleRepo(db).findByIdWithPermissions(role.id).andThen((role) => optionToResult(role, apiError(ApiErrorCode.INTERNAL_ERROR, 'Role not found after creation !'))
            )
    );*/



    const a = createdRole.match((role) => {
        console.log(role);
    }, (err) => {
        console.log('ERR !', err);
    })

    const b = createdRole.map((role) => {
        console.log('ROLE !', role);
    })

    return errAsync(apiError(ApiErrorCode.INTERNAL_ERROR, 'not implemented !'));
}

export default _trace(_createRole, 'app.permission/create-role');
