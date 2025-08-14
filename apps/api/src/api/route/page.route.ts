import {Elysia} from "elysia";
import {response} from "@api/utils/response";
import getPageContent from "@application/page/get-page-content";

export default new Elysia()
    .group('/page', (app) =>
        app
            .get('/', () => {})
            .get('/:slug', ({params}) => response(getPageContent({pageSlug: params.slug})))
    )