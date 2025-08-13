import { apiClient } from "@app/lib/client";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/start-server-core";
import { match, P } from "ts-pattern";

export const getAuthUserFromServer = createServerFn({ method: "GET" }).handler(() => {
	const { headers, url } = getWebRequest();
	return apiClient.auth.me
		.get({ fetch: { headers } })
		.then(async ({ data, error }) => {
			return match({ data, error })
				.with({ data: P.nonNullable, error: P.nullish }, ({ data }) => {
					return data;
				})
				.with({ data: P._, error: P._ }, ({ error }) => {
					console.log(error?.value);
					throw new Error(error?.value.message ?? "An error occurred while fetching user data");
				})
				.exhaustive();
		})
		.catch((err) => {
			console.error("Error fetching user data", err);
			throw redirect({ to: "/auth/login" });
		});
});

export const getAuthFromServer = createServerFn({ method: "GET" }).handler(() => {
    const { headers } = getWebRequest();
    return apiClient.auth.me.get({fetch: {headers}}).then(({data}) => data)
});