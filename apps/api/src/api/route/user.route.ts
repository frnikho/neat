import {Elysia} from "elysia";

export default new Elysia()
    .model(UserRequest)
    .model(UserResponse)
    .model(requestModels)
    .use(authMiddleware)
    .group('/user', (app) =>
        app
            .get('/:userId', ({auth, params}) => response(getUser({auth, userId: params.userId})), {
                response: {200: 'user.response.get'},
                detail: {tags: ['User']}
            })
            .delete('/:userId', ({params, auth}) => response(deleteUser({
                auth,
                userId: params.userId
            })), {response: {200: 'user.response.delete'}, detail: {tags: ['User']}})
            .patch('/:userId', ({params, body, auth}) => response(updateUser({
                auth,
                userId: params.userId,
                body
            })), {
                body: 'user.request.update',
                response: {200: 'user.response.update'},
                detail: {tags: ['User']}
            })
            .get('/', ({query, auth}) => response(listUser({
                pag: extractFromQuery(query),
                auth
            })), {response: 'user.response.list', query: 'pagination', detail: {tags: ['User']}}))
    .group('/user/:userId/roles', (app) =>
        app
            .get('/', ({params, auth}) => response(listUserRole({
                auth,
                userId: params.userId
            })), {tags: ['User', 'Role']})
            .delete('/:roleId', ({params, auth}) => response(removeUserRole({
                auth,
                userId: params.userId,
                roleId: params.roleId
            })), {tags: ['User', 'Role']})
            .post('/:roleId', ({params, auth}) => addUserRole({
                auth,
                userId: params.userId,
                roleId: params.roleId
            }), {tags: ['User', 'Role']})
    ).group('/user/:userId/profile-picture', (app) =>
        app
            .post('/', ({body, auth, params}) => response(uploadProfilePicture({auth, ...body, userId: params.userId})), {body: 'user.request.profile-picture', detail: {tags: ['User']}})
            .get('/', () => {}, {detail: {tags: ['User']}})
            .delete('/', ({auth, params}) => response(deleteProfilePicture({auth, userId: params.userId})), {detail: {tags: ['User']}})
    )
