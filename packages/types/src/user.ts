import { type Static, Type } from "@sinclair/typebox";
import {IsoDate} from "./date";

const createUserRequest = Type.Object({
	firstname: Type.String(),
	lastname: Type.String(),
	email: Type.String(),
});

const updateUserRequest = Type.Partial(
	Type.Object({
		firstname: Type.String(),
		lastname: Type.String(),
	}),
);

export type CreateUserRequest = Static<typeof createUserRequest>;
export type UpdateUserRequest = Static<typeof updateUserRequest>;

export const userResponse = Type.Object({
	id: Type.String(),
	firstname: Type.String(),
	lastname: Type.String(),
	email: Type.String(),
	createdAt: IsoDate,
	createdBy: Type.Optional(Type.String()),
	profilePicture: Type.Optional(Type.String()),
	updatedAt: Type.Optional(IsoDate),
	updatedBy: Type.Optional(Type.String()),
});

export const userListResponse = Type.Object({
    users: Type.Array(userResponse),
    total: Type.Integer(),
});

export type UserResponse = Static<typeof userResponse>;

export const usersResponse = Type.Array(userResponse);

export const UserRequest = {
	"user.request.create": createUserRequest,
	"user.request.update": updateUserRequest,
};

export const UserResponse = {
	"user.response.get": userResponse,
	"user.response.list": userListResponse,
	"user.response.delete": userResponse,
	"user.response.update": userResponse,
};
