import {apiError, ApiError, ApiErrorCode} from "@api/api.exception";
import userRepo from "@infra/repo/user.repo";
import userRoleRepo from "@infra/repo/user-role.repo";
import {optionToResult} from "@infra/utils/type.utils";
import {db} from "@service/db.service";
import {verifyToken} from "@service/jwt.service";
import {Elysia} from "elysia";
import tokenRepo from "@repo/token.repo";
import {redisClient} from "@service/cache.service";
import {JwtException} from "@infra/exception/jwt.exception";

export default new Elysia().derive({ as: "scoped" }, ({ cookie }) => {
	const accessToken = cookie.access_token.value;

	if (!accessToken) {
		throw apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !");
	}

    const cache = redisClient();

	const result = verifyToken(accessToken)
        .andThen(({payload}) =>
            tokenRepo(cache).get(`session:${payload.userId}:${payload.sessionId}`).andThen((r) => optionToResult(r, apiError(ApiErrorCode.UNAUTHORIZED, "Session not found !")))
                .map(() => ({payload}))
        )
		.andThen(({ payload }) => userRepo(db).findUserById(payload.userId))
		.andThen((usr) => optionToResult(usr, apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !")))
		.andThen((user) => {
			return userRoleRepo(db)
				.findRoleAndPermissions(user.id)
				.map((roles) => ({
					user,
					roles,
				}));
		});

	return result.match(
		({ user, roles }) => {
			return {
				auth: {
					user,
					roles,
					accessToken,
				},
			};
		},
		(error) => {
            if (error instanceof JwtException) {
                throw new ApiError(ApiErrorCode.BAD_REQUEST, error.message);
            }
            console.log(error);
			throw error;
		},
	);
});
