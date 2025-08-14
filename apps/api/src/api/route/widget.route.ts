import {Elysia} from "elysia";
import {widgetModels} from "@neat/types/widget";
import {response} from "@api/utils/response";
import createWidget from "@application/widget/create-widget";
import authMiddleware from "@api/middleware/auth.middleware";
import getWidget from "@application/widget/get-widget";
import listWidget from "@application/widget/list-widget";
import updateWidget from "@application/widget/update-widget";

export default new Elysia()
    .use(authMiddleware)
    .model(widgetModels)
    .group('/widget', (app) =>
        app
            .post('/', ({auth, body}) => response(createWidget({auth, body})), {response: 'widget.response.create', body: 'widget.request.create'})
            .get('/', ({auth}) => response(listWidget({auth})), {response: 'widget.response.list'})
            .get('/:id', ({auth, params}) => response(getWidget({id: params.id, auth})), {response: 'widget.response.get'})
            .put('/:id', ({auth, body, params}) => response(updateWidget({auth, body, id: params.id})), {response: 'widget.response.update', body: 'widget.request.update'})
    )
