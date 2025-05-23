import {Elysia} from "elysia";
import {User} from "$user/domain/entity/user.entity";
import {verifyToken} from "$auth/infra/jwt.service";
import {db} from "@core/db";
import userRepo from "$user/infra/repo/user.repo";
import {optionToResult} from "@core/type";
import {apiError, ApiErrorCode} from "@core/exceptions";
import {_trace} from "@core/instrumentation";

export type AuthContext = {
  user: User,
  accessToken: string,
}

export default new Elysia().derive({as: 'scoped'}, ({headers, cookie}) => {
  const result = _trace(() => {
    const token = cookie['access_token'];

    if (!token.value) {
      throw apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !");
    }

    return verifyToken(token.value)
      .andThen(({payload}) => userRepo(db).findUserById(payload.userId).mapErr(e => e.toApiError()))
      .andThen((usr) => optionToResult(usr, apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !")))
  }, 'api.auth/auth-middleware');

  return result().match(
    (user) => ({
      auth: {
        user,
        accessToken: cookie['access_token'].value!,
      }
    }),
    (error) => {
      throw error;
    }
  )

})