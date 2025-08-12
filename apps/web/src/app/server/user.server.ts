import {apiClient} from '@app/lib/client';
import {redirect} from '@tanstack/react-router';
import {createServerFn} from '@tanstack/react-start';
import {getWebRequest} from '@tanstack/start-server-core';
import {match, P} from 'ts-pattern';

export const getAuthUserFromServer = createServerFn({method: 'GET'}).handler(() => {
        const {headers, url} = getWebRequest();
        return apiClient.auth.me
            .get({fetch: {headers}})
            .then(async ({data, error}) => {
                return match({data, error})
                    .with({data: P.nonNullable, error: P.nullish}, ({data}) => {
                        return data;
                    })
                    .with({data: P._, error: P._}, () => {
                        throw redirect({to: '/auth/login', search: {redirect: url}})
                    })
                    .exhaustive();
            })
            .catch((err) => {
                console.error('Error fetching user data', err);
                throw redirect({to: '/auth/login'});
            });
    }
);
