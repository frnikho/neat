import { init } from "@paralleldrive/cuid2";
import * as p from "drizzle-orm/pg-core";
import { ResultAsync } from "neverthrow";

export const createId = init({ length: 12 });

export const uid = (name?: string) => p.varchar(name).$default(() => createId());

export const op = <T, Z extends Error>(a: Promise<T>): ResultAsync<T, Z> => {
	return ResultAsync.fromPromise(a, (err) => {
		return err as Z;
	});
};
