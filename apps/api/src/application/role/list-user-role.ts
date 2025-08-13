import { apiErrorCodeToStatus } from "@api/api.exception";
import { appException } from "@application/app.exception";
import type { AuthContext } from "@entity/auth-context.entity";
import type { Role } from "@entity/role.entity";
import userRepo from "@infra/repo/user.repo";
import userRoleRepo from "@infra/repo/user-role.repo";
import { db } from "@infra/service/db.service";
import { optionToResult } from "@infra/utils/type.utils";
import type { ResultAsync } from "neverthrow";

type Input = {
	auth: AuthContext;
	userId: string;
};

type Output = Role[];

export default ({ userId }: Input): ResultAsync<Output, Error> => {
	return userRepo(db)
		.findUserById(userId)
		.andThen((u) => optionToResult(u, appException(apiErrorCodeToStatus.BAD_REQUEST, "User not found")))
		.andThen((u) => userRoleRepo(db).list(u.id));
};
