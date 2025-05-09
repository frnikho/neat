import {err, ok, Result, ResultAsync} from "neverthrow";
import {isSome, none, Option, some} from "fp-ts/Option";
import {ApiError, CacheException, DbException, AppException, Exception} from "@core/exceptions/";

export const andThrow = <T extends Error>(err: T) => {
  throw err;
}

export const oneOrThrow = <T>(res: T[], entityName = 'Entity'): Result<T, DbException> => {
  if (res.length === 0) {
    return err(new DbException(`No ${entityName} found`, { entityName }));
  }
  return ok(res[0]);
}

export const oneOrOption = <T>(res: T[], entityName = 'Entity'): Option<T> => {
  if (res.length === 0) {
    return none;
  }
  return some(res[0]);
}

export const oneOreResultOption = <T>(res: T[], entityName = 'Entity'): Result<Option<T>, DbException> => {
  if (res.length === 0) {
    return ok(none);
  }
  return ok(some(res[0]));
}

export const optionToResult = <T, Z>(option: Option<T>, error: Z): Result<T, Z> => {
  return isSome(option) ? ok(option.value) : err(error);
};

export const handle = <T>(result: ResultAsync<T, AppException>): ResultAsync<T, ApiError> => {
  return result.mapErr((err) => {
    if (err instanceof DbException) {
      return err.toApiError();
    }
    if (err instanceof CacheException) {
      return err.toApiError();
    }
    if (err instanceof Exception) {
      return err.toApiError();
    }
    return err;
  })
}

export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
  return value !== null && value !== undefined;
}