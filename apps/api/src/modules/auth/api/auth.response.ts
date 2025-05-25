import {Static, t} from 'elysia';

export const authLoginResponse = t.Object({
    id: t.String(),
    email: t.String(),
    firstname: t.String(),
    lastname: t.String(),
});

export const authLoginCookieResponse = t.Object({
    access_token: t.Optional(t.String()),
    refresh_token: t.Optional(t.String()),
});

export type AuthLoginResponse = Static<typeof authLoginResponse>;

export const authRegisterResponse = t.Object({
    id: t.String(),
    email: t.String(),
    firstname: t.String(),
    lastname: t.String(),
});

export type AuthRegisterResponse = Static<typeof authRegisterResponse>;

export const AuthResponse = {
    'auth.response.login': authLoginResponse,
    'auth.response.register': authRegisterResponse,
    'auth.cookie.login': authLoginCookieResponse,
}