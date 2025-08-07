import {err, errAsync, ResultAsync} from "neverthrow";
import {verifyToken} from "@infra/service/jwt.service";
import type {Token} from "@infra/schema/token.schema";
import {redisClient} from "@infra/service/cache.service";
import tokenRepo from "@infra/repo/token.repo";
import tokenService from "@infra/service/token.service";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {appException} from "@application/app.exception";
import {optionToResult} from "@infra/utils/type.utils";

type RefreshTokenInput = {
    refreshToken?: string;
    accessToken?: string;
}

type RefreshTokenOutput = {
    accessToken: string;
    refreshToken: string;
}

export default (input: RefreshTokenInput): ResultAsync<RefreshTokenOutput, Error> => {
    if (!input.accessToken || !input.refreshToken) {
        return errAsync(appException(apiErrorCodeToStatus.BAD_REQUEST, "Missing tokens"));
    }

    const refresh = verifyToken(input.refreshToken)
        .mapErr((err) => appException(apiErrorCodeToStatus.BAD_REQUEST, "Invalid refresh token", {error: err}))
        .map((r) => r.payload as Token)

    const client = redisClient();

    const access = verifyToken(input.accessToken, true)
        .andThen(({payload}) => tokenRepo(client).get(`refresh:${payload.sessionId}`))
        .andThen((refresh) => optionToResult(refresh, appException(apiErrorCodeToStatus.BAD_REQUEST, "Invalid refresh token")))

    return ResultAsync.combine([access, refresh]).andThen(([accessToken, refreshToken]) => {
        if (accessToken !== input.refreshToken) {
            return err(appException(apiErrorCodeToStatus.BAD_REQUEST, "Invalid refresh token, you need to login again"));
        }
        return tokenService(client).rotateTokens(refreshToken.sessionId, refreshToken.userId);
    });
}