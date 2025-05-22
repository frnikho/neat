import {ApiError, ApiErrorCode} from "@core/exceptions/api.exception";

export interface DbExceptionShape {
  message: string;
  details?: Record<string, unknown>;
}

export class DbException extends Error implements DbExceptionShape {
  message: string;
  details?: Record<string, unknown>;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message);
    this.message = message;
    this.details = details;
  }

  toApiError(): ApiError {
    return new ApiError(ApiErrorCode.BAD_REQUEST, this.message, this.details);
  }
}