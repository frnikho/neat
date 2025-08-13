import { type Static, Type } from "@sinclair/typebox";

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
	createdAt: Type.Date(),
	createdBy: Type.Optional(Type.String()),
	profilePicture: Type.Optional(Type.String()),
	updatedAt: Type.Optional(Type.Date()),
	updatedBy: Type.Optional(Type.String()),
});

export type UserResponse = Static<typeof userResponse>;

export const usersResponse = Type.Array(userResponse);

export const UserRequest = {
	"user.request.create": createUserRequest,
	"user.request.update": updateUserRequest,
};

export const UserResponse = {
	"user.response.get": userResponse,
	"user.response.list": Type.Array(userResponse),
	"user.response.delete": userResponse,
	"user.response.update": userResponse,
};
