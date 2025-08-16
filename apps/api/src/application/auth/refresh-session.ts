import { apiErrorCodeToStatus } from "@api/api.exception";
import { appException } from "@application/app.exception";
import tokenRepo from "@infra/repo/token.repo";
import type { Token } from "@infra/schema/token.schema";
import { redisClient } from "@infra/service/cache.service";
import { verifyToken } from "@infra/service/jwt.service";
import tokenService from "@infra/service/token.service";
import { optionToResult } from "@infra/utils/type.utils";
import { err, errAsync, ResultAsync } from "neverthrow";

type RefreshTokenInput = {
	refreshToken?: string;
	accessToken?: string;
};

type RefreshTokenOutput = {
	accessToken: string;
	refreshToken: string;
};

export default (input: RefreshTokenInput): ResultAsync<RefreshTokenOutput, Error> => {
	if (!(input.accessToken && input.refreshToken)) {
		return errAsync(appException(apiErrorCodeToStatus.BAD_REQUEST, "Missing tokens"));
	}

    console.log(input);

	const refresh = verifyToken(input.refreshToken)
		.mapErr((err) => {
            console.log('err', err);
            return appException(apiErrorCodeToStatus.BAD_REQUEST, "Invalid refresh token", {
                error: err,
            })
        })
		.map((r) => r.payload as Token);

	const client = redisClient();

	const access = verifyToken(input.accessToken, true)
		.andThen(({ payload }) => {
            return tokenRepo(client).get(`refresh:${payload.sessionId}`).andThen((refresh) => {
                return optionToResult(refresh, appException(apiErrorCodeToStatus.BAD_REQUEST, "Invalid refresh token"))
                    .map(() => payload as Token)
            })
        })

	return ResultAsync.combine([access, refresh]).andThen(([accessToken, refreshToken]) => {
        if (refreshToken.sessionId !== accessToken.sessionId) {
            console.log('Session mismatch between access and refresh tokens');
            return err(appException(apiErrorCodeToStatus.BAD_REQUEST, "Session mismatch between access and refresh tokens"));
        }
        console.log('Rotating tokens for session:', refreshToken.sessionId, 'and user:', refreshToken.userId);
		return tokenService(client).rotateTokens(refreshToken.sessionId, refreshToken.userId);
	});
};
