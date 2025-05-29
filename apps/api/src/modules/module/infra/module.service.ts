import {modules} from "@/modules";
import {db} from "@core/db";
import permissionRepo from "$permission/infra/repo/permission.repo";
import {okAsync} from "neverthrow";
import {Permission, getAllPermissions} from "@neat/core/hybrid";

export const insertModulePermissions = (createdBy: string | null = null) => {
    const repo = permissionRepo(db);

    const modulesPermissions = getAllPermissions(modules);

    return repo.list(1, 100000).andThen((permissions) => {
        const permToCreated = modulesPermissions
            .filter((mp: Permission) => !permissions.find((p) => `${mp.resource}.${mp.action}` === `${p.resource}.${p.action}`))
            .map((p: Permission) => ({
                ...p,
                createdBy,
            }));
        if (permToCreated.length === 0) {
            return okAsync([]);
        }
        return repo.creates(permToCreated);
    });
}