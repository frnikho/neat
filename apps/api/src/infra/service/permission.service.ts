import type { RoleWithPermissions } from "@entity/role.entity";

const permissions = [
	{
		resource: "user",
		action: "*",
		name: "Manage all user-related actions",
	},
	{
		resource: "user",
		action: "read.own",
		name: "Read own user information",
	},
	{
		resource: "user",
		action: "write.own",
		name: "Update own user information",
	},
	{
		resource: "user",
		action: "delete.own",
		name: "Delete own user account",
	},
	{
		resource: "user",
		action: "read.all",
		name: "Read all user information",
	},
	{
		resource: "user",
		action: "write.all",
		name: "Update any user information",
	},
	{
		resource: "user",
		action: "delete.all",
		name: "Delete any user account",
	},
	{
		resource: "user",
		action: "freeze",
		name: "Freeze a user account",
	},
	{
		resource: "role",
		action: "*",
		name: "Manage all role-related actions",
	},
	{
		resource: "role",
		action: "read.own",
		name: "Read own role information",
	},
	{
		resource: "role",
		action: "write.own",
		name: "Update own role information",
	},
	{
		resource: "role",
		action: "delete.own",
		name: "Delete own role account",
	},
	{
		resource: "role",
		action: "read.all",
		name: "Read all role information",
	},
	{
		resource: "role",
		action: "write.all",
		name: "Update any role information",
	},
	{
		resource: "role",
		action: "delete.all",
		name: "Delete any role account",
	},
	{
		name: "Manage all auth permissions",
		resource: "auth",
		action: "*",
	},
	{
		name: "Get the current user information",
		resource: "auth",
		action: "me",
	},
	{
		name: "Access to the dashboard",
		resource: "dashboard",
		action: "view",
	},
    {
        name: 'Create widget',
        resource: 'widget',
        action: 'create',
    },
    {
        name: 'Read widget',
        resource: 'widget',
        action: 'read',
    },
    {
        name: 'Update widget',
        resource: 'widget',
        action: 'update',
    },
    {
        name: 'Delete widget',
        resource: 'widget',
        action: 'delete',
    },
    {
        name: 'Manage all widget permissions',
        resource: 'widget',
        action: '*',
    },
    {
        name: 'Create page',
        resource: 'page',
        action: 'create',
    },
    {
        name: 'Read page',
        resource: 'page',
        action: 'read',
    },
    {
        name: 'Update page',
        resource: 'page',
        action: 'update',
    },
    {
        name: 'Delete page',
        resource: 'page',
        action: 'delete',
    },
    {
        name: 'Manage all page permissions',
        resource: 'page',
        action: '*',
    },
    {
        name: 'Create Layout',
        resource: 'layout',
        action: 'create',
    },
    {
        name: 'Read Layout',
        resource: 'layout',
        action: 'read',
    },
    {
        name: 'Update Layout',
        resource: 'layout',
        action: 'update',
    },
    {
        name: 'Delete Layout',
        resource: 'layout',
        action: 'delete',
    },
    {
        name: 'Manage all layout permissions',
        resource: 'layout',
        action: '*',
    }
] as const;

type Permission = (typeof permissions)[number];

export type PermissionKeysFromArray<T extends readonly Permission[]> = {
	[K in keyof T]: T[K] extends Permission ? `${T[K]["resource"]}.${T[K]["action"]}` : never;
}[number];

export type AllPermissions = PermissionKeysFromArray<typeof permissions>;

export const getPermission = (key: AllPermissions) => {
	return permissions.find((m) => `${m.resource}.${m.action}` === key);
};

export const getAllPermission = () => {
	return permissions;
};

export const hasPermission = (roles: RoleWithPermissions[], permissionToCheck: AllPermissions) => {
	return roles.some((role) => role.permissions.some((permission) => `${permission.resource}.${permission.action}` === permissionToCheck));
};

export const hasEveryPermission = (roles: RoleWithPermissions[], permissionsToCheck: AllPermissions[]) => {
	return permissionsToCheck.every((permissionToCheck) => hasPermission(roles, permissionToCheck));
};

export const hasAnyPermission = (roles: RoleWithPermissions[], permissionsToCheck: AllPermissions[]) => {
	return permissionsToCheck.some((permissionToCheck) => hasPermission(roles, permissionToCheck));
};
