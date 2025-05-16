import {_trace} from "@core/instrumentation";
import {fromPromise, ResultAsync} from "neverthrow";
import {AppException, appException} from "@core/exceptions";

export const passwordConfig: Bun.Password.Argon2Algorithm = {
  algorithm: 'argon2id',
  memoryCost: 4,
  timeCost: 3,
}

type HashPasswordInput = {
  password: string
  hashedPassword: string
}

const _hashPassword = ({password}: {password: string}): ResultAsync<string, AppException> => {
  return fromPromise(
    Bun.password.hash(password, passwordConfig), () => appException("Error while hashing password", {password}),
  )
}

const _verifyPassword = ({password, hashedPassword}: HashPasswordInput): ResultAsync<boolean, AppException> => {
  return fromPromise(
    Bun.password.verify(password, hashedPassword, passwordConfig.algorithm), () => appException("Error while hashing password", {password}),
  )
}

export const verifyPassword = _trace(_verifyPassword, 'service.jwt.auth/verify-password', {obfuscation: ['password', 'hashedPassword']});
export const hashPassword =  _trace(_hashPassword, 'service.jwt.auth/hash-password', {obfuscation: ['password']});