import {okAsync, ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {PublicUser, User} from "$user/domain/entity/user.entity";

type Input = {
  loggedUser: User,
  accessToken: string,
}

type Output = PublicUser;

const info = (input: Input): ResultAsync<Output, ApiError> => {
  const {loggedUser} = input;
  return okAsync<Output>(loggedUser);
}

export default _trace(info, 'app.auth/info');