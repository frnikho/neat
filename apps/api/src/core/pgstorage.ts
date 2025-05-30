import { ClientBase, Pool, PoolClient, QueryArrayResult } from "pg";
import {MigrationParams, UmzugStorage} from "umzug";

export interface PGStorageConfiguration {
  tableName: string;
  columnName: string;
}

const configDefaults: PGStorageConfiguration = {
  tableName: "schema_migration",
  columnName: "revision_id",
};

export class PGStorage implements UmzugStorage {
  private readonly db: ClientBase;
  private readonly config: PGStorageConfiguration;
  private tableCreated = false;

  public constructor(
    db: ClientBase,
    partialConfig: Partial<PGStorageConfiguration> = {}
  ) {
    this.db = db;
    this.config = { ...configDefaults, ...partialConfig };
  }

  public async executed(): Promise<string[]> {
    await this.createTable();
    const result: QueryArrayResult = await this.db.query({
      text: `
        SELECT "${this.config.columnName}"
        FROM "${this.config.tableName}"
        ORDER BY "${this.config.columnName}" ASC`,
      rowMode: "array",
    });

    return result.rows.flat();
  }

  public async logMigration(params: MigrationParams<any>): Promise<void> {
    await this.createTable();
    await this.db.query({
      text: `
        INSERT INTO "${this.config.tableName}"
          ("${this.config.columnName}")
          VALUES ($1)
          ON CONFLICT DO NOTHING`,
      values: [params.name],
    });
  }

  public async unlogMigration(params: MigrationParams<any>) {
    await this.createTable();
    await this.db.query({
      text: `
        DELETE FROM "${this.config.tableName}"
        WHERE "${this.config.columnName}" = $1`,
      values: [params.name],
    });
  }

  private async createTable(): Promise<void> {
    if (this.tableCreated) {
      return;
    }
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS "${this.config.tableName}" (
        "${this.config.columnName}" TEXT NOT NULL PRIMARY KEY UNIQUE
      )`);
    this.tableCreated = true;
  }
}

export async function migrateInTransaction<T>(
  db: Pool | ClientBase,
  cb: (db: ClientBase) => Promise<T>
): Promise<T> {
  let conn: ClientBase | PoolClient;
  if (db instanceof Pool) {
    conn = await db.connect();
  } else {
    conn = db;
  }

  try {
    await conn.query("BEGIN TRANSACTION");

    const result = await cb(conn);
    await conn.query("COMMIT");
    return result;
  } catch (e) {
    await conn.query("ROLLBACK");
    throw e;
  } finally {
    if (db instanceof Pool) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore release() does not exist on BaseClient
      conn.release();
    }
  }
}