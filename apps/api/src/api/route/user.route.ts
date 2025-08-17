import { UserRequestDTO } from "@api/dto/user.dto";
import authMiddleware from "@api/middleware/auth.middleware";
import { extractFromQuery, requestModels } from "@api/utils/request";
import { response } from "@api/utils/response";
import addUserRole from "@application/role/add-user-role";
import listUserRole from "@application/role/list-user-role";
import removeUserRole from "@application/role/remove-user-role";
import deleteProfilePicture from "@application/user/delete-profile-picture";
import deleteUser from "@application/user/delete-user";
import getUser from "@application/user/get-user";
import listUser from "@application/user/list-user";
import updateUser from "@application/user/update-user";
import uploadProfilePicture from "@application/user/upload-profile-picture";
import { UserRequest, UserResponse } from "@neat/types/user";
import { Elysia } from "elysia";

export default new Elysia()
	.model(UserRequestDTO)
	.model(UserRequest)
	.model(UserResponse)
	.model(requestModels)
	.use(authMiddleware)
	.group("/user", (app) =>
		app
			.get("/:userId", ({ auth, params }) => response(getUser({ auth, userId: params.userId })), {
				response: { 200: "user.response.get" },
				detail: { tags: ["User"] },
			})
			.delete(
				"/:userId",
				({ params, auth }) =>
					response(
						deleteUser({
							auth,
							userId: params.userId,
						}),
					),
				{
					response: { 200: "user.response.delete" },
					detail: { tags: ["User"] },
				},
			)
			.patch(
				"/:userId",
				({ params, body, auth }) =>
					response(
						updateUser({
							auth,
							userId: params.userId,
							body,
						}),
					),
				{
					body: "user.request.update",
					response: { 200: "user.response.update" },
					detail: { tags: ["User"] },
				},
			)
			.get(
				"/",
				({ query, auth }) =>
					response(
						listUser({
							pag: extractFromQuery(query),
							auth,
						}),
					),
				{
					response: {200: "user.response.list"},
					query: "pagination",
					detail: { tags: ["User"] },
				},
			),
	)
	.group("/user/:userId/roles", (app) =>
		app
			.get(
				"/",
				({ params, auth }) =>
					response(
						listUserRole({
							auth,
							userId: params.userId,
						}),
					),
				{ tags: ["User", "Role"] },
			)
			.delete(
				"/:roleId",
				({ params, auth }) =>
					response(
						removeUserRole({
							auth,
							userId: params.userId,
							roleId: params.roleId,
						}),
					),
				{ tags: ["User", "Role"] },
			)
			.post(
				"/:roleId",
				({ params, auth }) =>
					addUserRole({
						auth,
						userId: params.userId,
						roleId: params.roleId,
					}),
				{ tags: ["User", "Role"] },
			),
	)
	.group("/user/:userId/profile-picture", (app) =>
		app
			.post("/", ({ body, auth, params }) => response(uploadProfilePicture({ auth, ...body, userId: params.userId })), {
				body: "user.request.profile-picture",
				detail: { tags: ["User"] },
			})
			.get("/", () => {}, { detail: { tags: ["User"] } })
			.delete("/", ({ auth, params }) => response(deleteProfilePicture({ auth, userId: params.userId })), { detail: { tags: ["User"] } }),
	);
