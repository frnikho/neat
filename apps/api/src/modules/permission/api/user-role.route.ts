import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {EmptyResponse, response} from "@core/response";
import listUserRole from "$permission/application/list-user-role";
import removeUserRole from "$permission/application/remove-user-role";
import addUserRole from "$permission/application/add-user-role";
import {rolesResponse} from "$permission/api/role.response";

type UserParams = {
    params: { userId: string };
}

type UserRoleParams = UserParams & {
    params: { roleId: string };
}

const _addUserRole = (ctx: AuthContext & UserRoleParams) => {
    return response(addUserRole({auth: ctx, userId: ctx.params.userId, roleId: ctx.params.roleId}), EmptyResponse)
}

const _removeUserRole = (ctx: AuthContext & UserRoleParams) => {
    return response(removeUserRole({auth: ctx, userId: ctx.params.userId, roleId: ctx.params.roleId}), EmptyResponse)
}

const _listUserRole = (ctx: AuthContext & UserParams) => {
    return response(listUserRole({auth: ctx, userId: ctx.params.userId}), rolesResponse)
}

export default new Elysia()
    .group('/user/:userId/roles', (app) =>
        app
            .use(authMiddleware)
            .get('/', _listUserRole, {tags: ['User', 'Role']})
            .delete('/:roleId', _removeUserRole, {tags: ['User', 'Role']})
            .post('/:roleId', _addUserRole, {tags: ['User', 'Role']})
    );