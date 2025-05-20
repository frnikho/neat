import {_trace} from "@core/instrumentation";
import {err, ok, ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions";
import {db} from "@core/db";
import {handle, optionToResult} from "@core/type";
import {verifyPassword} from "$auth/infra/hash.service";
import {redisClient} from "@core/cache";
import {createId} from "@paralleldrive/cuid2";
import tokenService from "$auth/infra/token.service";
import userRepo from "$user/infra/repo/user.repo";
import { User } from "$user/domain/entity/user.entity";
import {AuthLoginRequest} from "$auth/api/auth.request";

export type Output = {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const login = (input: AuthLoginRequest): ResultAsync<Output, ApiError> => {

  const client = redisClient();
  const sessionId = createId();

  const user = userRepo.findUserByEmail(db, input.email)
    .andThen((e) => optionToResult(e, apiError(ApiErrorCode.BAD_REQUEST, "User not found")))
    .andThen((user) => {
      return verifyPassword({password: input.password, hashedPassword: user.password}).andThen((valid) => {
        if (!valid) {
          return err(apiError(ApiErrorCode.BAD_REQUEST, "Bad credentials"));
        }
        return ok(user);
      });
    });

  const tokens = user.andThen((user) => {
    return tokenService(client).createTokenPair(sessionId, user.id)
      .andThen(({refreshToken, accessToken}) => ok(({accessToken, refreshToken, user})))
  });

  return handle(tokens);
}

export default _trace(login, 'app.auth/login', {obfuscation: ['password']});

