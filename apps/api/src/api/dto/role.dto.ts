import {Static, t} from 'elysia';

//TODO: check this => TypeSystemPolicy.ExactOptionalPropertyTypes = true

export const createRoleRequest = t.Object({
    name: t.String({maxLength: 256}),
    description: t.String({maxLength: 4096}),
    permissions: t.Optional(t.Array(t.String())),
});

export type CreateRoleRequest = Static<typeof createRoleRequest>;

export const updateRoleRequest = t.Object({
    name: t.Optional(t.String({maxLength: 256})),
    description: t.Optional(t.String({maxLength: 4096})),
    permissions: t.Optional(t.Array(t.String())),
})

export type UpdateRoleRequest = Static<typeof updateRoleRequest>;

export const roleResponse = t.Object({
    id: t.String(),
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
    createdAt: t.Optional(t.Date()),
    updatedAt: t.Optional(t.Date()),
    createdBy: t.Optional(t.String()),
    updatedBy: t.Optional(t.String()),
    permissions: t.Optional(t.Array(t.String())),
});

export const rolesResponse = t.Array(roleResponse);

export type RolesResponse = Static<typeof rolesResponse>;

export const permissionResponse = t.Object({
    id: t.String(),
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
});

export const roleWithPermissionsResponse = t.Object({
    role: roleResponse,
    permissions: t.Array(permissionResponse),
});

export const RoleRequest = {
    'role.request.create': createRoleRequest,
    'role.request.update': updateRoleRequest,
}

export const RoleResponse = {
    'role.response.create': roleWithPermissionsResponse,
    'role.response.get': roleWithPermissionsResponse,
    'role.response.list': rolesResponse,
    'role.response.delete': roleResponse,
    'role.response.update': roleWithPermissionsResponse,
}