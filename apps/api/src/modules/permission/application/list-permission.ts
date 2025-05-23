import {ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {_trace} from "@core/instrumentation";
import permissionRepo from "$permission/infra/repo/permission.repo";
import {Pagination} from "@core/request";
import {Permission} from "$permission/domain/entity/permission.entity";
import {handle} from "@core/type";
import {db} from "@core/db";

type Input = {
    pag: Pagination
}

type Output = Permission[];

const list = ({pag}: Input): ResultAsync<Output, ApiError> => {
    return handle(permissionRepo(db).list(pag.page, pag.limit));
}

export default _trace(list, 'app.permission/list-permission');
