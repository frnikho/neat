import {Result, ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {andThrow} from "@core/type";

type AnyResult<T> = Result<T, ApiError> | ResultAsync<T, ApiError>;

export const response = <T, Z>(res: AnyResult<T>, handler: (data: T) => Z) => {
  return res.match(
    (data) => handler(data),
    andThrow
  )
}
