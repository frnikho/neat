import {Static, t, TypeSystemPolicy} from 'elysia';

TypeSystemPolicy.ExactOptionalPropertyTypes = true

export const createRoleRequest = t.Object({
    name: t.String({maxLength: 256}),
    description: t.Optional(t.String({maxLength: 4096})),
    permissions: t.Optional(t.Array(t.String())),
});

export type CreateRoleRequest = Static<typeof createRoleRequest>;

export const updateRoleRequest = t.Object({
    name: t.Optional(t.String({maxLength: 256})),
    description: t.Optional(t.String({maxLength: 4096})),
    permissions: t.Optional(t.Array(t.String())),
})

export type UpdateRoleRequest = Static<typeof updateRoleRequest>;

export const RoleRequest = {
    'role.request.create': createRoleRequest,
    'role.request.update': updateRoleRequest,
}