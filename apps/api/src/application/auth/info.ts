import type { PublicUser } from "@entity/user.entity";
import { okAsync, type ResultAsync } from "neverthrow";
import { RoleWithPermissions } from "@entity/role.entity";
import { AuthContext } from "@entity/auth-context.entity";

type Input = {
	auth: AuthContext;
};

type Output = {
	user: PublicUser;
	roles: RoleWithPermissions[];
};

export default ({ auth }: Input): ResultAsync<Output, Error> => {
	const { user, roles } = auth;
	return okAsync({
		user,
		roles,
	});
};
