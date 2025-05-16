import {okAsync, ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {PublicUser, User} from "$user/domain/entity/user.entity";

type Input = {
  loggedUser: User,
  accessToken: string,
}

type Output = {
  user: PublicUser,
}

const info = (input: Input): ResultAsync<Output, ApiError> => {
  const {loggedUser} = input;
  return okAsync<Output>({
    user: {
      id: loggedUser.id,
      email: loggedUser.email,
      firstname: loggedUser.firstname,
      lastname: loggedUser.lastname,
      createdAt: loggedUser.createdAt,
      updatedAt: loggedUser.updatedAt,
      deletedAt: loggedUser.deletedAt,
      createdBy: loggedUser.createdBy,
      updatedBy: loggedUser.updatedBy,
      deletedBy: loggedUser.deletedBy,
    },
  });
}

export default _trace(info, 'app.auth/info', {obfuscation: []});