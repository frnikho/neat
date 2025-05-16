import {ApiError, ApiErrorCode} from "@core/exceptions/api.exception";
import {DbException} from "@core/exceptions/db.exception";
import {CacheException} from "./cache.exception";

export type AppException = ApiError | DbException | CacheException | Exception;

export interface ExceptionShape {
  message: string;
  details?: Record<string, unknown>;
}

export class Exception extends Error implements ExceptionShape {
  message: string;
  details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.message = message;
    this.details = details;
  }

  toApiError(errorCode?: ApiErrorCode): ApiError {
    return new ApiError(errorCode ?? ApiErrorCode.INTERNAL_ERROR, this.message, this.details);
  }
}

export const appException = (message: string, details?: Record<string, unknown>): Exception => {
  return new Exception(message, details);
}