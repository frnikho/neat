import {db, DbPool} from "@core/db";
import {optionToResult} from "@core/type";
import {apiError, ApiErrorCode} from "@core/exceptions/api.exception";
import {UserInterface} from "$user/domain/interface/user.interface";
import {_trace} from "@core/instrumentation";

type UserRepo = UserInterface<DbPool>;

const getUserFromId = (repo: UserRepo, id: string) =>{
  return repo.findUserById(db, id)
    .andThen((user) =>
      optionToResult(user, apiError(ApiErrorCode.NOT_FOUND, `User with id ${id} not found`))
    )
}

const getUserFromEmail = (repo: UserRepo, email: string) => {
  return repo.findUserByEmail(db, email)
    .andThen((user) =>
      optionToResult(user, apiError(ApiErrorCode.NOT_FOUND, `User with email ${email} not found`))
    )
}

export const findById = _trace(getUserFromId, 'app.user/findById', {skipParams: [0]});
export const findByEmail = _trace(getUserFromEmail, 'app.user/findByEmail', {skipParams: [0]});