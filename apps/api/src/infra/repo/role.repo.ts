import { mapPermission, permission } from "@infra/schema/permission.schema";
import { role_permission } from "@infra/schema/role-permission.schema";
import { op } from "@infra/utils/db.utils";
import { notEmpty, oneOreResultOption, oneOrThrow } from "@infra/utils/type.utils";
import type { RoleInterface } from "@interface/role.interface";
import { mapRole, mapRoleOption, mapRoles, role } from "@schema/role.schema";
import { and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, inArray, isNull } from "drizzle-orm/sql/expressions/conditions";
import { none } from "fp-ts/lib/Option";
import { some } from "fp-ts/Option";

export default (client: NodePgDatabase): RoleInterface => ({
	create: (body) => {
		return op(
			client
				.insert(role)
				.values({
					name: body.name,
					description: body.description,
					createdBy: body.createdBy ?? null,
					updatedBy: null,
					deletedBy: null,
					isBuiltIn: body.isBuiltIn,
					isDefault: body.isDefault,
				})
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Role not created")))
			.map(mapRole);
	},

	findDefault: () => {
		return op(
			client
				.select()
				.from(role)
				.where(and(eq(role.isDefault, true), isNull(role.deletedAt))),
		)
			.andThen((r) => oneOrThrow(r, new Error("Default role not found")))
			.map(mapRole);
	},

	findById: (id) => {
		return op(
			client
				.select()
				.from(role)
				.where(and(eq(role.id, id), isNull(role.deletedAt))),
		)
			.andThen(oneOreResultOption)
			.map(mapRoleOption);
	},

	list: (page = 1, limit = 10) => {
		return op(
			client
				.select()
				.from(role)
				.limit(limit)
				.offset((page - 1) * limit)
				.where(isNull(role.deletedAt)),
		).map((a) => a.map(mapRole));
	},

	deletes: (ids) => {
		return op(
			client
				.delete(role)
				.where(and(isNull(role.deletedAt), inArray(role.id, ids)))
				.returning(),
		).map(mapRoles);
	},

	delete: (id) => {
		return op(
			client
				.delete(role)
				.where(and(eq(role.id, id), isNull(role.deletedAt)))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Role not found")))
			.map(mapRole);
	},

	update: (id, body) => {
		return op(
			client
				.update(role)
				.set({
					name: body.name,
					description: body.description,
					updatedBy: body.updatedBy,
					updatedAt: new Date(),
				})
				.where(and(eq(role.id, id), isNull(role.deletedAt)))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Role not found")))
			.map(mapRole);
	},

	findByName: (name) => {
		return op(
			client
				.select()
				.from(role)
				.where(and(eq(role.name, name), isNull(role.deletedAt))),
		)
			.andThen(oneOreResultOption)
			.map(mapRoleOption);
	},

	softDelete: (id, deletedBy) => {
		return op(
			client
				.update(role)
				.set({
					deletedAt: new Date(),
					deletedBy,
				})
				.where(and(eq(role.id, id), isNull(role.deletedAt)))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Role not found")))
			.map(mapRole);
	},

	addPermissions: (roleId, permissionId) => {
		return op(
			client
				.insert(role_permission)
				.values(
					permissionId.map((p) => ({
						roleId,
						permissionId: p,
					})),
				)
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Failed to add permissions")))
			.map(() => {});
	},

	getPermissions: (id) => {
		return op(
			client
				.select({ permission })
				.from(permission)
				.innerJoin(role_permission, and(eq(role_permission.roleId, id), eq(role_permission.permissionId, permission.id))),
		).map((a) => a.map((b) => mapPermission(b.permission)));
	},

	removePermissions: (id, permissionIds) => {
		return op(
			client
				.delete(role_permission)
				.where(and(eq(role_permission.roleId, id), inArray(role_permission.permissionId, permissionIds)))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new Error("Failed to remove permissions")))
			.map(() => {});
	},

	findByIdWithPermissions: (id) => {
		return op(
			client
				.select({ role, permission })
				.from(role)
				.leftJoin(role_permission, eq(role_permission.roleId, role.id))
				.leftJoin(permission, eq(role_permission.permissionId, permission.id))
				.where(and(eq(role.id, id), isNull(role.deletedAt))),
		).map((a) => {
			if (a.length === 0) {
				return none;
			}
			const permission = a
				.map((row) => row.permission)
				.filter(notEmpty)
				.map(mapPermission);
			return some([mapRole(a[0].role), permission]);
		});
	},

	findByNameWithPermissions: (name) => {
		return op(
			client
				.select({ role, permission })
				.from(role)
				.leftJoin(role_permission, eq(role_permission.roleId, role.id))
				.leftJoin(permission, eq(role_permission.permissionId, permission.id))
				.where(and(eq(role.name, name), isNull(role.deletedAt))),
		).map((a) => {
			if (a.length === 0) {
				return none;
			}
			const permission = a
				.map((row) => row.permission)
				.filter(notEmpty)
				.map(mapPermission);
			return some([mapRole(a[0].role), permission]);
		});
	},

	deleteManyByName: (names) => {
		return op(client.delete(role).where(inArray(role.name, names)).returning()).map(mapRoles);
	},
});
