import { init } from "@paralleldrive/cuid2";
import {drizzle, NodePgDatabase, NodePgQueryResultHKT} from "drizzle-orm/node-postgres";
import * as p from "drizzle-orm/pg-core";
import {fromPromise, ResultAsync} from "neverthrow";
import {DbException} from "@core/exceptions/db.exception";
import {Pool} from "pg";
import {PgTransaction} from "drizzle-orm/pg-core";
import {ExtractTablesWithRelations} from "drizzle-orm";
import {AppException} from "@core/exceptions";

export const createId = init({ length: 12 });

export const uid = (name?: string) => p.varchar(name).$default(() => createId());

export type DbPool = NodePgDatabase;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

type A = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>;

export const opTx = <D extends NodePgDatabase, T, Z extends AppException>(tx: D, fn: (tx: A) => Promise<T>): ResultAsync<T, Z> => {
  return fromPromise(tx.transaction(fn), (e) => e as Z);
};

export const op = <T> (a: Promise<T>): ResultAsync<T, DbException> => {
  return ResultAsync.fromPromise(a, (err) => {
    console.log('op');
    console.log(err);
    return new DbException("Database error");
  });
}