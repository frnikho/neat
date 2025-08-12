import { apiErrorCodeToStatus } from '@api/api.exception';
import { appException } from '@application/app.exception';
import type { AuthContext } from '@entity/auth-context.entity';
import type { Permission } from '@entity/permission.entity';
import type { Role } from '@entity/role.entity';
import roleRepo from '@infra/repo/role.repo';
import { db } from '@infra/service/db.service';
import { optionToResult } from '@infra/utils/type.utils';
import type { ResultAsync } from 'neverthrow';

type Input = {
  auth: AuthContext;
  roleId: string;
};

type Output = {
  role: Role;
  permissions: Permission[];
};

export default ({ roleId }: Input): ResultAsync<Output, Error> => {
  return roleRepo(db)
    .findByIdWithPermissions(roleId)
    .andThen((role) =>
      optionToResult(
        role,
        appException(apiErrorCodeToStatus.BAD_REQUEST, 'Role not found !')
      )
    )
    .map(([role, permissions]) => {
      return {
        role,
        permissions,
      };
    });
};
