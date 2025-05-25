import {Static, t} from 'elysia';

const createUserRequest = t.Object({
    firstname: t.String(),
    lastname: t.String(),
    email: t.String(),
});

const updateUserRequest = t.Partial(t.Object({
    firstname: t.String(),
    lastname: t.String(),
}));

export type CreateUserRequest = Static<typeof createUserRequest>;
export type UpdateUserRequest = Static<typeof updateUserRequest>;

export const UserRequest = {
    'user.request.create': createUserRequest,
    'user.request.update': updateUserRequest,
}