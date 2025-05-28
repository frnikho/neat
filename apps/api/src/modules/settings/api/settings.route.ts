import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {Elysia} from "elysia";

const _listSettings = ({user, accessToken}: AuthContext) => {

};

const _getSettings = ({user, accessToken}: AuthContext) => {

};

const _updateSettings = ({user, accessToken}: AuthContext) => {

};

const _resetSettings = ({user, accessToken}: AuthContext) => {

};

export default new Elysia()
    .group('/settings', (app) =>
        app
            .use(authMiddleware)
            .get('/settings', _listSettings)
            .get('/settings/:settingId', _getSettings)
            .patch('/settings/:settingId', _updateSettings)
            .post('/settings/:settingId/reset', _resetSettings)
    );
