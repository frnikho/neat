import type { RoleWithPermissions } from '@entity/role.entity';
import { mapPermission, permission } from '@infra/schema/permission.schema';
import { mapRole, role } from '@infra/schema/role.schema';
import { role_permission } from '@infra/schema/role-permission.schema';
import { user_role } from '@infra/schema/user-role.schema';
import { op } from '@infra/utils/db.utils';
import type { UserRoleInterface } from '@interface/user-role.interface';
import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export default (client: NodePgDatabase): UserRoleInterface => ({
  add: (userId, roleId) => {
    return op(
      client.insert(user_role).values({
        userId,
        roleId,
      })
    ).map(() => {});
  },

  remove: (userId, roleId) => {
    return op(
      client
        .delete(user_role)
        .where(and(eq(user_role.userId, userId), eq(user_role.roleId, roleId)))
    ).map(() => {});
  },

  list: (userId) => {
    return op(
      client
        .select({ role })
        .from(user_role)
        .innerJoin(role, eq(user_role.userId, userId))
        .where(eq(user_role.userId, userId))
    ).map((a) => a.map((row) => mapRole(row.role)));
  },

  findRoleAndPermissions: (userId) => {
    return op(
      client
        .select({ role, permission })
        .from(user_role)
        .innerJoin(role, eq(user_role.roleId, role.id))
        .leftJoin(role_permission, eq(role.id, role_permission.roleId))
        .leftJoin(permission, eq(role_permission.permissionId, permission.id))
        .where(eq(user_role.userId, userId))
    ).map((rows) => {
      const roleMap = new Map<string, RoleWithPermissions>();

      for (const row of rows) {
        if (!roleMap.has(row.role.id)) {
          roleMap.set(row.role.id, {
            role: mapRole(row.role),
            permissions: [],
          });
        }
        if (row.permission) {
          roleMap
            .get(row.role.id)!
            .permissions.push(mapPermission(row.permission));
        }
      }
      return Array.from(roleMap.values());
    });
  },
});
