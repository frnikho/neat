import { apiErrorCodeToStatus } from '@api/api.exception';
import { appException } from '@application/app.exception';
import type { AuthContext } from '@entity/auth-context.entity';
import type { Permission } from '@entity/permission.entity';
import type { Role } from '@entity/role.entity';
import roleRepo from '@infra/repo/role.repo';
import { db, opTx } from '@infra/service/db.service';
import { checkPermission } from '@infra/service/role.service';
import { optionToResult } from '@infra/utils/type.utils';
import { okAsync, type ResultAsync } from 'neverthrow';

type Input = {
  auth: AuthContext;
  roleId: string;
  body: {
    name?: string;
    description?: string;
    permissions?: string[];
  };
};

type Output = {
  role: Role;
  permissions: Permission[];
};

export default ({ roleId, body }: Input): ResultAsync<Output, Error> => {
  const repo = roleRepo(db);

  return repo
    .findById(roleId)
    .andThen((role) =>
      optionToResult(
        role,
        appException(apiErrorCodeToStatus.BAD_REQUEST, 'Role not found !')
      )
    )
    .andThen((role) =>
      repo.update(role.id, body).andThen((updatedRole) => {
        if (!body.permissions) {
          return okAsync(updatedRole);
        }

        return opTx(db, (tx) => {
          const txRepo = roleRepo(tx);

          return checkPermission(tx, body.permissions!)
            .andThen((perms) =>
              txRepo
                .removePermissions(
                  updatedRole.id,
                  perms.map((p) => p.id)
                )
                .map(() => perms)
            )
            .andThen((perms) =>
              txRepo.addPermissions(
                updatedRole.id,
                perms.map((p) => p.id)
              )
            )
            .map(() => updatedRole);
        });
      })
    )
    .andThen((role) => repo.findByIdWithPermissions(role.id))
    .andThen((maybeRole) =>
      optionToResult(
        maybeRole,
        appException(apiErrorCodeToStatus.BAD_REQUEST, 'Role not found !')
      )
    )
    .map(([role, permissions]) => ({
      role,
      permissions,
    }));
};
