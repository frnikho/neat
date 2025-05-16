import {_trace} from "@core/instrumentation";
import {err, errAsync, ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import { verifyToken} from "$auth/infra/jwt.service";
import {handle, optionToResult} from "@core/type";
import tokenRepo from "$auth/infra/token.repo";
import {redisClient} from "@core/cache";
import {Token} from "$auth/domain/token.schema";
import tokenService from "$auth/infra/token.service";

type RefreshTokenInput = {
  refreshToken?: string;
  accessToken?: string;
}

type RefreshTokenOutput = {
  accessToken: string;
  refreshToken: string;
}

const refreshToken = (input: RefreshTokenInput): ResultAsync<RefreshTokenOutput, ApiError> => {
  if (!input.accessToken || !input.refreshToken) {
    return errAsync(apiError(ApiErrorCode.BAD_REQUEST, "Missing tokens"));
  }

  const refresh = verifyToken(input.refreshToken)
    .mapErr((err) => apiError(ApiErrorCode.BAD_REQUEST, "Invalid refresh token", {error: err}))
    .map((r) => r.payload as Token)

  const client = redisClient();

  const access = verifyToken(input.accessToken, true)
    .andThen(({payload}) => tokenRepo.get(client, `refresh:${payload.sessionId}`))
    .andThen((refresh) => optionToResult(refresh, apiError(ApiErrorCode.BAD_REQUEST, "Invalid refresh token")))

  const tokens = ResultAsync.combine([access, refresh]).andThen(([accessToken, refreshToken]) => {
    if (accessToken !== input.refreshToken) {
      return err(apiError(ApiErrorCode.BAD_REQUEST, "Invalid refresh token, you need to login again"));
    }
    return tokenService(client).rotateTokens(refreshToken.sessionId, refreshToken.userId);
  });

  return handle(tokens);
}

export default _trace(refreshToken, 'app.auth/refresh-token');