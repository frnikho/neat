import ContactModule from '@modules/contact/app'
import {FileMigrationProvider, Kysely, Migrator, PostgresDialect} from 'kysely'
import {Pool} from "pg";

import * as path from 'path'
import fs from 'fs/promises'
import {Umzug} from "umzug";
import {migrateInTransaction, PGStorage} from "./pgstorage";

export const migrate = async () => {
  console.log('ContactModule.schema');
  console.log(ContactModule.schema);

  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL!,
      })
    })
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: ContactModule.schema,
    }),
  });

  const {error, results} = await migrator.migrateToLatest();
  console.log(error);
  console.log(results);

}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

export const test = async () => {

  const a = await migrateInTransaction(pool, async (db) => {
    let umzug = new Umzug({
      storage: new PGStorage(db, {
        tableName: "neat_migration",
        columnName: "neat_revision_id",
      }),
      logger: console,
      context: db,
      migrations: {
        glob: ['*.sql', {cwd: ContactModule.schema}],
        resolve(params) {
          const downPath = path.join(path.dirname(params.path!), 'down', path.basename(params.path!));
          return {
            name: params.name,
            path: params.path,
            up: async () => params.context.query(await fs.readFile(params.path!, 'utf-8')),
            down: async () => params.context.query(await fs.readFile(downPath, 'utf-8')),
          };
        },
      }
    });
    return await umzug.up();
  });
  console.log(a);
}

export const startMigration = async () => {

  const a = await migrateInTransaction(pool, async (db) => {
    let umzug = new Umzug({
      storage: new PGStorage(db, {
        tableName: "neat_migration",
        columnName: "neat_revision_id",
      }),
      logger: console,
      context: db,
      migrations: {
        glob: ['../../migrations/*.sql', {cwd: __dirname}],
        resolve(params) {
          const downPath = path.join(path.dirname(params.path!), 'down', path.basename(params.path!));
          return {
            name: params.name,
            path: params.path,
            up: async () => params.context.query(await fs.readFile(params.path!, 'utf-8')),
            down: async () => params.context.query(await fs.readFile(downPath, 'utf-8')),
          };
        },
      }
    });
    return await umzug.up();
  });
  console.log(a);
}