export type Perm = {
    object: string;
    action: string;
    description?: string;
};

// Type utilitaire pour créer la clé permission à partir d'un objet Perm
type PermissionKey<T extends Perm> = `${T['object']}.${T['action']}`;

// Type pour extraire toutes les clés de permission d'un tuple de permissions
type ExtractPermissionKeys<T extends Perm[]> = T extends [infer First, ...infer Rest]
    ? First extends Perm
        ? Rest extends Perm[]
            ? PermissionKey<First> | ExtractPermissionKeys<Rest>
            : PermissionKey<First>
        : never
    : never;

export class PermissionRegistry<TPermissions extends Perm[] = []> {
    permissions: TPermissions;

    constructor(permissions: TPermissions = [] as any) {
        this.permissions = permissions;
    }

    // Méthode pour enregistrer une nouvelle permission
    registerPermission<const T extends Perm>(
        permission: T
    ): PermissionRegistry<[...TPermissions, T]> {
        const newPermissions = [...this.permissions, permission] as const;
        return new PermissionRegistry(newPermissions as [...TPermissions, T]);
    }

    // Méthode pour fusionner avec un autre registry
    merge<const TOtherPermissions extends Perm[]>(
        otherRegistry: PermissionRegistry<TOtherPermissions>
    ): PermissionRegistry<[...TPermissions, ...TOtherPermissions]> {
        const combinedPermissions = [
            ...this.permissions,
            ...otherRegistry.getPermissions()
        ] as const;
        return new PermissionRegistry(combinedPermissions as [...TPermissions, ...TOtherPermissions]);
    }

    // Méthode pour vérifier une permission avec autocomplétion
    checkPermission(
        permissionKey: ExtractPermissionKeys<TPermissions>
    ): boolean {
        const [object, action] = permissionKey.split('.') as [string, string];
        return this.permissions.some(
            perm => perm.object === object && perm.action === action
        );
    }

    // Méthode pour obtenir toutes les permissions
    getPermissions(): TPermissions {
        return this.permissions;
    }

    // Méthode pour obtenir toutes les clés de permissions disponibles
    getAvailablePermissionKeys(): Array<ExtractPermissionKeys<TPermissions>> {
        return this.permissions.map(
            perm => `${perm.object}.${perm.action}` as ExtractPermissionKeys<TPermissions>
        );
    }

    // Méthode pour obtenir une permission par sa clé
    getPermissionByKey(
        permissionKey: ExtractPermissionKeys<TPermissions>
    ): Perm | undefined {
        const [object, action] = permissionKey.split('.') as [string, string];
        return this.permissions.find(
            perm => perm.object === object && perm.action === action
        );
    }

    // Méthode pour obtenir le nombre de permissions
    getPermissionCount(): number {
        return this.permissions.length;
    }

    // Méthode pour vérifier si une permission existe
    hasPermissionKey(
        permissionKey: string
    ): permissionKey is ExtractPermissionKeys<TPermissions> {
        const [object, action] = permissionKey.split('.') as [string, string];
        return this.permissions.some(
            perm => perm.object === object && perm.action === action
        );
    }

    // Méthode pour filtrer les permissions par objet
    getPermissionsByObject(objectName: string): Perm[] {
        return this.permissions.filter(perm => perm.object === objectName);
    }

    // Méthode pour filtrer les permissions par action
    getPermissionsByAction(actionName: string): Perm[] {
        return this.permissions.filter(perm => perm.action === actionName);
    }

    // Méthode helper pour une syntaxe fluide
    with<TResult>(
        fn: (registry: this) => TResult
    ): TResult {
        return fn(this);
    }

    // Méthode pour créer un sous-registry avec certaines permissions
    filterPermissions(
        predicate: (perm: Perm) => boolean
    ): PermissionRegistry<TPermissions[number][]> {
        const filteredPermissions = this.permissions.filter(predicate);
        return new PermissionRegistry(filteredPermissions as TPermissions[number][]);
    }

