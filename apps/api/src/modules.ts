import contact from "@modules/contact/server";
import authModule from "$auth/auth.module";
import userModule from "$user/user.module";
import permissionModule from "$permission/permission.module";
import {createPermissionRegistry, createPermissionRegistryWith, Perm, PermissionRegistry} from "packages/core/hybrid";

createPermissionRegistryWith([{
    object: 'a',
    action: 'd',
    description: 'a'
}]).checkPermission('a.d') // GOOD

createPermissionRegistryWith(userModule.permissions).checkPermission('user.*')

type ExtractPermissionKey<T extends readonly { object: string; action: string }[]> =
    T[number] extends { object: infer O; action: infer A }
        ? O extends string
            ? A extends string
                ? `${O}.${A}`
                : never
            : never
        : never;

export const modules = [
    authModule,
    userModule,
    permissionModule,
    contact
];

const allPermissions = modules.map((m) => m.permissions).flat();

console.log(allPermissions);

const checkPermissions = () => {

}

/*let allPermissions = createPermissionRegistry();
const a = modules.map((m) => createPermissionRegistryWith(m.permissions));

const m = a.at(0)!;

const permissionRegistry = modules.map((m) => createPermissionRegistryWith(m.permissions));

const b= createPermissionRegistryWith(r);*/
