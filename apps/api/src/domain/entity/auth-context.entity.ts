import {User} from "@entity/user.entity";
import {RoleWithPermissions} from "@entity/role.entity";

export type AuthContext = {
    user: User,
    roles: RoleWithPermissions[],
    accessToken: string,
}