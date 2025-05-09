import { Elysia } from "elysia";
import { instrumentation } from "@core/instrumentation";
import ContactApp, {api} from '@modules/contact/app';
import {startMigration, test} from "@core/migrate";
import {createAuthCode} from "$auth/application/create-auth-code";
import {authCodeRepo} from "$auth/infra/auth-code.repo";
import { core } from "./core";

await startMigration();


const modules = new Elysia()
  .use(api);

const app = new Elysia()
  .use(instrumentation())
  .onError(({error}) => {
    return JSON.stringify((error));
  })
  .use(core)
  .use(modules)
  .get("/", async () => {
    console.log("hello");
    await test();
    return "Hello Elysia"
  })
  .listen(4000, (srv) => {
    console.log(`🦊 Elysia is running at ${srv.hostname}:${srv.port}`);
    createAuthCode({repo: authCodeRepo})().map((a) => {
      console.log(a);
    });
  });

export type App = typeof app