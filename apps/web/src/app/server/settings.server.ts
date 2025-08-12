import {createServerFn} from "@tanstack/react-start";
import {apiClient} from "@app/lib/client";
import {getWebRequest} from "@tanstack/start-server-core";
import {CompanySettings} from "@neat/types/settings/company.settings";

export const getCompanySettings = createServerFn().handler(() => {
    const {headers} = getWebRequest();
    return apiClient.settings({key: 'company'}).get({fetch: {headers}}).then(({data, error}) => {
        if (!data) {
            throw error;
        }
        return data as unknown as CompanySettings
        /*return match({data, error})
            .with({data: P.nonNullable, error: P.nullish}, ({data}) => data)
            .otherwise(() => ({}))*/
    })
})