import { DbException } from '@infra/exception/db.exception';
import permissionRepo from '@infra/repo/permission.repo';
import type { AllPermissions } from '@service/permission.service';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { err, ok } from 'neverthrow';

type Role = {
  name: string;
  description: string;
  permissions: AllPermissions[];
  default: boolean;
};

export const defaultRoles: Role[] = [
  {
    name: 'DEFAULT',
    description: '',
    permissions: [
      'auth.me',
      'user.read.own',
      'user.write.own',
      'user.delete.own',
      'role.read.own',
    ],
    default: true,
  },
  {
    name: 'ADMIN',
    description: '',
    permissions: ['role.*', 'user.*', 'auth.*'],
    default: false,
  },
];

export const checkPermission = (db: NodePgDatabase, perms: string[]) => {
  return permissionRepo(db)
    .findByIds(perms)
    .andThen((permissions) => {
      const foundIds = new Set(permissions.map((p) => p.id));
      const missing = perms.filter((id) => !foundIds.has(id));
      if (missing.length > 0) {
        return err(
          new DbException('Some permissions not found: ' + missing.join(','))
        );
      }

      return ok(permissions);
    });
};
