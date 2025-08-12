import { DbException } from '@infra/exception/db.exception';
import { op } from '@infra/utils/db.utils';
import { oneOreResultOption, oneOrThrow } from '@infra/utils/type.utils';
import type { PermissionInterface } from '@interface/permission.interface';
import {
  mapPermission,
  mapPermissionOption,
  mapPermissions,
  permission,
} from '@schema/permission.schema';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { inArray } from 'drizzle-orm/sql/expressions/conditions';

export default (client: NodePgDatabase): PermissionInterface => ({
  findByIds: (ids) => {
    return op(
      client.select().from(permission).where(inArray(permission.id, ids))
    ).map(mapPermissions);
  },

  findById: (id) => {
    return op(client.select().from(permission).where(eq(permission.id, id)))
      .andThen(oneOreResultOption)
      .map(mapPermissionOption);
  },

  update: (id, body) => {
    return op(
      client
        .update(permission)
        .set({
          name: body.name,
          description: body.description,
          resource: body.resource,
          action: body.action,
          attributes: body.attributes,
          updatedBy: body.updatedBy,
        })
        .where(eq(permission.id, id))
        .returning()
    )
      .andThen((res) =>
        oneOrThrow(res, new DbException('Permission not found'))
      )
      .map(mapPermission);
  },

  create: (body) => {
    return op(
      client
        .insert(permission)
        .values({
          name: body.name,
          description: body.description,
          resource: body.resource,
          action: body.action,
          attributes: body.attributes,
          createdBy: body.createdBy,
          updatedBy: null,
          deletedBy: null,
        })
        .returning()
    )
      .andThen((res) =>
        oneOrThrow(res, new DbException('Permission not created'))
      )
      .map(mapPermission);
  },

  creates: (bodies) => {
    return op(
      client
        .insert(permission)
        .values(
          bodies.map((body) => ({
            name: body.name,
            description: body.description,
            resource: body.resource,
            action: body.action,
            attributes: body.attributes,
            createdBy: body.createdBy,
            updatedBy: null,
            deletedBy: null,
          }))
        )
        .returning()
    ).map(mapPermissions);
  },

  delete: (id) => {
    return op(
      client.delete(permission).where(eq(permission.id, id)).returning()
    )
      .andThen((res) =>
        oneOrThrow(res, new DbException('Permission not found'))
      )
      .map(() => {});
  },

  softDelete: (id, deletedBy) => {
    return op(
      client
        .update(permission)
        .set({
          deletedAt: new Date(),
          deletedBy,
        })
        .where(eq(permission.id, id))
        .returning()
    )
      .andThen((r) => oneOrThrow(r, new DbException('Permission not found')))
      .map(() => {});
  },

  findByApiName: (name) => {
    return op(client.select().from(permission).where(eq(permission.name, name)))
      .andThen(oneOreResultOption)
      .map(mapPermissionOption);
  },

  list: (page, limit) => {
    return op(
      client
        .select()
        .from(permission)
        .limit(limit)
        .offset((page - 1) * limit)
    ).map(mapPermissions);
  },
});
