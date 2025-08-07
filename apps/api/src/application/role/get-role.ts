import type {ResultAsync} from "neverthrow";
import roleRepo from "@infra/repo/role.repo";
import {db} from "@infra/service/db.service";
import { AuthContext } from "@entity/auth-context.entity";
import {Role} from "@entity/role.entity";
import {Permission} from "@entity/permission.entity";
import {optionToResult} from "@infra/utils/type.utils";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";

type Input = {
    auth: AuthContext;
    roleId: string;
}

type Output = {
    role: Role;
    permissions: Permission[];
};

export default ({roleId}: Input): ResultAsync<Output, Error> => {
    return roleRepo(db).findByIdWithPermissions(roleId)
        .andThen((role) => optionToResult(role, appException(apiErrorCodeToStatus.BAD_REQUEST, 'Role not found !')))
        .map(([role, permissions]) => {
            return {
                role: role,
                permissions: permissions,
            };
        });
}