import {_trace} from "@core/instrumentation";
import {okAsync, ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {verifyToken} from "$auth/infra/jwt.service";

type Output = {
  
}

type Input = {
  token: string;
}

const deleteSession = (input: Input): ResultAsync<Output, ApiError> => {
  /*verifyToken(input.token, false).andThen(({payload}) => {
    payload.
  })*/
  return okAsync({})
}

export default _trace(deleteSession, 'app.auth/delete-session');