import {Cookie, Elysia} from "elysia";
import register from "$auth/application/register";
import login from "$auth/application/login";
import {rawResponse, response} from "@core/response";
import refreshToken from "$auth/application/refresh-token";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import info from "$auth/application/info";
import {AuthLoginRequest, AuthRegisterRequest, AuthRequest} from "$auth/api/auth.request";
import {authLoginCookieResponse, AuthResponse} from "$auth/api/auth.response";
import {userResponse} from "$user/api/user.response";

type AuthTokenCookie = {
    access_token: Cookie<string | undefined>;
    refresh_token: Cookie<string | undefined>;
}

const loginUser = ({body, cookie}: { body: AuthLoginRequest, cookie: AuthTokenCookie }) => {
    return rawResponse(login(body), ({user, accessToken, refreshToken}) => {
        cookie.access_token.set({value: accessToken, secure: true, httpOnly: true, path: '/', sameSite: true});
        cookie.refresh_token.set({value: refreshToken, secure: true, httpOnly: true, path: '/', sameSite: true});
        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
        }
    })
}

const registerUser = ({body, cookie}: { body: AuthRegisterRequest, cookie: AuthTokenCookie }) => {
    return rawResponse(register(body), ({user, accessToken, refreshToken}) => {
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
    return response(refreshToken({
        refreshToken: cookie.refresh_token.value,
        accessToken: cookie.access_token.value
    }), authLoginCookieResponse, (result) => {
        cookie.access_token.set({value: result.accessToken, secure: true, httpOnly: true});
        cookie.refresh_token.set({value: result.refreshToken, secure: true, httpOnly: true});
    });
}

const resetPassword = () => {
    return {message: 'Password reseted'};
}

const deleteCurrentSession = () => {
    return {message: 'Current session deleted'};
}

const deleteAllSession = () => {
    return {message: 'All sessions deleted'};
}

const getAuthenticatedUserInfo = ({auth}: {auth: AuthContext}) => {
    return response(info({loggedUser: auth.user, accessToken: auth.accessToken}), userResponse, (user) => user)
}

export default new Elysia()
    .model(AuthRequest)
    .model(AuthResponse)
    .group('/auth', (app) =>
        app
            .post('/login', loginUser, {body: 'auth.request.login', cookie: 'auth.cookie.login', response: {200: 'auth.response.login'}})
            .post('/register', registerUser, {body: 'auth.request.register'})
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