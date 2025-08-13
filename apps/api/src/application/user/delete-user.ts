import { apiErrorCodeToStatus } from "@api/api.exception";
import { appException } from "@application/app.exception";
import type { AuthContext } from "@entity/auth-context.entity";
import type { User } from "@entity/user.entity";
import userRepo from "@infra/repo/user.repo";
import { db } from "@infra/service/db.service";
import { hasAnyPermission } from "@infra/service/permission.service";
import { oneOrThrow } from "@infra/utils/type.utils";
import type { UserInterface } from "@interface/user.interface";
import { errAsync, type ResultAsync } from "neverthrow";

type Input = {
	auth: AuthContext;
	userId: string;
};

type Output = User;

export default ({ userId, auth }: Input, repo: UserInterface = userRepo(db)): ResultAsync<Output, Error> => {
	if (!canDeleteUser(auth, userId)) {
		return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to delete users"));
	}

	return repo
		.softDeletes([userId])
		.andThen((users) => oneOrThrow(users, appException(apiErrorCodeToStatus["BAD_REQUEST"], "User not found")));
};

const canDeleteUser = ({ user, roles }: AuthContext, userId: string): boolean => {
	const isSelf = user.id === userId;
	const hasAll = hasAnyPermission(roles, ["user.delete.all", "user.*"]);
	const hasOwn = hasAnyPermission(roles, ["user.delete.own", "user.*"]);
	return (isSelf && hasOwn) || (!isSelf && hasAll);
};
