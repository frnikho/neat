import {UserContext} from "@app/context/user.context";
import {AllPermissions} from "@neat/types/permission";

type Input = {
    roles: UserContext['roles']
}

export const hasPermissions = ({roles}: Input, ...permissions: AllPermissions[]) => {
    if (!roles || roles.length === 0) {
        return false;
    }

    const rolePermissions = roles.flatMap(role => role.permissions.map(p => `${p.resource}.${p.action}`));
    return permissions.every(permission => rolePermissions.includes(permission));
}