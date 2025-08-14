import authRoute from "@api/route/auth.route";
import roleRoute from "@api/route/role.route";
import settingsRoute from "@api/route/setttings.route";
import userRoute from "@api/route/user.route";
import createDefaultPermissions from "@application/role/create-default-permissions";
import createDefaultRoles from "@application/role/create-default-roles";
import createDefaultSettings from "@application/settings/create-default-settings";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import createDefaultPages from "@application/page/create-default-pages";
import pageRoute from "@api/route/page.route";

const app = new Elysia()
	.use(cors())
	.use(swagger())
	.use(userRoute)
	.use(roleRoute)
	.use(authRoute)
	.use(settingsRoute)
    .use(pageRoute)
	.get("/", () => "Hello Elysia")
	.listen(4000, async (srv) => {
		await createDefaultSettings();
		await createDefaultPermissions();
		await createDefaultRoles();
        await createDefaultPages();
		console.log(`🦊 Elysia is running at ${srv.hostname}:${srv.port}`);
	});

export type App = typeof app;