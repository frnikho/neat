import userRepo from "@infra/repo/user.repo";
import {db} from "@infra/service/db.service";
import {errAsync, type ResultAsync} from "neverthrow";
import {hasAnyPermission} from "@infra/service/permission.service";
import {AuthContext} from "@entity/auth-context.entity";
import {User} from "@entity/user.entity";
import {UserInterface} from "@interface/user.interface";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";

type Input = {
    auth: AuthContext;
    userId: string;
    body: {
        firstname?: string;
        lastname?: string;
    };
}

type Output = User;

export default ({userId, body, auth}: Input, repo: UserInterface = userRepo(db)) => {
    if (!canUpdateUser(auth, userId)) {
        return errAsync(appException(apiErrorCodeToStatus.FORBIDDEN, "You don't have permission to list users"));
    }
    return repo.update(userId, body);
}

const canUpdateUser = ({user, roles}: AuthContext, userId: string): boolean => {
    const isSelf = user.id === userId;
    const hasAll = hasAnyPermission(roles, ['user.write.all', 'user.*']);
    const hasOwn = hasAnyPermission(roles, ['user.write.own', 'user.*']);
    return (isSelf && hasOwn) || (!isSelf && hasAll);
};