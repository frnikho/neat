import {type ResultAsync} from "neverthrow";
import userRepo from "@infra/repo/user.repo";
import { db } from "@infra/service/db.service";
import userRoleRepo from "@infra/repo/user-role.repo";
import { AuthContext } from "@entity/auth-context.entity";
import {Role} from "@entity/role.entity";
import {optionToResult} from "@infra/utils/type.utils";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {appException} from "@application/app.exception";

type Input = {
    auth: AuthContext;
    userId: string;
}

type Output = Role[];

export default ({userId}: Input): ResultAsync<Output, Error> => {
    return userRepo(db).findUserById(userId)
        .andThen((u) => optionToResult(u, appException(apiErrorCodeToStatus.BAD_REQUEST, 'User not found')))
        .andThen((u) => userRoleRepo(db).list(u.id));
}