import {db, DbPool} from "@core/db";
import {optionToResult} from "@core/type";
import {apiError, ApiErrorCode} from "@core/exceptions/api.exception";
import {_trace} from "@core/instrumentation";
import userRepo from "$user/infra/repo/user.repo";

const getUserFromId = (id: string, repo = userRepo(db)) =>{
  return repo.findUserById(id)
    .andThen((user) =>
      optionToResult(user, apiError(ApiErrorCode.NOT_FOUND, `User with id ${id} not found`))
    )
}

const getUserFromEmail = (email: string, repo = userRepo(db)) => {
  return repo.findUserByEmail(email)
    .andThen((user) =>
      optionToResult(user, apiError(ApiErrorCode.NOT_FOUND, `User with email ${email} not found`))
    )
}

export const findById = _trace(getUserFromId, 'app.user/findById', {skipParams: [0]});
export const findByEmail = _trace(getUserFromEmail, 'app.user/findByEmail', {skipParams: [0]});