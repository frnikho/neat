import { defineModule } from "@neat/core/server";
import userRoute from "$user/api/user.route";

export default defineModule({
    name: 'User',
    api_name: 'user',
    version: '1.0.0',
    permissions: [
        {
            resource: 'user',
            action: '*',
            name: 'Manage all user-related actions'
        },
        {
            resource: 'user',
            action: 'read.own',
            name: 'Read own user information'
        },
        {
            resource: 'user',
            action: 'write.own',
            name: 'Update own user information'
        },
        {
            resource: 'user',
            action: 'delete.own',
            name: 'Delete own user account'
        },
        {
            resource: 'user',
            action: 'read.all',
            name: 'Read all user information'
        },
        {
            resource: 'user',
            action: 'write.all',
            name: 'Update any user information'
        },
        {
            resource: 'user',
            action: 'delete.all',
            name: 'Delete any user account'
        },
        {
            resource: 'user',
            action: 'freeze',
            name: 'Freeze a user account'
        }
    ]
});

export const api = userRoute;