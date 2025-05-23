import {InferSelectModel} from "drizzle-orm";
import {isNone, none, Option, some} from "fp-ts/Option";
import {role} from "$permission/infra/schema/role.schema";
import {Role} from "$permission/domain/entity/role.entity";

type RoleDb = InferSelectModel<typeof role>;

export const mapRole = (row: RoleDb): Role => {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    isActive: row.isActive,
    createdAt: row.createdAt,
    createdBy: row.createdBy ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
    deletedAt: row.deletedAt ?? undefined,
    deletedBy: row.deletedBy ?? undefined
  }
}

export const mapRoleOption = (row: Option<RoleDb>): Option<Role> => {
  if (isNone(row)) {
    return none
  }
  return some(mapRole(row.value))
}

export const mapRoles = (rows: RoleDb[]): Role[] => {
  return rows.map(mapRole)
}