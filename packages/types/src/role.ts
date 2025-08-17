import { type Static, Type } from "@sinclair/typebox";
import {IsoDate} from "./date";

export const createRoleRequest = Type.Object({
	name: Type.String({ maxLength: 256 }),
	description: Type.String({ maxLength: 4096 }),
	permissions: Type.Optional(Type.Array(Type.String())),
});

export type CreateRoleRequest = Static<typeof createRoleRequest>;

export const updateRoleRequest = Type.Object({
	name: Type.Optional(Type.String({ maxLength: 256 })),
	description: Type.Optional(Type.String({ maxLength: 4096 })),
	permissions: Type.Optional(Type.Array(Type.String())),
});

export type UpdateRoleRequest = Static<typeof updateRoleRequest>;

export const roleResponse = Type.Object({
	id: Type.String(),
	name: Type.String({ maxLength: 256 }),
	description: Type.Optional(Type.String({ maxLength: 4096 })),
	createdAt: IsoDate,
	createdBy: Type.Optional(Type.String()),
    updatedAt: Type.Optional(IsoDate),
	updatedBy: Type.Optional(Type.String()),
	permissions: Type.Optional(Type.Array(Type.String())),
});

export const rolesResponse = Type.Object({
    roles: Type.Array(roleResponse),
    total: Type.Integer(),
});

export type RolesResponse = Static<typeof rolesResponse>;

export const permissionResponse = Type.Object({
	id: Type.String(),
	name: Type.String({ maxLength: 256 }),
	description: Type.Optional(Type.String({ maxLength: 4096 })),
	resource: Type.String(),
	action: Type.String(),
});

export const roleWithPermissionsResponse = Type.Object({
	role: roleResponse,
	permissions: Type.Array(permissionResponse),
});

export const RoleRequest = {
	"role.request.create": createRoleRequest,
	"role.request.update": updateRoleRequest,
};

export const RoleResponse = {
	"role.response.create": roleWithPermissionsResponse,
	"role.response.get": roleWithPermissionsResponse,
	"role.response.list": rolesResponse,
	"role.response.delete": roleResponse,
	"role.response.update": roleWithPermissionsResponse,
};
