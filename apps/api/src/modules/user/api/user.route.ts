import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {extractFromQuery, PaginationQuery, RequestModels} from "@core/request";
import {response} from "@core/response";
import {findById} from "$user/application/get-user";
import listUser from "$user/application/list-user";
import {userResponse, UserResponse, usersResponse} from "$user/api/user.response";
import deleteUser from "$user/application/delete-user";
import {UpdateUserRequest, UserRequest} from "$user/api/user.request";
import updateUser from "$user/application/update-user";

type UserParams = {
    params: { userId: string };
}

const _get = ({params}: {auth: AuthContext} & UserParams) => {
    return response(findById(params.userId), userResponse);
}

const _list = ({query, auth}: { query: PaginationQuery, auth: AuthContext }) => {
    return response(listUser({pag: extractFromQuery(query), auth}), usersResponse);
}

const _create = () => {

}

const _delete = ({params, auth}: {auth: AuthContext} & UserParams) => {
    return response(deleteUser({auth, userId: params.userId}), userResponse);
}

const _update = ({params, body, auth}: {body: UpdateUserRequest, auth: AuthContext} & UserParams) => {
    return response(updateUser({auth, userId: params.userId, body}), userResponse);
}

export default new Elysia()
    .model(UserRequest)
    .model(UserResponse)
    .model(RequestModels)
    .group('/user', (app) =>
        app
            .use(authMiddleware)
            .post('/', _create, {detail: {tags: ['User']}})
            .get('/:userId', _get, {response: {200: 'user.response.get'}, detail: {tags: ['User']}})
            .delete('/:userId', _delete, {response: {200: 'user.response.delete'}, detail: {tags: ['User']}})
            .patch('/:userId', _update, {body: 'user.request.update', response: {200: 'user.response.update'}, detail: {tags: ['User']}})
            .get('/', _list, {response: 'user.response.list', query: 'pagination', detail: {tags: ['User']}})
    );