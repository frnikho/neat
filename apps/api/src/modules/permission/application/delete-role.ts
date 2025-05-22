import {ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {Role} from "$permission/domain/entity/role.entity";
import roleRepo from "$permission/infra/repo/role.repo";
import {AuthContext} from "$auth/api/auth.middleware";
import {db} from "@core/db";
import {handle} from "@core/type";

type Input = {
    auth: AuthContext;
    roleId: string;
}

type Output = {
    role: Role;
};

const deleteRole = ({roleId, auth}: Input): ResultAsync<Output, ApiError> => {
    const result = roleRepo(db).softDelete(roleId, auth.user.id)
        .map((role) => ({
            role
        }));

    return handle(result);
}

export default _trace(deleteRole, 'app.permission/delete-role');