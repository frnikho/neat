import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {response} from "@core/response";
import listUserRole from "$permission/application/list-user-role";
import removeUserRole from "$permission/application/remove-user-role";
import addUserRole from "$permission/application/add-user-role";

type UserParams = {
    params: { userId: string };
}

type UserRoleParams = UserParams & {
    params: { roleId: string };
}

const _addUserRole = (ctx: AuthContext & UserRoleParams) => {
    return response(addUserRole({auth: ctx, userId: ctx.params.userId, roleId: ctx.params.roleId}), () => {
        return null;
    })
}

const _removeUserRole = (ctx: AuthContext & UserRoleParams) => {
    return response(removeUserRole({auth: ctx, userId: ctx.params.userId, roleId: ctx.params.roleId}), () => {
        return null;
    })
}

const _listUserRole = (ctx: AuthContext & UserParams) => {
    return response(listUserRole({auth: ctx, userId: ctx.params.userId}), (roles) => {
        return roles;
    })
}

export default new Elysia()
    .group('/users/:userId/roles', (app) =>
        app
            .use(authMiddleware)
            .get('/', _listUserRole)
            .delete('/:roleId', _removeUserRole)
            .post('/:roleId', _addUserRole)
    );