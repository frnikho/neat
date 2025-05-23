import {Elysia} from "elysia";
import authMiddleware from "$auth/api/auth.middleware";
import {extractFromQuery, RequestModels} from "@core/request";

const _findById = () => {
    console.log('abc');
}

const _list = ({query, params}: { query: Record<any, any>, params: { userId: string } }) => {
    const pagination = extractFromQuery(query);
}

const _create = () => {

}

const _delete = () => {

}

const _update = () => {

}

export default new Elysia()
    .model(RequestModels)
    .group('/users', (app) =>
        app
            .use(authMiddleware)
            .get('/', _list, {query: 'pagination'})
            .get('/:userId', _findById)
            .post('/', _create)
            .delete('/:userId', _delete)
            .patch('/:userId', _update)
    );