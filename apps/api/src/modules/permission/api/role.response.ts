import {t} from 'elysia';

const role = t.Object({
    id: t.String(),
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
    permissions: t.Optional(t.Array(t.String())),
});

const permission = t.Object({
    id: t.String(),
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
});

const roleWithPermissions = t.Object({
    role,
    permissions: t.Array(permission),
});

export const RoleResponse = {
    'role.response.create': roleWithPermissions,
    'role.response.get': roleWithPermissions,
    'role.response.list': t.Array(role),
    'role.response.delete': role,
    'role.response.update': roleWithPermissions,
}