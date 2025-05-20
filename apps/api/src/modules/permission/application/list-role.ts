import {ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import {Role} from "$permission/domain/entity/role.entity";
import roleRepo from "$permission/infra/repo/role.repo";
import {Pagination} from "@core/request";
import {handle} from "@core/type";
import {AuthContext} from "$auth/api/auth.middleware";
import {db} from "@core/db";

type Input = {
    auth: AuthContext;
    pag: Pagination;
}

type Output = Role[];

const listRole = ({pag}: Input): ResultAsync<Output, ApiError> => {
    return handle(roleRepo(db).list(pag.page, pag.limit));
}

export default _trace(listRole, 'app.permission/list-role');