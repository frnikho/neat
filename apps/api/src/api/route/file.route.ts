import {Elysia} from "elysia";
import authMiddleware from "@api/middleware/auth.middleware";

export default new Elysia()
    .use(authMiddleware)
    .group('/file', (app) =>
        app
            .get('/', () => {})
            .get('/:id', () => {})
            .delete('/:id', () => {})
    )