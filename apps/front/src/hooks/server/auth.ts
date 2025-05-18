import {resultify} from "@/lib/exception";
import {client} from "@/lib/client";

export const getAuthUser = async (accessToken: string) => {
    const {result, error, ok} = await resultify(() => client.auth.me.get({
        headers: {
            'Cookie': 'access_token=' + accessToken,
        }
    }));

    if (!ok || result.data === null) {
        return null;
    }
    return result.data;
}