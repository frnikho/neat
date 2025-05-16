import Elysia, {t} from "elysia";
import {PgTable} from "drizzle-orm/pg-core";
import {ContactFormResultTable, ContactFormTable} from "./schema";
import * as path from "node:path";
import { fileURLToPath } from 'url';
export * from './schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const MODULE_FOLDER = path.join(__dirname, '../migrations')

type App = {
  name: string
  api_name: string,
  schemas: PgTable[],
  schema: string
}

const app: App = {
  name: 'Contact',
  api_name: 'contact',
  schemas: [ContactFormTable, ContactFormResultTable],
  schema: MODULE_FOLDER
}

export const api = new Elysia()
  .get("/contact", () => "Hello from Contact Form")
  .model({
    'abc': t.Object({

    })
  });

export default app;