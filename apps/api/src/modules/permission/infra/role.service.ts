import permissionRepo from "$permission/infra/repo/permission.repo";
import {err, ok} from "neverthrow";
import {apiError, ApiErrorCode} from "@core/exceptions";
import {DbPool} from "@core/db";

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