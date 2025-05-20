import {Static, t} from 'elysia';

const authLoginResponse = t.Object({
    id: t.String(),
    email: t.String(),
    firstname: t.String(),
    lastname: t.String(),
});

export type AuthLoginResponse = Static<typeof authLoginResponse>;

const authRegisterResponse = t.Object({
    id: t.String(),
    email: t.String(),
    firstname: t.String(),
    lastname: t.String(),
});

export type AuthRegisterResponse = Static<typeof authRegisterResponse>;

export const AuthResponse = {
    auth_response_login: authLoginResponse,
    auth_response_register: authRegisterResponse,
}