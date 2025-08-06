import {fromPromise, type ResultAsync} from "neverthrow";
import {errors, JWTPayload, jwtVerify, JWTVerifyResult, SignJWT} from "jose";
import {JwtException} from "@infra/exception/jwt.exception";
import {Token} from "@schema/token.schema";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const createToken = (token: JWTPayload, expirationTime: number | string | Date): ResultAsync<string, JwtException> => {
    return fromPromise(new SignJWT(token)
            .setProtectedHeader({alg: 'HS256'})
            .setExpirationTime(expirationTime)
            .setIssuedAt()
            .sign(JWT_SECRET),
        () => new JwtException('Error while creating jwt token !'));
}

export const verifyToken = (token: string, ignoreExpiration = false): ResultAsync<JWTVerifyResult<Token>, JwtException> => {
    return fromPromise(
        jwtVerify(token, JWT_SECRET, {
            currentDate: ignoreExpiration ? new Date(0) : new Date(),
        }),
        (err) => {
            if (err instanceof errors.JWTInvalid || err instanceof errors.JWTExpired || err instanceof errors.JWSInvalid) {
                return new JwtException('Invalid jwt token !');
            }
            return new JwtException('Error while verifying jwt token !');
        },
    )
}