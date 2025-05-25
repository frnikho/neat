import {Result, ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {andThrow} from "@core/type";
import {Value} from "@sinclair/typebox/value";
import {TSchema, t} from "elysia";

export const rawResponse = <T, Z>(res: ResultAsync<T, ApiError>, handler: (data: T) => Z) => {
    return res.match(
        (data) => handler(data),
        andThrow
    )
}

export const response = <
    T,
    S extends TSchema,
    Z = T
>(
    res: ResultAsync<T, ApiError>,
    schema: S,
    handler?: (data: T) => Z
) => {
    return res.match(
        (data) => {
            const cleaned = Value.Clean(schema, data);
            // Optionnel : Validation stricte
            // if (!Value.Check(schema, cleaned)) {
            //   throw new Error('Invalid data according to schema');
            // }
            return handler ? handler(cleaned as T) : (cleaned as unknown as Z);
        },
        andThrow
    );
};

export const responseAsync = <T, Z>(res: ResultAsync<T, ApiError>, handler: (data: T) => Z) => {
    return res.match(
        (data) => handler(data),
        andThrow
    )
}

export const EmptyResponse = t.Void();