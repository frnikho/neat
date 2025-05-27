import {defineModule} from '@neat/core/server'
import authRoute from "$auth/api/auth.route";

export default defineModule({
    name: 'authentification',
    api_name: 'auth',
    version: '1.0.0',
    api: authRoute,
    permissions: [
        {
            description: 'Get the current user information',
            object: 'auth',
            action: 'me'
        }
    ]
})