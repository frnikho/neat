import { FormatRegistry, type Static, Type } from "@sinclair/typebox";
import { userResponse } from "./user";
import { permissionResponse, roleResponse } from "./role";

FormatRegistry.Set("email", (value) =>
	/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
		value,
	),
);

const email = Type.String({ format: "email", minLength: 5, maxLength: 255 });
const password = Type.String({ minLength: 8, maxLength: 128 });

export const authLoginRequest = Type.Object({
	email,
	password,
});

export type AuthLoginRequest = Static<typeof authLoginRequest>;

export const authLoginResponse = Type.Object({
	id: Type.String(),
	email,
	firstname: Type.String(),
	lastname: Type.String(),
});

export type AuthLoginResponse = Static<typeof authLoginResponse>;

export const authRegisterRequest = Type.Object({
	email,
	password,
	token: Type.String({ description: "The registration token" }),
	firstname: Type.String({ maxLength: 128, minLength: 2 }),
	lastname: Type.String({ maxLength: 128, minLength: 2 }),
});

export type AuthRegisterRequest = Static<typeof authRegisterRequest>;

export const authRegisterResponse = Type.Object({
	id: Type.String(),
	email,
	firstname: Type.String(),
	lastname: Type.String(),
});

export type AuthRegisterResponse = Static<typeof authLoginResponse>;

export const authInfoResponse = Type.Object({
	user: userResponse,
	roles: Type.Array(
		Type.Object({
			role: roleResponse,
			permissions: Type.Array(permissionResponse),
		}),
	),
});

export type AuthInfoResponse = Static<typeof authInfoResponse>;

export const authRequest = {
	"auth.request.login": authLoginRequest,
	"auth.request.register": authRegisterRequest,
};

export const authResponse = {
	"auth.response.login": authLoginResponse,
	"auth.response.register": authRegisterResponse,
	"auth.response.info": authInfoResponse,
};

export const authModels = {
	...authResponse,
	...authRequest,
};
