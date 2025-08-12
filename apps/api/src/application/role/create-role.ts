import { apiErrorCodeToStatus } from '@api/api.exception';
import { appException } from '@application/app.exception';
import type { AuthContext } from '@entity/auth-context.entity';
import type { Permission } from '@entity/permission.entity';
import type { Role } from '@entity/role.entity';
import roleRepo from '@infra/repo/role.repo';
import { db, opTx } from '@infra/service/db.service';
import { checkPermission } from '@infra/service/role.service';
import { optionToResult } from '@infra/utils/type.utils';
import { ok, type ResultAsync } from 'neverthrow';

type Input = {
  auth: AuthContext;
  body: {
    name: string;
    description: string;
    permissions?: string[];
  };
};

type Output = {
  role: Role;
  permissions: Permission[];
};

export default ({ auth, body }: Input): ResultAsync<Output, Error> => {
  const createdRole = opTx(db, (tx) => {
    const repo = roleRepo(tx);

    return repo
      .create({
        createdBy: auth.user.id,
        name: body.name,
        description: body.description,
        isActive: true,
      })
      .andThen((role) => {
        if (!body.permissions) {
          return ok(role);
        }
        return checkPermission(tx, body.permissions).andThen((perms) =>
          repo
            .addPermissions(
              role.id,
              perms.map((p) => p.id)
            )
            .map(() => role)
        );
      });
  });

  return createdRole.andThen((role) => {
    return roleRepo(db)
      .findByIdWithPermissions(role.id)
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
  });
};
