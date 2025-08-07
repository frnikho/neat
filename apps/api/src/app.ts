import { Elysia } from "elysia";
import userRoute from "@api/route/user.route";
import settingsRoute from "@api/route/setttings.route";
import authRoute from "@api/route/auth.route";
import roleRoute from "@api/route/role.route";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
    .use(swagger())
    .use(userRoute)
    .use(roleRoute)
    .use(authRoute)
    .use(settingsRoute)
    .get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
