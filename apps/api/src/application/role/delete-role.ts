import type {ResultAsync} from "neverthrow";
import roleRepo from "@infra/repo/role.repo";
import {db} from "@infra/service/db.service";
import { AuthContext } from "@entity/auth-context.entity";
import {Role} from "@entity/role.entity";

type Input = {
    auth: AuthContext;
    roleId: string;
}

type Output = {
    role: Role;
};

export default ({roleId, auth}: Input): ResultAsync<Output, Error> => {
    return roleRepo(db).softDelete(roleId, auth.user.id)
        .map((role) => ({
            role
        }));
}