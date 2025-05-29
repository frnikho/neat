export type Permission = {
    name: string;
    resource: string;
    action: string;
    description?: string;
    attributes?: object;
};
export declare const getPermission: <T extends readonly Permission[]>(permissions: T, key: `${T[number]["resource"]}.${T[number]["action"]}`) => Permission;
export declare const getPermissionFromModule: <T extends {
    permissions: readonly Permission[];
}>(module: T, key: `${T["permissions"][number]["resource"]}.${T["permissions"][number]["action"]}`) => Permission;
export declare const getAllPermissions: <T extends {
    permissions?: readonly Permission[];
}>(modules: T[]) => Permission[];
