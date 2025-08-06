import {fromPromise, type ResultAsync} from "neverthrow";
import {HashException} from "@infra/exception/hash.exception";

export const passwordConfig: Bun.Password.Argon2Algorithm = {
    algorithm: 'argon2id',
    memoryCost: 4,
    timeCost: 3,
}

type HashPasswordInput = {
    password: string
    hashedPassword: string
}

export const hashPassword = ({password}: {password: string}): ResultAsync<string, HashException> => {
    return fromPromise(
        Bun.password.hash(password, passwordConfig), () => new HashException("Error while hashing password"),
    )
}

export const verifyPassword = ({password, hashedPassword}: HashPasswordInput): ResultAsync<boolean, HashException> => {
    return fromPromise(
        Bun.password.verify(password, hashedPassword, passwordConfig.algorithm), () => new HashException("Error while hashing password"),
    )
}