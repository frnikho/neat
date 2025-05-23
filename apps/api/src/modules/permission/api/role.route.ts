import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {response} from "@core/response";
import createRole from "$permission/application/create-role";
import {CreateRoleRequest, RoleRequest, UpdateRoleRequest} from "$permission/api/role.request";
import getRole from "$permission/application/get-role";
import listRole from "$permission/application/list-role";
import {extractFromQuery, PaginationQuery, RequestModels} from "@core/request";
import deleteRole from "$permission/application/delete-role";
import {RoleResponse} from "$permission/api/role.response";
import updateRole from "$permission/application/update-role";

type RoleParams = {
    params: { id: string };
}

const _createRole = ({body, auth}: {body: CreateRoleRequest, auth: AuthContext}) => {
    return response(createRole({auth, body}), ({role, permissions}) => {
        return {
            role,
            permissions,
        };
    })
}

const _deleteRole = ({params, auth}: RoleParams & {auth: AuthContext}) => {
    return response(deleteRole({auth, roleId: params.id}), ({role}) => {
        return role;
    })
}

const _getRole = ({params, auth}: RoleParams & {auth: AuthContext}) => {
    return response(getRole({auth, roleId: params.id}), ({role, permissions}) =>  {
        return {
            role,
            permissions,
        }
    });
}

const _listRole = ({auth, query}: { auth: AuthContext, query: PaginationQuery }) => {
    return response(listRole({auth, pag: extractFromQuery(query)}), (roles) => {
        return roles;
    });
}

const _updateRole = ({auth, body, params}: {auth: AuthContext, body: UpdateRoleRequest} & RoleParams) => {
    return response(updateRole({auth, body, roleId: params.id}), ({role, permissions}) => {
        return {
            role,
            permissions,
        };
    });
}

const listPermission = () => {

}

export default new Elysia()
    .model(RoleRequest)
    .model(RoleResponse)
    .model(RequestModels)
    .group('/role', (app) =>
        app
            .use(authMiddleware)
            .post('/', _createRole, {body: 'role.request.create', response: 'role.response.create'})
            .delete('/:id', _deleteRole, {response: 'role.response.delete'})
            .get('/:id', _getRole, {response: 'role.response.get'})
            .get('/', _listRole, {query: 'pagination', response: 'role.response.list'})
            .patch('/:id', _updateRole, {body: 'role.request.update', response: 'role.response.update'})
            .get('/:id/permission', listPermission)
    );