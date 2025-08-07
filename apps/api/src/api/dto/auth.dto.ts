import {Static, t} from "elysia";

const email = t.String({format: 'email', minLength: 5, maxLength: 255});
const password = t.String({minLength: 8, maxLength: 128});

export const authLoginRequest = t.Object({
    email,
    password,
});

export type AuthLoginRequest = Static<typeof authLoginRequest>;

export const authLoginResponse = t.Object({
    id: t.String(),
    email,
    firstname: t.String(),
    lastname: t.String(),
});

export type AuthLoginResponse = Static<typeof authLoginResponse>;

export const authRegisterRequest = t.Object({
    email,
    password,
    firstname: t.String({maxLength: 128, minLength: 2}),
    lastname: t.String({maxLength: 128, minLength: 2}),
});

export type AuthRegisterRequest = Static<typeof authRegisterRequest>;

export const authRegisterResponse = t.Object({
    id: t.String(),
    email,
    firstname: t.String(),
    lastname: t.String(),
});

export type AuthRegisterResponse = Static<typeof authLoginResponse>;

export const authRequest = {
    'auth.request.login': authLoginRequest,
    'auth.request.register': authRegisterRequest,
}

export const authResponse = {
    'auth.response.login': authLoginResponse,
    'auth.response.register': authRegisterResponse,
}

export const authModels = {
    ...authResponse,
    ...authRequest,
}