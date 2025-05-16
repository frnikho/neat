import {InferSelectModel} from "drizzle-orm";
import {permission} from "$permission/infra/schema/permission.schema";
import {Permission} from "$permission/domain/entity/permission.entity";
import {isNone, none, Option, some} from "fp-ts/Option";

type PermissionDb = InferSelectModel<typeof permission>;

export const mapPermission = (row: PermissionDb): Permission => {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    resource: row.resource,
    action: row.action,
    attributes: row.attributes ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt ?? undefined,
    createdBy: row.createdBy ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
    deletedAt: row.deletedAt ?? undefined,
    deletedBy: row.deletedBy ?? undefined
  }
}

export const mapPermissionOption = (row: Option<PermissionDb>): Option<Permission> => {
  if (isNone(row)) {
    return none
  }
  return some(mapPermission(row.value))
}