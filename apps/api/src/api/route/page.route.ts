import {Elysia} from "elysia";
import {response} from "@api/utils/response";
import getPageContent from "@application/page/get-page-content";
import {pageModels} from "@neat/types/page";
import authMiddleware from "@api/middleware/auth.middleware";
import {extractFromQuery, requestModels} from "@api/utils/request";
import listPage from "@application/page/list-page";
import deletePage from "@application/page/delete-page";
import updatePage from "@application/page/update-page";
import createPage from "@application/page/create-page";

export default new Elysia()
    .model(pageModels)
    .model(requestModels)
    .group('/page', (app) =>
        app.get('/:id', ({params}) => response(getPageContent({pageSlug: params.id})), {tags: ['Page'], /*response: {200: 'page.response.get'}*/})
    )
    .use(authMiddleware)
    .group('/page', (app) =>
        app
            .post('/', ({auth, body}) => response(createPage({auth, body})), {response: 'page.response.create', body: 'page.request.create', tags: ['Page']})
            .get('/', ({auth, query}) => response(listPage({pag: extractFromQuery(query), auth})), {response: {200: 'page.response.list'}, query: 'pagination', tags: ['Page']})
            .delete('/:id', ({auth, params}) => response(deletePage({id: params.id, auth})), {response: 'page.response.delete', tags: ['Page']})
            .put('/:id', ({auth, body, params}) => response(updatePage({auth, body, id: params.id})), {response: 'page.response.update', body: 'page.request.update', tags: ['Page']})
    )