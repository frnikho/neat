import {PgTable} from "drizzle-orm/pg-core";

type Module = {
  schemas: PgTable[];
}

export const registerModule = (module: Module) => {

}