    // Méthode pour obtenir des statistiques
    getStats() {
        const objectCounts = new Map<string, number>();
        const actionCounts = new Map<string, number>();

        this.permissions.forEach(perm => {
            objectCounts.set(perm.object, (objectCounts.get(perm.object) || 0) + 1);
            actionCounts.set(perm.action, (actionCounts.get(perm.action) || 0) + 1);
        });

        return {
            totalPermissions: this.permissions.length,
            uniqueObjects: objectCounts.size,
            uniqueActions: actionCounts.size,
            objectCounts: Object.fromEntries(objectCounts),
            actionCounts: Object.fromEntries(actionCounts)
        };
    }

    static mergeMultiple<T extends PermissionRegistry<Perm[]>[]>(
        ...registries: T
    ): PermissionRegistry<Perm[]> {
        const allPermissions = registries.flatMap(registry => registry.getPermissions());
        return new PermissionRegistry(allPermissions as Perm[]);
    }

}

// Factory function pour créer un registry vide
export function createPermissionRegistry(): PermissionRegistry<[]> {
    return new PermissionRegistry([] as const);
}

// Factory function pour créer un registry avec des permissions initiales
export function createPermissionRegistryWith<const T extends Perm[]>(
    permissions: T
): PermissionRegistry<T> {
    return new PermissionRegistry(permissions);
}

// =============================================================================
// EXEMPLES D'UTILISATION
// =============================================================================

// Créer un registry et enregistrer des permissions
const userRegistry = createPermissionRegistry()
    .registerPermission({
        name: 'Read user info',
        object: 'user',
        action: 'read',
        description: 'Permet de lire les informations utilisateur'
    })
    .registerPermission({
        name: 'Write user info',
        object: 'user',
        action: 'write',
        description: 'Permet de modifier les informations utilisateur'
    });

const postRegistry = createPermissionRegistry()
    .registerPermission({
        name: 'Delete posts',
        object: 'post',
        action: 'delete',
        description: 'Permet de supprimer des posts'
    })
    .registerPermission({
        name: 'Create posts',
        object: 'post',
        action: 'create',
        description: 'Permet de créer des posts'
    });

// Fusionner plusieurs registries
const combinedRegistry = userRegistry.merge(postRegistry);

// Dans un autre module - utilisation avec autocomplétion
const moduleRegistry = createPermissionRegistry().merge(combinedRegistry);

// Test de l'autocomplétion - ces appels devraient avoir l'autocomplétion
console.log("=== Test d'autocomplétion ===");

// Utilisation directe avec autocomplétion
const hasUserRead = moduleRegistry.checkPermission('user.read');
const hasUserWrite = moduleRegistry.checkPermission('user.write');
const hasPostDelete = moduleRegistry.checkPermission('post.delete');
const hasPostCreate = moduleRegistry.checkPermission('post.create');

// Avec la méthode helper pour une syntaxe plus fluide
const permissions = moduleRegistry.with(registry => ({
    canReadUser: registry.checkPermission('user.read'),
    canWriteUser: registry.checkPermission('user.write'),
    canDeletePost: registry.checkPermission('post.delete'),
    canCreatePost: registry.checkPermission('post.create')
}));

// Créer un registry admin
const adminRegistry = createPermissionRegistry()
    .registerPermission({
        name: 'Admin access',
        object: 'admin',
        action: 'access'
    })
    .registerPermission({
        name: 'Super admin',
        object: 'admin',
        action: 'super'
    });

const corePermissions = [
    {
        object: 'user',
        action: 'read',
        description: 'Read user information'
    },
    {
        object: 'user',
        action: 'write',
        description: 'Write user information'
    },
    {
        object: 'user',
        action: '*',
        description: 'Manage all user-related actions'
    },
] as const satisfies Perm[];

const corePermissionRegistry = createPermissionRegistryWith(corePermissions);

corePermissionRegistry.checkPermission('user.write');

// Registry complet avec toutes les permissions
const fullRegistry = combinedRegistry.merge(adminRegistry);

// Test final - devrait avoir l'autocomplétion pour toutes les permissions
const hasAdminAccess = fullRegistry.checkPermission('admin.access');
const hasSuperAdmin = fullRegistry.checkPermission('admin.super');