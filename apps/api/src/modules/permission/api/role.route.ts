import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {response} from "@core/response";
import createRole from "$permission/application/create-role";
import {CreateRoleRequest, RoleRequest} from "$permission/api/role.request";

const _createRole = ({body, auth}: {body: CreateRoleRequest, auth: AuthContext}) => {
    return response(createRole({auth, body}), (role) => {
        return 'abc';
    })
}

const deleteRole = (ctx: AuthContext) => {
}

const getRole = () => {

}

const listRole = () => {

}

const updateRole = () => {

}

const listPermission = () => {

}

export default new Elysia()
    .model(RoleRequest)
    .group('/role', (app) =>
        app
            .use(authMiddleware)
            .post('/', _createRole, {body: 'role.create'})
            .delete('/:id', deleteRole)
            .get('/:id', getRole)
            .get('/', listRole)
            .put('/:id', updateRole)
            .get('/:id/permission', listPermission)
    );