import {apiClient, apiRequest} from "@app/lib/client";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest, setHeader } from "@tanstack/start-server-core";
import {match, P} from "ts-pattern";
import {hasPermissions} from "@app/lib/permision";

export const getAuth = createServerFn({method: 'GET'}).handler(() => {
    return authFromServer().then((data) => {
        if (!hasPermissions(data, 'dashboard.view')) {
            throw new Error('You do not have permission to view the dashboard');
        }
        return data;
    }).catch((err) => {
        console.error('Error fetching auth data:', err);
        throw redirect({ to: "/auth/login" });
    })
})
export const authFromServer = createServerFn({ method: "GET" }).handler(() => {
    const { headers } = getWebRequest();

    return apiClient.auth.me.get({fetch: {headers}}).then(({data, error}) => {
        return match({data, error})
            .with({error: P.nonNullable}, () => {
                return apiClient.auth.session.refresh.post({}, {fetch: {headers}}).then((refreshData) => {
                    return match(refreshData)
                        .with({data: P.nonNullable}, ({response}) => {
                            return apiClient.auth.me.get({fetch: {headers: {'cookie': response.headers.get('set-cookie') ?? ''}}})
                                .then(({data, response, error}) => {
                                    setHeader('set-cookie', response.headers.get('set-cookie'));
                                    return data!
                                })
                                .catch(() => {
                                    throw new Error('Failed to fetch user data after session refresh');
                                });
                        })
                        .otherwise(() => {
                            throw new Error('Failed to refresh session');
                        });
                }).catch(() => {
                    throw new Error('Failed to refresh session');
                });
            }).otherwise(({data, error}) => {
                return data!;
            });
    });
});

export const getAuthFromServer = createServerFn({ method: "GET" }).handler(() => {
    const { headers } = getWebRequest();
    return apiRequest(apiClient.auth.me.get, {fetch: {headers}}, headers).then(({data}) => data)
});