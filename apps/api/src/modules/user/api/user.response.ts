import {Static, t} from 'elysia';

export const userResponse = t.Object({
    id: t.String(),
    firstname: t.String(),
    lastname: t.String(),
    email: t.String(),
    updatedAt: t.Optional(t.Date()),
    updatedBy: t.Optional(t.String()),
});

export const usersResponse = t.Array(userResponse);

export const UserResponse = {
    'user.response.get': userResponse,
    'user.response.list': t.Array(userResponse),
    'user.response.delete': userResponse,
    'user.response.update': userResponse,
}