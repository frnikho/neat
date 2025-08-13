import type { RoleWithPermissions } from "@entity/role.entity";
import type { User } from "@entity/user.entity";

export type AuthContext = {
	user: User;
	roles: RoleWithPermissions[];
	accessToken: string;
};
