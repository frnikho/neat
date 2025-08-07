import { Elysia } from "elysia";
import userRoute from "@api/route/user.route";

const app = new Elysia()
    .use(userRoute)
    .get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
