import type { Permission } from '@entity/permission.entity';
import type { CreateRole, Role, UpdateRole } from '@entity/role.entity';
import type { DbException } from '@infra/exception/db.exception';
import type { Option } from 'fp-ts/Option';
import type { ResultAsync } from 'neverthrow';

type Result<T> = ResultAsync<T, DbException>;

export type RoleInterface = {
  list: (page?: number, limit?: number) => Result<Role[]>;

  findDefault: () => Result<Role>;
  findById: (id: string) => Result<Option<Role>>;
  findByIdWithPermissions: (id: string) => Result<Option<[Role, Permission[]]>>;
  findByName: (name: string) => Result<Option<Role>>;
  findByNameWithPermissions: (
    name: string
  ) => Result<Option<[Role, Permission[]]>>;

  create: (body: CreateRole) => Result<Role>;
  update: (id: string, body: UpdateRole) => Result<Role>;
  delete: (id: string) => Result<Role>;
  deleteManyByName: (names: string[]) => Result<Role[]>;
  deletes: (ids: string[]) => Result<Role[]>;
  softDelete: (id: string, deletedBy?: string) => Result<Role>;

  addPermissions: (roleId: string, permissionId: string[]) => Result<void>;
  removePermissions: (roleId: string, permissionId: string[]) => Result<void>;
  getPermissions: (roleId: string) => Result<Permission[]>;
};
