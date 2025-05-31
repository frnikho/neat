import {modules} from "@/modules";
import {AuthContext} from "$auth/api/auth.middleware";
import {Permission, PermissionKeysFromArray} from "@neat/core/hybrid";

type AllPermissions = NonNullable<typeof modules[number]['permissions']>[number];

type PermissionKey = `${AllPermissions['resource']}.${AllPermissions['action']}`;

type PermissionExpression = PermissionKey | PermissionKey[]

export function hasPermissionKey(auth: AuthContext, permissionKey: PermissionKey) {
    return true;
}

export function hasAnyPermission(auth: AuthContext, permissions: PermissionKey[]) {
    return permissions.some(permission => hasPermissionKey(auth, permission));
}

export function hasAllPermissions(auth: AuthContext, permissions: PermissionKey[]) {
    return permissions.every(permission => hasPermissionKey(auth, permission));
}

export function hasPermission({ auth }: { auth: AuthContext }, expression: PermissionExpression, mode: 'any' | 'all' = 'any'): boolean {
    if (!Array.isArray(expression)) {
        return hasPermissionKey(auth, expression);
    }

    return mode === 'any'
        ? hasAnyPermission(auth, expression)
        : hasAllPermissions(auth, expression);
}

// Version avec typage automatique basé sur le tableau de permissions passé en paramètre
export const withPermissions = <T extends readonly Permission[]>(
    permissions: T,
    expression: PermissionKeysFromArray<T> | PermissionKeysFromArray<T>[],
    mode: 'any' | 'all' = 'any'
) => {
    // Fonction helper pour vérifier une clé de permission spécifique
    const hasSpecificPermissionKey = (auth: AuthContext, permissionKey: PermissionKeysFromArray<T>): boolean => {
        // Ici vous pouvez implémenter la logique de vérification basée sur le tableau de permissions
        // Pour l'exemple, on retourne true
        return true;
    };

    const hasAnySpecificPermission = (auth: AuthContext, permissionKeys: PermissionKeysFromArray<T>[]): boolean => {
        return permissionKeys.some(permission => hasSpecificPermissionKey(auth, permission));
    };

    const hasAllSpecificPermissions = (auth: AuthContext, permissionKeys: PermissionKeysFromArray<T>[]): boolean => {
        return permissionKeys.every(permission => hasSpecificPermissionKey(auth, permission));
    };

    const hasSpecificPermission = (auth: AuthContext, expr: PermissionKeysFromArray<T> | PermissionKeysFromArray<T>[], checkMode: 'any' | 'all' = 'any'): boolean => {
        if (!Array.isArray(expr)) {
            return hasSpecificPermissionKey(auth, expr);
        }

        return checkMode === 'any'
            ? hasAnySpecificPermission(auth, expr)
            : hasAllSpecificPermissions(auth, expr);
    };

    return {
        beforeHandle: (ctx: {auth: AuthContext}) => {
            if (!hasSpecificPermission(ctx.auth, expression, mode)) {
                return 'Forbidden: Missing required permissions';
            }
        },
    };
};