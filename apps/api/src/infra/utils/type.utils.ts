import { isNone, isSome, none, type Option, some } from "fp-ts/Option";
import {err, ok, Result, ResultAsync} from "neverthrow";
import {CacheException} from "@infra/exception/cache.exception";

export const mapOption = <R, E>(row: Option<R>, fn: (value: R) => E): Option<E> => {
	if (isNone(row)) {
		return none;
	}
	return some<E>(fn(row.value));
};

export const andThrow = <T extends Error>(err: T) => {
	throw err;
};

export const oneOrThrow = <T, Z>(res: T[], error: Z): Result<T, Z> => {
	if (res.length === 0) {
		return err(error);
	}
	return ok(res[0]);
};

export const oneOrOption = <T>(res: T[], entityName = "Entity"): Option<T> => {
	if (res.length === 0) {
		return none;
	}
	return some(res[0]);
};

export const oneOreResultOption = <T, Z extends Error>(res: T[], entityName = "Entity"): Result<Option<T>, Z> => {
	if (res.length === 0) {
		return ok(none);
	}
	return ok(some(res[0]));
};

export const optionToResult = <T, Z>(option: Option<T>, error: Z): Result<T, Z> => {
	return isSome(option) ? ok(option.value) : err(error);
};

export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
	return value !== null && value !== undefined;
};

export const JsonParse = <T>(value: string) => ResultAsync.fromThrowable(() => JSON.parse(value) as Promise<T>, () => new CacheException('Invalid JSON format'));

export const Json = {
    Parse: ResultAsync.fromThrowable(JSON.parse, () => new CacheException('Invalid JSON format')),
    Stringify: ResultAsync.fromThrowable(
        async (data: unknown) => JSON.stringify(data),
        () => new CacheException('Invalid JSON format')
    )
}