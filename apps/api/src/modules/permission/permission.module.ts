import { defineModule } from "@neat/core/server";
import {Elysia} from "elysia";
import userRoleRoute from "$permission/api/user-role.route";
import roleRoute from "$permission/api/role.route";

export default defineModule({
    name: "Permission",
    api_name: "permission",
    version: "1.0.0",
    api: new Elysia()
        .use(roleRoute)
        .use(userRoleRoute),
    permissions: [
        {
            object: 'role',
            action: '*',
            description: 'Manage all role-related actions'
        },
        {
            object: 'role',
            action: 'read.own',
            description: 'Read own role information'
        },
        {
            object: 'role',
            action: 'write.own',
            description: 'Update own role information'
        },
        {
            object: 'role',
            action: 'delete.own',
            description: 'Delete own role account'
        },
        {
            object: 'role',
            action: 'read.all',
            description: 'Read all role information'
        },
        {
            object: 'role',
            action: 'write.all',
            description: 'Update any role information'
        },
        {
            object: 'role',
            action: 'delete.all',
            description: 'Delete any role account'
        }
    ]
});