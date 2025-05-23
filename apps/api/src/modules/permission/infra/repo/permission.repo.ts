import {PermissionInterface} from "$permission/domain/interfaces/permission.interface";
import {db, DbPool, op} from "@core/db";
import {traceRepository} from "@core/instrumentation";
import {eq} from "drizzle-orm";
import {oneOreResultOption, oneOrThrow} from "@core/type";
import {permission} from "$permission/infra/schema/permission.schema";
import {mapPermission, mapPermissionOption, mapPermissions} from "$permission/infra/permission.infra";
import {inArray} from "drizzle-orm/sql/expressions/conditions";

const permissionRepo = (client: DbPool = db): PermissionInterface => ({

  findByIds: (ids) => {
    return op(client.select().from(permission).where(inArray(permission.id, ids)))
      .map(mapPermissions)
  },

  findById: (id) => {
    return op(db.select().from(permission).where(eq(permission.id, id)))
      .andThen(oneOreResultOption)
      .map(mapPermissionOption)
  },

  update: (id, body) => {
    return op(client.update(permission).set({
      name: body.name,
      description: body.description,
      resource: body.resource,
      action: body.action,
      attributes: body.attributes,
      updatedBy: body.updatedBy
    }).where(eq(permission.id, id)).returning())
      .andThen(oneOrThrow)
      .map(mapPermission)
  },

  create: (body) => {
    return op(client.insert(permission).values({
      name: body.name,
      description: body.description,
      resource: body.resource,
      action: body.action,
      attributes: body.attributes,
      createdBy: body.createdBy
    }).returning())
      .andThen(oneOrThrow)
      .map(mapPermission)
  },

  delete: (id) => {
    return op(client.delete(permission).where(eq(permission.id, id)).returning())
      .andThen(oneOrThrow)
      .map(() => undefined)
  },

  softDelete: (id, deletedBy) => {
    return op(client.update(permission).set({
      deletedAt: new Date(),
      deletedBy
    }).where(eq(permission.id, id)).returning())
      .andThen(oneOrThrow)
      .map(() => undefined)
  },

  findByApiName: (name) => {
    return op(client.select().from(permission).where(eq(permission.name, name)))
      .andThen(oneOreResultOption)
      .map(mapPermissionOption)
  },

  list: (page, limit) => {
    return op(client.select().from(permission).limit(limit).offset((page - 1) * limit))
        .map(mapPermissions)
  }

});

export default (client: DbPool) => traceRepository(permissionRepo(client), {
  create: {
    name: 'repo.permission/create',
  },
  findById: {
    name: 'repo.permission/findPermissionByName',
  },
  findByApiName: {
    name: 'repo.permission/findPermissionById',
  },
  delete: {
    name: 'repo.permission/delete',
  },
  update: {
    name: 'repo.permission/update',
  },
  list: {
    name: 'repo.permission/list',
  }
})