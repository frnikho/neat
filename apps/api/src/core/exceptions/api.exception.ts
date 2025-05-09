export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export interface ApiErrorShape {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

const apiErrorCodeToStatus: Record<ApiErrorCode, number> = {
  [ApiErrorCode.BAD_REQUEST]: 400,
  [ApiErrorCode.UNAUTHORIZED]: 401,
  [ApiErrorCode.FORBIDDEN]: 403,
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.CONFLICT]: 409,
  [ApiErrorCode.INTERNAL_ERROR]: 500,
};

export class ApiError extends Error implements ApiErrorShape {
  code: ApiErrorCode;
  status: number;
  details?: Record<string, unknown>;

  constructor(code: ApiErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.status = apiErrorCodeToStatus[code] ?? 500;
    this.details = details;
  }

  toJSON(): ApiErrorShape {
    return {
      code: this.code,
      status: this.status,
      message: this.message,
      ...(this.details ? { details: this.details } : {})
    };
  }
}

export const apiError = (
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>
): ApiError => {
  return new ApiError(code, message, details);
};
