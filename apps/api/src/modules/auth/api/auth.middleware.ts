import {Elysia} from "elysia";
import {User} from "$user/domain/entity/user.entity";
import {verifyToken} from "$auth/infra/jwt.service";
import {db} from "@core/db";
import userRepo from "$user/infra/repo/user.repo";
import {optionToResult} from "@core/type";
import {apiError, ApiErrorCode} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import userRoleRepo from "$permission/infra/repo/user-role.repo";
import {RoleWithPermissions} from "$permission/domain/entity/role.entity";

export type AuthContext = {
    user: User,
    roles: RoleWithPermissions,
    accessToken: string,
}

export default new Elysia().derive({as: 'scoped'}, ({headers, cookie}) => {
    const result = _trace(() => {
        const token = cookie['access_token'];

        if (!token.value) {
            throw apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !");
        }

        return verifyToken(token.value)
            .andThen(({payload}) => userRepo(db).findUserById(payload.userId).mapErr(e => e.toApiError()))
            .andThen((usr) => optionToResult(usr, apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !")))
            .andThen((user) => {
              return userRoleRepo(db).findRoleAndPermissions(user.id)
                  .map((roles) => ({
                    user,
                    roles,
                  }));
            })
    }, 'api.auth/auth-middleware');


    return result().match(
        ({user, roles}) => ({
            auth: {
                user,
                roles,
                accessToken: cookie['access_token'].value!,
            }
        }),
        (error) => {
            throw error;
        }
    )

})