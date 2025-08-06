import {Elysia} from "elysia";
import userRepo from "@infra/repo/user.repo";
import userRoleRepo from "@infra/repo/user-role.repo";
import {apiError, ApiErrorCode} from "@api/api.exception";
import {verifyToken} from "@service/jwt.service";
import {optionToResult} from "@infra/utils/type.utils";
import {db} from "@service/db.service";

export default new Elysia().derive({as: 'scoped'}, ({cookie}) => {
    const accessToken = cookie.access_token.value;

    if (!accessToken) {
        throw apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !");
    }

    const result = verifyToken(accessToken)
        .andThen(({payload}) => userRepo(db).findUserById(payload.userId))
        .andThen((usr) => optionToResult(usr, apiError(ApiErrorCode.UNAUTHORIZED, "User not logged !")))
        .andThen((user) => {
            return userRoleRepo(db).findRoleAndPermissions(user.id)
                .map((roles) => ({
                    user,
                    roles,
                }));
        })

    return result.match(
        ({user, roles}) => {
            return ({
                auth: {
                    user,
                    roles,
                    accessToken,
                }
            })
        },
        (error) => {
            throw error;
        }
    )
})