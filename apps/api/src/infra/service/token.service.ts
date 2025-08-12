import { CacheException } from '@infra/exception/cache.exception';
import tokenRepo from '@infra/repo/token.repo';
import { createToken } from '@infra/service/jwt.service';
import type { TokenServiceInterface } from '@interface/token.interface';
import type { RedisClient } from 'bun';
import { err, ResultAsync } from 'neverthrow';

export default (client: RedisClient): TokenServiceInterface =>
  <TokenServiceInterface>{
    createTokenPair: (sessionId: string, userId: string) => {
      const accessToken = createToken({ sessionId, userId }, '12h');
      const refreshToken = createToken({ sessionId, userId }, '30d');

      return ResultAsync.combine([accessToken, refreshToken]).andThen(
        ([access, refresh]) => {
          return tokenRepo(client)
            .insert(`refresh:${sessionId}`, refresh)
            .andThen(() =>
              tokenRepo(client).insert(
                `session:${userId}:${sessionId}`,
                'active'
              )
            )
            .map(() => ({ accessToken: access, refreshToken: refresh }));
        }
      );
    },

    rotateTokens: (sessionId: string, userId: string) => {
      return tokenRepo(client)
        .get(`refresh:${sessionId}`)
        .andThen((currentRefresh) => {
          if (!currentRefresh) {
            return err(new CacheException('Refresh token not found'));
          }
          const payload = { sessionId, userId };
          const newAccessToken = createToken(payload, '12h');
          const newRefreshToken = createToken(payload, '30d');

          return tokenRepo(client)
            .delete(`refresh:${sessionId}`)
            .andThen(() =>
              ResultAsync.combine([newAccessToken, newRefreshToken])
            )
            .andThen(([access, refresh]) => {
              return tokenRepo(client)
                .insert(`session:${userId}:${sessionId}`, 'active')
                .andThen(() =>
                  tokenRepo(client)
                    .insert(`refresh:${sessionId}`, refresh)
                    .map(() => ({
                      accessToken: access,
                      refreshToken: refresh,
                      userId,
                    }))
                );
            });
        });
    },

    invalidateSession: (userId: string, sessionId: string) => {
      return tokenRepo(client)
        .delete(`session:${userId}:${sessionId}`)
        .andThen(() => tokenRepo(client).delete(`refresh:${sessionId}`));
    },
  };
