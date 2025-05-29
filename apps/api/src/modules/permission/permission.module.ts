import { defineModule } from "@neat/core/server";
import {Elysia} from "elysia";
import userRoleRoute from "$permission/api/user-role.route";
import roleRoute from "$permission/api/role.route";

export const api = new Elysia()
    .use(roleRoute)
    .use(userRoleRoute);

export default defineModule({
    name: "Permission",
    api_name: "permission",
    version: "1.0.0",
    permissions: [
        {
            resource: 'role',
            action: '*',
            name: 'Manage all role-related actions'
        },
        {
            resource: 'role',
            action: 'read.own',
            name: 'Read own role information'
        },
        {
            resource: 'role',
            action: 'write.own',
            name: 'Update own role information'
        },
        {
            resource: 'role',
            action: 'delete.own',
            name: 'Delete own role account'
        },
        {
            resource: 'role',
            action: 'read.all',
            name: 'Read all role information'
        },
        {
            resource: 'role',
            action: 'write.all',
            name: 'Update any role information'
        },
        {
            resource: 'role',
            action: 'delete.all',
            name: 'Delete any role account'
        }
    ]
});