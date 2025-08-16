import {createServerFn} from "@tanstack/react-start";
import {apiClient} from "@app/lib/client";

export const getAllPageFromServer = createServerFn({ method: "GET" }).handler(() => {
    return apiClient.page.get({query: {page: 0, limit: 20}}).then(({data, error}) => {
        if (data) {
            return data;
        }
        return [];
    })
});