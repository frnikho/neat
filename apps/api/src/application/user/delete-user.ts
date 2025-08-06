import userRepo from "@infra/repo/user.repo";
import {db} from "@infra/service/db.service";
import {errAsync, type ResultAsync} from "neverthrow";
import {hasAnyPermission} from "@infra/service/permission.service";
import {AuthContext} from "@entity/auth-context.entity";
import {User} from "@entity/user.entity";
import {UserInterface} from "@interface/user.interface";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {oneOrThrow} from "@infra/utils/type.utils";

type Input = {
    auth: AuthContext;
    userId: string;
}

type Output = User;

export default ({userId, auth}: Input, repo: UserInterface = userRepo(db)): ResultAsync<Output, Error> => {

    if (!canDeleteUser(auth, userId)) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to delete users"));
    }

    return repo.softDeletes([userId])
        .andThen((users) => oneOrThrow(users, appException(apiErrorCodeToStatus['BAD_REQUEST'], 'User not found')));

}

const canDeleteUser = ({user, roles}: AuthContext, userId: string): boolean => {
    const isSelf = user.id === userId;
    const hasAll = hasAnyPermission(roles, ['user.delete.all', 'user.*']);
    const hasOwn = hasAnyPermission(roles, ['user.delete.own', 'user.*']);
    return (isSelf && hasOwn) || (!isSelf && hasAll);
};