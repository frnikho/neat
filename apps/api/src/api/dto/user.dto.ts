import * as Elysia from "elysia";
import {Static, t} from "elysia";

export const userProfilePicture = t.Object({
    file: Elysia.t.File({type: ['image/png', 'image/jpeg'], maxSize: '8m'}),
    filename: t.String(),
});

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

export const userResponse = t.Object({
    id: t.String(),
    firstname: t.String(),
    lastname: t.String(),
    email: t.String(),
    createdAt: t.Date(),
    createdBy: t.Optional(t.String()),
    profilePicture: t.Optional(t.String()),
    updatedAt: t.Optional(t.Date()),
    updatedBy: t.Optional(t.String()),
});

export type UserResponse = Static<typeof userResponse>;

export const usersResponse = t.Array(userResponse);

export const UserRequest = {
    'user.request.create': createUserRequest,
    'user.request.update': updateUserRequest,
    'user.request.profile-picture': userProfilePicture
}

export const UserResponse = {
    'user.response.get': userResponse,
    'user.response.list': t.Array(userResponse),
    'user.response.delete': userResponse,
    'user.response.update': userResponse,
}