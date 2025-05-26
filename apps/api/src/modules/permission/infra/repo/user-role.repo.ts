import {UserRoleInterface} from "$permission/domain/interfaces/user-role.interface";
import {db, DbPool, op} from "@core/db";
import {traceRepository} from "@core/instrumentation";
import {user_role} from "$permission/infra/schema/user-role.schema";
import {and, eq} from "drizzle-orm";
import {role} from "$permission/infra/schema/role.schema";
import {mapRole} from "$permission/infra/role.infra";
import {permission} from "$permission/infra/schema/permission.schema";
import {role_permission} from "$permission/infra/schema/role-permission.schema";
import {RoleWithPermissions} from "$permission/domain/entity/role.entity";
import {mapPermission} from "$permission/infra/permission.infra";

const userRoleRepo = (client: DbPool = db): UserRoleInterface => ({
    add: (userId, roleId) => {
        return op(client.insert(user_role).values({
            userId,
            roleId
        })).map(() => undefined)
    },

    remove: (userId, roleId) => {
        return op(client.delete(user_role).where(and(eq(user_role.userId, userId), eq(user_role.roleId, roleId))))
            .map(() => undefined)
    },

    list: (userId) => {
        return op(client.select({role})
            .from(user_role)
            .innerJoin(role, eq(user_role.roleId, userId))
            .where(eq(user_role.userId, userId))
        ).map((a) => a.map((row) => mapRole(row.role)))
    },

    findRoleAndPermissions: (userId) => {
        return op(db.select({role, permission: permission,})
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
                    roleMap.get(row.role.id)!.permissions.push(mapPermission(row.permission));
                }
            }
            return Array.from(roleMap.values());
        });
    }
});

export default (db: DbPool) => traceRepository(userRoleRepo(db), {
    add: {
        name: 'repo.user-role/add',
    },
    remove: {
        name: 'repo.user-role/remove',
    },
    list: {
        name: 'repo.user-role/list',
    },
    findRoleAndPermissions: {
        name: 'repo.user-role/find-role-and-permissions',
    }
});