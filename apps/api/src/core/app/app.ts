type Module = {
    permissions?: Perm[];
}

function defineModule<const T extends readonly Perm[]>(module: { permissions?: T }) {
    return module;
}

const getModulePermissions = <const T extends readonly Perm[]>(perm: T) => {
    return createPermissionRegistryWith(perm);
}

const moduleC = defineModule({
    permissions: [{
        name: 'product.create',
        object: 'product',
        action: 'create',
        description: 'Create product',
    }, {
        name: 'product.delete',
        object: 'product',
        action: 'delete',
        description: 'Delete product',
    }]
});

const registryC = getModulePermissions(moduleC.permissions!);
