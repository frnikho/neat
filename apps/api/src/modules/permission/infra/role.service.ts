import permissionRepo from "$permission/infra/repo/permission.repo";
import {err, ok} from "neverthrow";
import {apiError, ApiErrorCode} from "@core/exceptions";
import {DbPool} from "@core/db";
import userRepo from "$user/infra/repo/user.repo";
import {roleResponse} from "$permission/api/role.response";
import roleRepo from "$permission/infra/repo/role.repo";

export const checkPermission = (db: DbPool, perms: string[]) => {
    return permissionRepo(db).findByIds(perms)
        .andThen((permissions) => {
            const foundIds = new Set(permissions.map((p) => p.id));
            const missing = perms!.filter((id) => !foundIds.has(id));
            if (missing.length > 0) {
                return err(apiError(ApiErrorCode.BAD_REQUEST, 'Some permissions not found: ' + missing.join(',')));
            }

            return ok(permissions);
        })
}

export const findRoleAndPermissions = (db: DbPool, userId: string) => {

}