import {useQuery} from "@tanstack/react-query";
import {client} from "@lib/client";

export const useAuth = () => ({
    login: (body: {email: string, password: string}) => {
        return useQuery({queryKey: ['login'], queryFn: () => client.auth.login.post(body)})
    }
})