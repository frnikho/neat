import contact, {api as moduleApi} from "@modules/contact/server";
import authModule, {api as authApi} from "$auth/auth.module";
import userModule, {api as userApi} from "$user/user.module";
import permissionModule, {api as permissionApi} from "$permission/permission.module";
import {Elysia} from "elysia";

export const modules = [
    authModule,
    userModule,
    permissionModule,
    contact
];

export const apiModules = new Elysia()
    .use(authApi)
    .use(permissionApi)
    .use(userApi)
    .use(moduleApi)
