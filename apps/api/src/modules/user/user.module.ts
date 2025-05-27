import { defineModule } from "@neat/core/server";
import userRoute from "$user/api/user.route";

export default defineModule({
    name: 'User',
    api_name: 'user',
    version: '1.0.0',
    api: userRoute,
    permissions: [
        {
            object: 'user',
            action: '*',
            description: 'Manage all user-related actions'
        },
        {
            object: 'user',
            action: 'read.own',
            description: 'Read own user information'
        },
        {
            object: 'user',
            action: 'write.own',
            description: 'Update own user information'
        },
        {
            object: 'user',
            action: 'delete.own',
            description: 'Delete own user account'
        },
        {
            object: 'user',
            action: 'read.all',
            description: 'Read all user information'
        },
        {
            object: 'user',
            action: 'write.all',
            description: 'Update any user information'
        },
        {
            object: 'user',
            action: 'delete.all',
            description: 'Delete any user account'
        },
        {
            object: 'user',
            action: 'freeze',
            description: 'Freeze a user account'
        }
    ]
});