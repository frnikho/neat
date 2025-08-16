import createClient from "@neat/api-client";
import { ResultAsync } from "neverthrow";
import {match} from "ts-pattern";

export const apiClient = createClient(process.env.REACT_APP_API_URL || "http://localhost:4000/");

type Error<T> = {
    status: number;
    value: T;
}

export const apiRequest = <T, Z, E>(fn: (data: Z) => Promise<{data: T | null; error: Error<E> | null}>, params: Z, headers?: HeadersInit) => {
    return fn(params).then(({data, error}) => {
        return match({data, error})
            .with({error: {status: 401}}, (res) => {
                return apiClient.auth.session.refresh.post({}, {fetch: headers ? {headers} : {}})
                    .then((r) => fn(params))
                    .catch((c) => res);
            })
            .otherwise((d) => d)
    });
}

export const query = <T>(a: Promise<T>) => {
    return ResultAsync.fromPromise(a, () => {
        return new Error("Failed to fetch data");
    })
}