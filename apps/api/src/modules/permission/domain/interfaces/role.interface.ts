import { ResultAsync } from "neverthrow";
import { Option } from "fp-ts/Option";
import { DbException } from "@core/exceptions";
import {CreateRole, Role, UpdateRole} from "$permission/domain/entity/role.entity";
import {Permission} from "$permission/domain/entity/permission.entity";

type Result<T> = ResultAsync<T, DbException>;

export type RoleInterface = {
  list: (page?: number, limit?: number) => Result<Role[]>;

  findById: (id: string) => Result<Option<Role>>;
  findByIdWithPermissions: (id: string) => Result<Option<[Role, Permission[]]>>;
  findByName: (name: string) => Result<Option<Role>>;

  create: (body: CreateRole) => Result<Role>;
  update: (id: string, body: UpdateRole) => Result<Role>;
  delete: (id: string) => Result<void>;
  softDelete: (id: string, deletedBy?: string) => Result<void>;

  addPermission: (roleId: string, permissionId: string) => Result<void>;
  removePermission: (roleId: string, permissionId: string) => Result<void>;
  getPermissions: (roleId: string) => Result<Permission[]>;
}