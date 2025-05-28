import {defineModule} from '@neat/core/server'
import authRoute from "$auth/api/auth.route";

export default defineModule({
    name: 'authentification',
    api_name: 'auth',
    version: '1.0.0',
    permissions: [
        {
            name: 'Get the current user information',
            resource: 'auth',
            action: 'me'
        }
    ]
})

export const api = authRoute;