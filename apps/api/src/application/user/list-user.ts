import { apiErrorCodeToStatus } from "@api/api.exception";
import { appException } from "@application/app.exception";
import type { AuthContext } from "@entity/auth-context.entity";
import type { Pagination } from "@entity/pagination.entity";
import type { User } from "@entity/user.entity";
import userRepo from "@infra/repo/user.repo";
import { db } from "@infra/service/db.service";
import { buildPublicUrl } from "@infra/service/file.service";
import { hasAnyPermission } from "@infra/service/permission.service";
import type { UserInterface } from "@interface/user.interface";
import { isNone } from "fp-ts/Option";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

type Input = {
	auth: AuthContext;
	pag: Pagination;
};

type Output = {
    users: User[];
    total: number;
};

export default ({ pag, auth }: Input, repo: UserInterface = userRepo(db)): ResultAsync<Output, Error> => {
	if (!hasAnyPermission(auth.roles, ["user.read.all", "user.*"])) {
		return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to list users"));
	}

	return repo.list(pag.page, pag.limit).andThen(({users, total}) => {
		return ResultAsync.combine(
			users.map((user) => {
				if (isNone(user.file)) {
					return okAsync({ user, url: undefined });
				}
				return buildPublicUrl(db, user.file.value, "user").map((url) => ({
					user,
					url,
				}));
			}),
		).map((users) => ({
                total: total,
                users: users.map(({ user, url }) => {

                    return {
                        ...user.user,
                        profilePicture: url,
                    };
                }),
            })
        );
	});
};
