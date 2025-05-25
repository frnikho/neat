import {Elysia} from "elysia";
import {instrumentation} from "@core/instrumentation";
import {startMigration, test} from "@core/migrate";
import {createAuthCode} from "$auth/application/create-auth-code";
import {authCodeRepo} from "$auth/infra/auth-code.repo";
import {core} from "./core";
import {cors} from '@elysiajs/cors'
import swagger from "@elysiajs/swagger";
import {sentry} from "elysiajs-sentry";

await startMigration();


// const modules = new Elysia()
//   .use(api);

const app = new Elysia()
    .use(sentry({sendDefaultPii: true, dsn: 'http://99ecd3eb673941e9867e15e84b26aff6@localhost:9000/1'}))
    .use(instrumentation())
    .use(swagger())
    .use(cors())
    .onError(({error}) => {
        console.log(error);
        return JSON.stringify((error));
    })
    .use(core)
    // .use(modules)
    .get("/", async ({Sentry}) => {
        console.log("hello");
        await test();
        Sentry.captureMessage("Hello World from Elysia");
        return "Hello Elysia"
    })
    .listen(4000, (srv) => {
        console.log(`🦊 Elysia is running at ${srv.hostname}:${srv.port}`);
        createAuthCode({repo: authCodeRepo})().map((a) => {
            console.log(a);
        });
    });

export type App = typeof app