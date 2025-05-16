import {TokenServiceInterface} from "$auth/domain/token.interface";
import {RedisClient} from "bun";
import { createToken } from "./jwt.service";
import {err, ResultAsync} from "neverthrow";
import tokenRepo from "./token.repo";
import {traceRepository, traceRepositoryFactory} from "@core/instrumentation";
import {apiError, ApiErrorCode} from "@core/exceptions";

const _tokenService = (client: RedisClient): TokenServiceInterface => <TokenServiceInterface>({

  createTokenPair: (sessionId: string, userId: string) => {
    const accessToken = createToken({sessionId, userId}, '12h');
    const refreshToken = createToken({sessionId, userId}, '30d');

    return ResultAsync.combine([accessToken, refreshToken])
      .andThen(([access, refresh]) => {
        return tokenRepo.insert(client, `refresh:${sessionId}`, refresh)
          .andThen(() => tokenRepo.insert(client, `session:${userId}:${sessionId}`, 'active'))
          .map(() => ({accessToken: access, refreshToken: refresh}));
      });
  },

  rotateTokens: (sessionId: string, userId: string) => {
    return tokenRepo.get(client, `refresh:${sessionId}`)
      .andThen(currentRefresh => {
        if (!currentRefresh) {
          return err(apiError(ApiErrorCode.BAD_REQUEST, 'Refresh token not found'));
        }
        const payload = { sessionId, userId };
        const newAccessToken = createToken(payload, '12h');
        const newRefreshToken = createToken(payload, '30d');

        return tokenRepo.delete(client, `refresh:${sessionId}`)
          .andThen(() =>
            ResultAsync.combine([newAccessToken, newRefreshToken])
          )
          .andThen(([access, refresh]) => {
            return tokenRepo.insert(client, `session:${userId}:${sessionId}`, 'active')
              .andThen(() => tokenRepo.insert(client, `refresh:${sessionId}`, refresh)
                .map(() => ({ accessToken: access, refreshToken: refresh, userId })));
          });
      });
  },

  invalidateSession: (userId: string, sessionId: string) => {
    return tokenRepo.delete(client, `session:${userId}:${sessionId}`)
      .andThen(() => tokenRepo.delete(client, `refresh:${sessionId}`));
  }

})

export default traceRepositoryFactory(_tokenService, {
  createTokenPair: {
    name: 'service.auth/createTokenPair',
    config: {
      skipParams: [0],
    }
  }
});