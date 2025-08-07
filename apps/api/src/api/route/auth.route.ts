import {Elysia} from "elysia";
import login from "@application/auth/login";
import {register} from "@application/auth/register";
import authMiddleware from "@api/middleware/auth.middleware";
import info from "@application/auth/info";
import refreshSession from "@application/auth/refresh-session";
import {authRequest, authResponse } from "@api/dto/auth.dto";
import {UserResponse } from "@api/dto/user.dto";
import { requestModels } from "@api/utils/request";
import {response} from "@api/utils/response";

export default new Elysia()
    .model(authRequest)
    .model(authResponse)
    .model(UserResponse)
    .model(requestModels)
    .group('/auth', (app) =>
        app
            .post('/login', ({body, cookie}) => {
                return response(login(body), ({user, accessToken, refreshToken}) => {
                    cookie.access_token.set({
                        value: accessToken,
                        secure: true,
                        httpOnly: true,
                        path: '/',
                        sameSite: true
                    });
                    cookie.refresh_token.set({
                        value: refreshToken,
                        secure: true,
                        httpOnly: true,
                        path: '/',
                        sameSite: true
                    });
                    return user;
                })
            }, {body: 'auth.request.login', response: 'auth.response.login', tags: ['Authentification']})
            .post('/register', ({body, cookie}) => {
                return response(register({body}), ({user, accessToken, refreshToken}) => {
                    cookie.access_token.set({value: accessToken, secure: true, httpOnly: true});
                    cookie.refresh_token.set({value: refreshToken, secure: true, httpOnly: true});
                    return user;
                })
            }, {body: 'auth.request.register', response: 'auth.response.register', tags: ['Authentification']})
            .post('/session/refresh', ({cookie}) => {
                return response(refreshSession({refreshToken: cookie.refresh_token.value, accessToken: cookie.access_token.value}), ({accessToken, refreshToken}) => {
                    cookie.access_token.set({value: accessToken, secure: true, httpOnly: true});
                    cookie.refresh_token.set({value: refreshToken, secure: true, httpOnly: true});
                })
            }, {cookie: 'auth.cookie', tags: ['Authentification']})
            .group('', (app) =>
                app.use(authMiddleware)
                    .get('/me', ({auth}) => response(info({
                        loggedUser: auth.user,
                        accessToken: auth.accessToken
                    })), {response: 'user.response.get', tags: ['Authentification']})
            ))
