import {ResultAsync} from "neverthrow";

export interface S3ExceptionShape {
    message: string;
    details?: Record<string, unknown>;
}

export class S3Exception extends Error implements S3ExceptionShape {
    message: string;
    details?: Record<string, unknown>;

    constructor(message: string, details?: Record<string, unknown>) {
        super(message);
        this.message = message;
        this.details = details;
    }
}

export const s3 = <T> (a: Promise<T>): ResultAsync<T, S3Exception> => {
    return ResultAsync.fromPromise(a, (e) => {
        return e as S3Exception;
    });
}