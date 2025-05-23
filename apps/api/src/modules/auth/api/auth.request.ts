import {Static, t} from "elysia";

const email = t.String({format: 'email', minLength: 5, maxLength: 255});
const password = t.String({minLength: 8, maxLength: 128});

export const authLoginRequest = t.Object({
  email,
  password,
});

export type AuthLoginRequest = Static<typeof authLoginRequest>;

export const authRegisterRequest = t.Object({
  email,
  password,
  code: t.String(),
  firstname: t.String({maxLength: 128, minLength: 2}),
  lastname: t.String({maxLength: 128, minLength: 2}),
});

export type AuthRegisterRequest = Static<typeof authRegisterRequest>;

export const AuthRequest = {
  'auth.request.login': authLoginRequest,
  'auth.request.register': authRegisterRequest,
}