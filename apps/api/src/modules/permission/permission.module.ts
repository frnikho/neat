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

type Permission = {
    object: string;
    action: string;
    description: string;
}

const authPermission = [
    {
        description: 'Get the current user information',
        object: 'auth',
        action: 'me'
    }
] as const;

const rolePermissions = [
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
] as const;