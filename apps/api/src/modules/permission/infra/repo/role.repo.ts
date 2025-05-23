import {RoleInterface} from "$permission/domain/interfaces/role.interface";
import {DbPool, op} from "@core/db";
import {role} from "$permission/infra/schema/role.schema";
import {notEmpty, oneOreResultOption, oneOrThrow} from "@core/type";
import {mapRole, mapRoleOption, mapRoles} from "$permission/infra/role.infra";
import {and, eq, isNull} from "drizzle-orm";
import {traceRepository} from "@core/instrumentation";
import {role_permission} from "$permission/infra/schema/role-permission.schema";
import {permission} from "$permission/infra/schema/permission.schema";
import {mapPermission} from "$permission/infra/permission.infra";
import {none, some} from "fp-ts/Option";
import {inArray} from "drizzle-orm/sql/expressions/conditions";

const roleRepo = (client: DbPool): RoleInterface => ({
  create: (body) => {
    return op(client.insert(role).values({
      name: body.name,
      description: body.description,
      createdBy: body.createdBy,
      updatedBy: null,
      deletedBy: null,
    }).returning())
      .andThen(oneOrThrow)
      .map(mapRole)
  },

  findById: (id) => {
    return op(client.select().from(role).where(and(
        eq(role.id, id),
        isNull(role.deletedAt)
    )))
      .andThen(oneOreResultOption)
      .map(mapRoleOption)
  },

  list: (page = 1, limit = 10) => {
    return op(client.select().from(role).limit(limit).offset((page - 1) * limit).where(isNull(role.deletedAt)))
      .map((a) => a.map(mapRole))
  },

  deletes: (ids) => {
    return op(client.delete(role).where(and(
        isNull(role.deletedAt),
        inArray(role.id, ids)
    )).returning())
      .map(mapRoles)
  },

  delete: (id) => {
    return op(client.delete(role).where(and(
        eq(role.id, id),
        isNull(role.deletedAt)
    )).returning())
      .andThen(oneOrThrow)
      .map(mapRole)
  },

  update: (id, body) => {
    return op(client.update(role).set({
      name: body.name,
      description: body.description,
      updatedBy: body.updatedBy,
      updatedAt: new Date(),
    }).where(and(
        eq(role.id, id),
        isNull(role.deletedAt)
    )).returning())
      .andThen(oneOrThrow)
      .map(mapRole)
  },

  findByName: (name) => {
    return op(client.select().from(role).where(and(
        eq(role.name, name),
        isNull(role.deletedAt)
    )))
      .andThen(oneOreResultOption)
      .map(mapRoleOption)
  },

  softDelete: (id, deletedBy) => {
    return op(client.update(role).set({
      deletedAt: new Date(),
      deletedBy
    }).where(and(
        eq(role.id, id),
        isNull(role.deletedAt)
    )).returning())
      .andThen(oneOrThrow)
      .map(mapRole)
  },

  addPermissions: (roleId, permissionId) => {
    return op(client.insert(role_permission).values(permissionId.map((p) => ({
      roleId,
      permissionId: p
    }))).returning())
      .andThen(oneOrThrow)
      .map(() => undefined)
  },

  getPermissions: (id)=> {
    return op(client.select({permission}).from(permission).innerJoin(role_permission, and(eq(role_permission.roleId, id), eq(role_permission.permissionId, permission.id))))
      .map((a) => a.map((b) => mapPermission(b.permission)))
  },

  removePermissions: (id, permissionIds) => {
    return op(client.delete(role_permission).where(and(eq(role_permission.roleId, id), inArray(role_permission.permissionId, permissionIds))).returning())
      .andThen(oneOrThrow)
      .map(() => undefined)
  },

  findByIdWithPermissions: (id) => {
    return op(client.select({role, permission})
      .from(role)
      .leftJoin(role_permission, eq(role_permission.roleId, role.id))
      .leftJoin(permission, eq(role_permission.permissionId, permission.id))
      .where(and(
          eq(role.id, id),
          isNull(role.deletedAt)
      ))
    ).map((a) => {
      if (a.length === 0) {
        return none
      }
      const permission = a
        .map((row) => row.permission)
        .filter(notEmpty)
        .map(mapPermission)
      return some([mapRole(a[0].role), permission])
    })
  }
});

export default (client: DbPool) => traceRepository(roleRepo(client), {
  create: {
    name: 'repo.role/create',
  },
  findById: {
    name: 'repo.role/find-by-id',
  },
  findByName: {
    name: 'repo.role/find-permission-by-name',
  },
  update: {
    name: 'repo.role/update',
  },
  delete: {
    name: 'repo.role/delete',
  },
  softDelete: {
    name: 'repo.role/soft-delete',
  },
  addPermissions: {
    name: 'repo.role/add-permissions',
  },
  removePermissions: {
    name: 'repo.role/remove-permissions',
  },
  getPermissions: {
    name: 'repo.role/get-permissions',
  }
});