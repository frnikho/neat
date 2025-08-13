import authMiddleware from "@api/middleware/auth.middleware";
import { extractFromQuery, requestModels } from "@api/utils/request";
import { response } from "@api/utils/response";
import createRole from "@application/role/create-role";
import deleteRole from "@application/role/delete-role";
import getRole from "@application/role/get-role";
import listRole from "@application/role/list-role";
import updateRole from "@application/role/update-role";
import { RoleRequest, RoleResponse } from "@neat/types/role";
import { Elysia } from "elysia";

export default new Elysia()
	.model(RoleRequest)
	.model(RoleResponse)
	.model(requestModels)
	.use(authMiddleware)
	.group("/role", (app) =>
		app
			.get(
				"/",
				({ auth, query }) =>
					response(
						listRole({
							auth,
							pag: extractFromQuery(query),
						}),
					),
				{
					query: "pagination",
					response: { 200: "role.response.list" },
					detail: { tags: ["Role"] },
				},
			)
			.post(
				"/",
				({ body, auth }) =>
					response(
						createRole({
							auth,
							body,
						}),
					),
				{
					body: "role.request.create",
					response: "role.response.create",
					detail: { tags: ["Role"] },
				},
			)
			.delete(
				"/:id",
				({ params, auth }) =>
					response(
						deleteRole({
							auth,
							roleId: params.id,
						}),
					),
				{ response: "role.response.delete", detail: { tags: ["Role"] } },
			)
			.get(
				"/:id",
				({ params, auth }) =>
					response(
						getRole({
							auth,
							roleId: params.id,
						}),
					),
				{ response: "role.response.get", detail: { tags: ["Role"] } },
			)
			.patch(
				"/:id",
				({ auth, body, params }) =>
					response(
						updateRole({
							auth,
							body,
							roleId: params.id,
						}),
					),
				{
					body: "role.request.update",
					response: "role.response.update",
					detail: { tags: ["Role"] },
				},
			),
	);
