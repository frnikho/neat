import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";
import {response} from "@core/response";
import createRole from "$permission/application/create-role";
import {CreateRoleRequest, RoleRequest} from "$permission/api/role.request";
import getRole from "$permission/application/get-role";
import listRole from "$permission/application/list-role";
import {extractFromQuery, PaginationQuery, RequestModels} from "@core/request";
import deleteRole from "$permission/application/delete-role";

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
        return {
            role,
        };
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

const updateRole = () => {

}

const listPermission = () => {

}

export default new Elysia()
    .model(RoleRequest)
    .model(RequestModels)
    .group('/role', (app) =>
        app
            .use(authMiddleware)
            .post('/', _createRole, {body: 'role.create'})
            .delete('/:id', _deleteRole)
            .get('/:id', _getRole)
            .get('/', _listRole, {query: 'pagination'})
            .put('/:id', updateRole)
            .get('/:id/permission', listPermission)
    );