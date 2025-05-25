import {UserInterface} from "$user/domain/interface/user.interface";
import userRepo from "$user/infra/repo/user.repo";
import {db} from "@core/db";
import {_trace} from "@core/instrumentation";
import {AuthContext} from "$auth/api/auth.middleware";
import {User} from "$user/domain/entity/user.entity";
import {handle, oneOrThrow} from "@core/type";
import {ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";

type Input = {
    auth: AuthContext;
    userId: string;
}

type Output = User;

const deleteUser = ({auth, userId}: Input, repo: UserInterface = userRepo(db)): ResultAsync<Output, ApiError> => {
    const result = repo.softDeletes([userId])
        .andThen((users) => oneOrThrow(users));
    return handle(result);
}

export default _trace(deleteUser, 'app.user/delete');