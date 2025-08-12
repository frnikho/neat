import { apiErrorCodeToStatus } from '@api/api.exception';
import { appException } from '@application/app.exception';
import type { User } from '@entity/user.entity';
import userRepo from '@infra/repo/user.repo';
import { redisClient } from '@infra/service/cache.service';
import { verifyPassword } from '@infra/service/hash.service';
import tokenService from '@infra/service/token.service';
import { createId } from '@infra/utils/db.utils';
import { optionToResult } from '@infra/utils/type.utils';
import { db } from '@service/db.service';
import { err, ok, type ResultAsync } from 'neverthrow';

type Input = {
  email: string;
  password: string;
};

export type Output = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export default (input: Input): ResultAsync<Output, Error> => {
  const client = redisClient();
  const sessionId = createId();

  const user = userRepo(db)
    .findUserByEmail(input.email)
    .andThen((e) =>
      optionToResult(
        e,
        appException(apiErrorCodeToStatus.BAD_REQUEST, 'User not found')
      )
    )
    .andThen((user) => {
      if (!user.password) {
        return err(
          appException(
            apiErrorCodeToStatus.BAD_REQUEST,
            'User has no password set'
          )
        );
      }
      return ok(user);
    })
    .andThen((user) => {
      return verifyPassword({
        password: input.password,
        hashedPassword: user.password!,
      }).andThen((valid) => {
        if (!valid) {
          return err(
            appException(apiErrorCodeToStatus.BAD_REQUEST, 'Bad credentials')
          );
        }
        return ok(user);
      });
    });

  return user.andThen((user) => {
    return tokenService(client)
      .createTokenPair(sessionId, user.id)
      .andThen(({ refreshToken, accessToken }) =>
        ok({ accessToken, refreshToken, user })
      );
  });
};
