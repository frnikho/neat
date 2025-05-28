export type Permission = {
    name: string;
    resource: string;
    action: string;
    description?: string;
    attributes?: object;
};

export const getPermission = <T extends readonly Permission[]>(permissions: T, key: `${T[number]["resource"]}.${T[number]["action"]}`) => {
    return permissions.find(m => `${m.resource}.${m.action}` === key)!;
}

export const getPermissionFromModule = <T extends { permissions: readonly Permission[] }>(module: T, key: `${T['permissions'][number]['resource']}.${T['permissions'][number]['action']}`) => {
    return getPermission(module.permissions, key);
}

export const getAllPermissions = <T extends { permissions?: readonly Permission[] }>(modules: T[]) => {
    return modules.map(m => m.permissions)
        .flat()
        .filter((p) => p !== undefined);
}