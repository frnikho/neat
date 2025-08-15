import {Elysia} from "elysia";
import {response} from "@api/utils/response";
import authMiddleware from "@api/middleware/auth.middleware";
import {layoutModels} from "@neat/types/layout";
import createLayout from "@application/layout/create-layout";
import listLayout from "@application/layout/list-layout";
import getLayout from "@application/layout/get-layout";
import updateLayout from "@application/layout/update-layout";
import {extractFromQuery, requestModels} from "@api/utils/request";

export default new Elysia()
    .use(authMiddleware)
    .model(requestModels)
    .model(layoutModels)
    .group('/layout', (app) =>
        app
            .post('/', ({auth, body}) => response(createLayout({auth, body})), {response: 'layout.response.create', body: 'layout.request.create', tags: ['Layout']})
            .get('/', ({auth, query}) => response(listLayout({auth, pag: extractFromQuery(query)})), {response: 'layout.response.list', query: 'pagination', tags: ['Layout']})
            .get('/:id', ({auth, params}) => response(getLayout({id: params.id, auth})), {response: 'layout.response.get', tags: ['Layout']})
            .put('/:id', ({auth, body, params}) => response(updateLayout({auth, body, id: params.id})), {response: 'layout.response.update', body: 'layout.request.update', tags: ['Layout']})
    )
