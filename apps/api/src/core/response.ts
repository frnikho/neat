import {Result, ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {andThrow} from "@core/type";

export const response = <T, Z>(res: ResultAsync<T, ApiError>, handler: (data: T) => Z) => {
  return res.match(
    (data) => handler(data),
    andThrow
  )
}

export const responseAsync = <T, Z>(res: ResultAsync<T, ApiError>, handler: (data: T) => Z) => {
    return res.match(
        (data) => handler(data),
        andThrow
    )
}