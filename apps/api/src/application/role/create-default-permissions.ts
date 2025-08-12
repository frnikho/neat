import permissionRepo from '@infra/repo/permission.repo';
import { db } from '@infra/service/db.service';
import { getAllPermission } from '@infra/service/permission.service';
import { ok } from 'neverthrow';

export default () => {
  return permissionRepo(db)
    .list(1, 20_000)
    .andThen((permissions) => {
      const notExistingPermissions = getAllPermission().filter(
        (bp) => !permissions.some((p) => p.name === bp.name)
      );

      if (notExistingPermissions.length <= 0) {
        return ok([]);
      }

      return permissionRepo(db).creates(
        notExistingPermissions.map((p) => ({
          name: p.name,
          action: p.action,
          resource: p.resource,
          createdBy: null,
          description: `${p.name} (${p.resource}.${p.action})`,
        }))
      );
    });
};
