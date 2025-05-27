import Elysia, {AnyElysia, t} from "elysia";
import {PgTable} from "drizzle-orm/pg-core";
import * as path from "node:path";
import { fileURLToPath } from 'url';
export * from './schema';
import {defineModule} from "@neat/core/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MODULE_FOLDER = path.join(__dirname, '../migrations')

/*type App = {
  name: string
  api_name: string,
  schemas: PgTable[],
  schema: string,
  api: AnyElysia
}*/

export const api = new Elysia()
    .get("/contact", () => "Hello from Contact Form")
    .model({
      'abc': t.Object({

      })
    });

/*const app: App = {
  name: 'Contact',
  api_name: 'contact',
  schemas: [ContactFormTable, ContactFormResultTable],
  schema: MODULE_FOLDER,
  api,
}*/

export default defineModule({
    name: 'Contact',
    api_name: 'contact',
    version: '1.0.0',
    events: [{object: 'contact', action: 'create', name: 'contact.create'}],
    permissions: [{
        object: 'contact',
        action: 'create',
        name: 'contact.create'
    }],
    api,
})


//export default app;