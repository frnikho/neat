import type { DbException } from "@infra/exception/db.exception";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, type NodePgDatabase, type NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { ResultAsync } from "neverthrow";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

type Tx = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>;

export const opTx = <D extends NodePgDatabase, T, Z extends DbException>(db: D, fn: (tx: Tx) => ResultAsync<T, Z>): ResultAsync<T, Z> => {
	return ResultAsync.fromPromise(
		db.transaction(async (tx) => {
			const res = await fn(tx); // Result<T,Z>
			return res.match(
				(v) => v,
				(e) => {
					throw e;
				},
			);
		}),
		(e) => e as Z,
	);
};
