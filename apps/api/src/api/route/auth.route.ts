import authMiddleware from "@api/middleware/auth.middleware";
import { requestModels } from "@api/utils/request";
import { response } from "@api/utils/response";
import info from "@application/auth/info";
import login from "@application/auth/login";
import refreshSession from "@application/auth/refresh-session";
import { register } from "@application/auth/register";
import { authRequest, authResponse } from "@neat/types/auth";
import { UserResponse } from "@neat/types/user";
import { Elysia } from "elysia";
import deleteSession from "@application/auth/delete-session";

export default new Elysia()
	.model(authRequest)
	.model(authResponse)
	.model(UserResponse)
	.model(requestModels)
	.group("/auth", (app) =>
		app
			.post(
				"/login",
				({ body, cookie }) => {
					return response(login(body), ({ user, accessToken, refreshToken }) => {
						cookie.access_token.set({
							value: accessToken,
							secure: true,
							httpOnly: true,
							path: "/",
							sameSite: true,
						});
						cookie.refresh_token.set({
							value: refreshToken,
							secure: true,
							httpOnly: true,
							path: "/",
							sameSite: true,
						});
						return user;
					});
				},
				{
					body: "auth.request.login",
					response: "auth.response.login",
					tags: ["Authentification"],
				},
			)
			.post(
				"/register",
				({ body, cookie }) => {
					return response(register({ body }), ({ user, accessToken, refreshToken }) => {
						cookie.access_token.set({
							value: accessToken,
                            secure: true,
                            httpOnly: true,
                            path: "/",
                            sameSite: true,
						});
						cookie.refresh_token.set({
							value: refreshToken,
                            secure: true,
                            httpOnly: true,
                            path: "/",
                            sameSite: true,
						});
						return user;
					});
				},
				{
					body: "auth.request.register",
					response: {
						200: "auth.response.register",
					},
					tags: ["Authentification"],
				},
			)
			.post(
				"/session/refresh",
				({ cookie }) => {
					return response(
						refreshSession({
							refreshToken: cookie.refresh_token.value,
							accessToken: cookie.access_token.value,
						}),
						({ accessToken, refreshToken }) => {
							cookie.access_token.set({
								value: accessToken,
                                secure: true,
                                httpOnly: true,
                                path: "/",
                                sameSite: true,
							});
							cookie.refresh_token.set({
								value: refreshToken,
                                secure: true,
                                httpOnly: true,
                                path: "/",
                                sameSite: true,
							});
						},
					);
				},
				{ cookie: 'auth.cookie', tags: ["Authentification"] },
			)
			.group("", (app) =>
				app
					.use(authMiddleware)
                    .delete("/session/current", ({auth}) => response(deleteSession({auth})), { tags: ["Authentification"] })
					.get("/me", ({ auth }) => response(info({ auth })), { response: "auth.response.info", tags: ["Authentification"] }),
			),
	);
