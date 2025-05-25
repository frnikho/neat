import {t} from 'elysia';

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

export const permissionResponse = t.Object({
    id: t.String(),
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
});

export const roleWithPermissionsResponse = t.Object({
    role: roleResponse,
    permissions: t.Array(permissionResponse),
});

export const RoleResponse = {
    'role.response.create': roleWithPermissionsResponse,
    'role.response.get': roleWithPermissionsResponse,
    'role.response.list': t.Array(roleResponse),
    'role.response.delete': roleResponse,
    'role.response.update': roleWithPermissionsResponse,
}