import type {ResultAsync} from "neverthrow";
import {DbException} from "@infra/exception/db.exception";
import {Role, RoleWithPermissions} from "@entity/role.entity";

type Result<T> = ResultAsync<T, DbException>;

export type UserRoleInterface = {
    add: (userId: string, roleId: string) => Result<void>;
    remove: (userId: string, roleId: string) => Result<void>;
    list: (userId: string) => Result<Role[]>;
    findRoleAndPermissions: (userId: string) => Result<RoleWithPermissions[]>;
}