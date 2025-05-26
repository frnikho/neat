import {ResultAsync} from "neverthrow";
import {DbException} from "@core/exceptions";
import {Role, RoleWithPermissions} from "$permission/domain/entity/role.entity";

type Result<T> = ResultAsync<T, DbException>;

export type UserRoleInterface = {
  add: (userId: string, roleId: string) => Result<void>;
  remove: (userId: string, roleId: string) => Result<void>;
  list: (userId: string) => Result<Role[]>;
  findRoleAndPermissions: (userId: string) => Result<RoleWithPermissions[]>;
}