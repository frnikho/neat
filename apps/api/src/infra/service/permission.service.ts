import type { RoleWithPermissions } from "@entity/role.entity";
import {AllPermissions} from "@neat/types/permission";

export const hasPermission = (roles: RoleWithPermissions[], permissionToCheck: AllPermissions) => {
	return roles.some((role) => role.permissions.some((permission) => `${permission.resource}.${permission.action}` === permissionToCheck));
};

export const hasEveryPermission = (roles: RoleWithPermissions[], permissionsToCheck: AllPermissions[]) => {
	return permissionsToCheck.every((permissionToCheck) => hasPermission(roles, permissionToCheck));
};

export const hasAnyPermission = (roles: RoleWithPermissions[], permissionsToCheck: AllPermissions[]) => {
	return permissionsToCheck.some((permissionToCheck) => hasPermission(roles, permissionToCheck));
};