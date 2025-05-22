import {Static, t} from 'elysia';

export const createRoleRequest = t.Object({
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
    permissions: t.Optional(t.Array(t.String())),
});

export type CreateRoleRequest = Static<typeof createRoleRequest>;

export const RoleRequest = {
    'role.create': createRoleRequest
}