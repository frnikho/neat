import { init } from "@paralleldrive/cuid2";
import {drizzle, NodePgDatabase} from "drizzle-orm/node-postgres";
import * as p from "drizzle-orm/pg-core";
import {ResultAsync} from "neverthrow";
import {DbException} from "@core/exceptions/db.exception";
import {Pool} from "pg";

export const createId = init({ length: 12 });

export const uid = (name?: string) => p.varchar(name).$default(() => createId());

export type DbPool = NodePgDatabase;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export const op = <T> (a: Promise<T>): ResultAsync<T, DbException> => {
  return ResultAsync.fromPromise(a, (err) => {
    console.log('op');
    console.log(err);
    return new DbException("Database error");
  });
}