import type { Role, RoleWithPermissions } from '@entity/role.entity';
import type { DbException } from '@infra/exception/db.exception';
import type { ResultAsync } from 'neverthrow';

type Result<T> = ResultAsync<T, DbException>;

export type UserRoleInterface = {
  add: (userId: string, roleId: string) => Result<void>;
  remove: (userId: string, roleId: string) => Result<void>;
  list: (userId: string) => Result<Role[]>;
  findRoleAndPermissions: (userId: string) => Result<RoleWithPermissions[]>;
};
