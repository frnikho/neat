import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {response} from "@core/response";
import createRole from "$permission/application/create-role";
import {createRoleRequest, CreateRoleRequest, RoleRequest, UpdateRoleRequest} from "$permission/api/role.request";
import getRole from "$permission/application/get-role";
import listRole from "$permission/application/list-role";
import {extractFromQuery, PaginationQuery, RequestModels} from "@core/request";
import deleteRole from "$permission/application/delete-role";
import {
    roleResponse,
    RoleResponse,
    RolesResponse,
    rolesResponse,
    roleWithPermissionsResponse
} from "$permission/api/role.response";
import updateRole from "$permission/application/update-role";

type RoleParams = {
    params: { id: string };
}

const _createRole = ({body, auth}: {body: CreateRoleRequest, auth: AuthContext}) => {
    return response(createRole({auth, body}), createRoleRequest, ({role, permissions}) => {
        return {
            role,
            permissions,
        };
    })
}

const _deleteRole = ({params, auth}: RoleParams & {auth: AuthContext}) => {
    return response(deleteRole({auth, roleId: params.id}), roleResponse, ({role}) => {
        return role;
    })
}

const _getRole = ({params, auth}: RoleParams & {auth: AuthContext}) => {
    return response(getRole({auth, roleId: params.id}), roleWithPermissionsResponse, ({role, permissions}) =>  {
        return {
            role,
            permissions,
        }
    });
}

const _listRole = ({auth, query}: { auth: AuthContext, query: PaginationQuery }): Promise<RolesResponse> => {
    return response(listRole({auth, pag: extractFromQuery(query)}), rolesResponse);
}

const _updateRole = ({auth, body, params}: {auth: AuthContext, body: UpdateRoleRequest} & RoleParams) => {
    return response(updateRole({auth, body, roleId: params.id}), roleWithPermissionsResponse);
}

export default new Elysia()
    .model(RoleRequest)
    .model(RoleResponse)
    .model(RequestModels)
    .use(authMiddleware)
    .group('/role', (app) =>
        app
            .get('/', _listRole, {query: 'pagination', response: {200: 'role.response.list'}, detail: {tags: ['Role']}})
            .post('/', _createRole, {body: 'role.request.create', response: 'role.response.create', detail: {tags: ['Role']}})
            .delete('/:id', _deleteRole, {response: 'role.response.delete', detail: {tags: ['Role']}})
            .get('/:id', _getRole, {response: 'role.response.get', detail: {tags: ['Role']}})
            .patch('/:id', _updateRole, {body: 'role.request.update', response: 'role.response.update', detail: {tags: ['Role']}})
    );