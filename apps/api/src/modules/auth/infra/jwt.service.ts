import {fromPromise, ResultAsync} from "neverthrow";
import {apiError, ApiError, ApiErrorCode, appException, AppException} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {errors, jwtDecrypt, JWTPayload, jwtVerify, JWTVerifyResult, SignJWT} from "jose";
import {Token} from "$auth/domain/token.schema";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const _createToken = (token: JWTPayload, expirationTime: number | string | Date): ResultAsync<string, AppException> => {
  return fromPromise(new SignJWT(token)
      .setProtectedHeader({alg: 'HS256'})
      .setExpirationTime(expirationTime)
      .setIssuedAt()
      .sign(JWT_SECRET),
    () => appException('Error while creating jwt token !'))
}

const _verifyToken = (token: string, ignoreExpiration = false): ResultAsync<JWTVerifyResult<Token>, ApiError> => {
  return fromPromise(
    jwtVerify(token, JWT_SECRET, {
      currentDate: ignoreExpiration ? new Date(0) : new Date(),
    }),
    (err: any) => {
      if (err instanceof errors.JWTInvalid || err instanceof errors.JWTExpired || err instanceof errors.JWSInvalid) {
        return apiError(ApiErrorCode.BAD_REQUEST, 'Invalid jwt token !');
      }
      return apiError(ApiErrorCode.BAD_REQUEST, 'Error while verifying jwt token !');
    },
  )
}

export const createToken = _trace(_createToken, 'service.jwt.auth/create-token');
export const verifyToken = _trace(_verifyToken, 'service.jwt.auth/verify-token');
