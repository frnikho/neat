import {Elysia} from "elysia";
import {widgetModels} from "@neat/types/widget";
import {response} from "@api/utils/response";
import createWidget from "@application/widget/create-widget";
import authMiddleware from "@api/middleware/auth.middleware";
import getWidget from "@application/widget/get-widget";
import listWidget from "@application/widget/list-widget";
import updateWidget from "@application/widget/update-widget";
import getWidgetByKey from "@application/widget/get-widget-by-key";

export default new Elysia()
    .use(authMiddleware)
    .model(widgetModels)
    .group('/widget', (app) =>
        app
            .post('/', ({auth, body}) => response(createWidget({auth, body})), {response: 'widget.response.create', body: 'widget.request.create', tags: ['Widget']})
            .get('/', ({auth}) => response(listWidget({auth})), {response: 'widget.response.list', tags: ['Widget']})
            .get('/key/:key', ({auth, params}) => response(getWidgetByKey({key: params.key, auth})), {response: 'widget.response.get', tags: ['Widget']})
            .get('/:id', ({auth, params}) => response(getWidget({id: params.id, auth})), {response: 'widget.response.get', tags: ['Widget']})
            .put('/:id', ({auth, body, params}) => response(updateWidget({auth, body, id: params.id})), {response: 'widget.response.update', body: 'widget.request.update', tags: ['Widget']})
    )
