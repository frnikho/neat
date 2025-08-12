import permissionRepo from '@infra/repo/permission.repo';
import roleRepo from '@infra/repo/role.repo';
import { db } from '@infra/service/db.service';
import { defaultRoles } from '@infra/service/role.service';
import { isNone } from 'fp-ts/lib/Option';
import { ok, ResultAsync } from 'neverthrow';

export default () => {
  const permissionsResult = permissionRepo(db).list(1, 20_000);

  const mappedRolesResult = permissionsResult.andThen((permissions) => {
    const permissionMap = new Map(
      permissions.map((p) => [`${p.resource}.${p.action}`, p.id])
    );

    const mappedRoles = defaultRoles.map((role) => ({
      ...role,
      permissions: role.permissions
        .map((p) => permissionMap.get(p))
        .filter((id): id is string => !!id),
    }));

    return ok(mappedRoles);
  });

  const rolesToCreateResult = mappedRolesResult.andThen((mappedRoles) => {
    const checks = mappedRoles.map((mappedRole) =>
      roleRepo(db)
        .findByNameWithPermissions(mappedRole.name)
        .andThen((maybeRole) => {
          if (isNone(maybeRole)) return ok(true); // role absent => à créer

          const [_, currentPermissions] = maybeRole.value;
          const currentKeys = currentPermissions.map(
            (p) => `${p.resource}.${p.action}`
          );
          const requiredKeys =
            defaultRoles.find((r) => r.name === mappedRole.name)?.permissions ??
            [];

          const missing = requiredKeys.some(
            (perm) => !currentKeys.includes(perm)
          );
          return ok(missing); // role incomplet => à recréer
        })
        .map((shouldCreate) => (shouldCreate ? mappedRole : null))
    );

    return ResultAsync.combine(checks).map((res) =>
      res.filter((r): r is (typeof mappedRoles)[number] => r !== null)
    );
  });

  return rolesToCreateResult.andThen((rolesToCreate) => {
    if (rolesToCreate.length === 0) return ok();

    const deleteResult = roleRepo(db).deleteManyByName(
      rolesToCreate.map((r) => r.name)
    );

    return deleteResult
      .andThen(() => {
        return ResultAsync.combine(
          rolesToCreate.map((role) =>
            roleRepo(db).create({
              ...role,
              isBuiltIn: true,
              isDefault: role.default,
            })
          )
        );
      })
      .andThen((createdRoles) => {
        const assignResult = ResultAsync.combine(
          createdRoles.map((createdRole) => {
            const original = rolesToCreate.find(
              (r) => r.name === createdRole.name
            )!;
            return roleRepo(db).addPermissions(
              createdRole.id,
              original.permissions
            );
          })
        );
        return assignResult.map(() => {});
      });
  });
};
