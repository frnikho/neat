import {Elysia, TypeSystemPolicy} from "elysia";
import {instrumentation} from "@core/instrumentation";
import {startMigration} from "@core/migrate";
import {createAuthCode} from "$auth/application/create-auth-code";
import {authCodeRepo} from "$auth/infra/auth-code.repo";
import {cors} from '@elysiajs/cors'
import swagger from "@elysiajs/swagger";
import {apiModules, modules} from "./modules";
import {insertModulePermissions} from "$module/infra/module.service";

await startMigration();

const permissions = await insertModulePermissions();

console.log(permissions.isOk() && permissions.value);

const app = new Elysia()
    .state({modules: modules})
    .use(instrumentation())
    .use(swagger())
    .use(cors())
    .onError(({error}) => {
        return JSON.stringify((error));
    })
/*    .get("/", async ({Sentry}) => {
        console.log("hello");
        await test();
        Sentry.captureMessage("Hello World from Elysia");
        return "Hello Elysia"
    })*/
    .use(apiModules)
    .listen(4000, (srv) => {
        console.log(`🦊 Elysia is running at ${srv.hostname}:${srv.port}`);
        createAuthCode({repo: authCodeRepo})().map((a) => {
            console.log(a);
        });
    });

export type App = typeof app