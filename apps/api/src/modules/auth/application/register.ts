import {AuthRegisterRequest} from "$auth/api/auth.request";
import {err, ok, ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode} from "@core/exceptions/api.exception";
import {db} from "@core/db";
import {isSome} from "fp-ts/Option";
import {handle, optionToResult} from "@core/type";
import {authCodeRepo} from "$auth/infra/auth-code.repo";
import {redisClient} from "@core/cache";
import {_trace} from "@core/instrumentation";
import {createToken} from "$auth/infra/jwt.service";
import {createId} from "@paralleldrive/cuid2";
import tokenRepo from "$auth/infra/token.repo";
import createUser from "$user/application/create-user";
import { User } from "$user/domain/entity/user.entity";
import userRepo from "$user/infra/repo/user.repo";

export type Output = {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const register = (input: AuthRegisterRequest): ResultAsync<Output, ApiError> => {
  const client = redisClient();

  const createdUser = userRepo.findUserByEmail(db, input.email)
    .andThen((user) => {
      if (isSome(user)) {
        return err(apiError(ApiErrorCode.BAD_REQUEST, 'User already exists'));
      }
      return ok()
    })
    .andThen(() => authCodeRepo.getByKey(client, input.code))
    .andThen((code) => optionToResult(code, apiError(ApiErrorCode.BAD_REQUEST, "Registration code not found")))
    .andThen(() => createUser(input))

  const sessionId = createId();

  let session = createdUser.andThen((user) => {
    const accessToken = createToken({sessionId, userId: user.id}, '2h')
      .andThen((session) => tokenRepo.insert(client, `session:${user.id}:${sessionId}`, 'active').map(() => session));

    const refreshToken = createToken({sessionId, userId: user.id}, '30d')
      .andThen((refresh => tokenRepo.insert(client, `refresh:${sessionId}`, refresh).map(() => refresh)));

    return ResultAsync.combine([accessToken, refreshToken])
      .map(([accessToken, refreshToken]) => ({accessToken, refreshToken, user}));
  });

  return handle(session);
}

export default _trace(register, 'app.auth/register', {obfuscation: ['password']});