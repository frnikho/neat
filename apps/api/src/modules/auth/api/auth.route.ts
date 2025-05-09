import {Cookie, Elysia} from "elysia";
import {AuthLoginRequest, AuthRegisterRequest, AuthRequest} from "$auth/api/auth.request";
import register from "$auth/application/register";
import login from "$auth/application/login";
import {response} from "@core/response";
import refreshToken from "$auth/application/refresh-token";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import info from "$auth/application/info";

type AuthTokenCookie = {
  access_token: Cookie<string | undefined>;
  refresh_token: Cookie<string | undefined>;
}

const loginUser = ({body, cookie}: { body: AuthLoginRequest, cookie: AuthTokenCookie}) => {
  return response(login(body), ({user, accessToken, refreshToken}) => {
    cookie.access_token.set({value: accessToken, secure: true, httpOnly: true});
    cookie.refresh_token.set({value: refreshToken, secure: true, httpOnly: true});
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    }
  })
}

const registerUser = ({body, cookie}: { body: AuthRegisterRequest, cookie: AuthTokenCookie }) => {
  return response(register(body), ({user, accessToken, refreshToken}) => {
    cookie.access_token.set({value: accessToken, secure: true, httpOnly: true});
    cookie.refresh_token.set({value: refreshToken, secure: true, httpOnly: true});
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    }
  })
}

const refreshUserToken = ({cookie}: { cookie: AuthTokenCookie }) => {
  return response(refreshToken({refreshToken: cookie.refresh_token.value, accessToken: cookie.access_token.value}), (result) => {
    cookie.access_token.set({value: result.accessToken, secure: true, httpOnly: true});
    cookie.refresh_token.set({value: result.refreshToken, secure: true, httpOnly: true});
  });
}

const resetPassword = () => {

}

const deleteCurrentSession = () => {

}

const deleteAllSession = () => {
  return {message: 'All sessions deleted'};
}

const getAuthenticatedUserInfo = ({user, accessToken}: AuthContext) => {
  return response(info({loggedUser: user, accessToken}), ({user}) => {
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    }
  })
}

export default new Elysia()
  .model(AuthRequest)
  .group('/auth', (app) =>
    app
      .post('/login', loginUser, {body: 'auth.login'})
      .post('/register', registerUser, {body: 'auth.register'})
      .post('/refresh', refreshUserToken)
      .delete('/session', deleteCurrentSession)
      .delete('/sessions', deleteAllSession)
      .post('/reset-password', resetPassword)
      .guard({}, app =>
        app
          .use(authMiddleware)
          .get('/me', getAuthenticatedUserInfo)
      )
  );