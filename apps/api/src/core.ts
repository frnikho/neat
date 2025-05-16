import {Elysia} from "elysia";
import authRoute from "$auth/api/auth.route";
import userRoute from "$user/api/user.route";
import roleRoute from "$permission/api/role.route";
import userRoleRoute from "$permission/api/user-role.route";

export const core = new Elysia({
        name: 'core',
    })
        .use(authRoute)
        .use(userRoute)
        .use(roleRoute)
        .use(userRoleRoute)
;