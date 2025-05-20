import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {Elysia} from "elysia";

const getSettings = ({user, accessToken}: AuthContext) => {

}


export default new Elysia()
    .group('/settings', (app) =>
        app
            .use(authMiddleware)
            .get('/settings/:settingId', getSettings)
    );
