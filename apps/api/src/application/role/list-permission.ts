import type {ResultAsync} from "neverthrow";
import permissionRepo from "@infra/repo/permission.repo";
import {db} from "@infra/service/db.service";
import { Pagination } from "@entity/pagination.entity";
import {Permission} from "@entity/permission.entity";

type Input = {
    pag: Pagination
}

type Output = Permission[];

export default ({pag}: Input): ResultAsync<Output, Error> => {
    return permissionRepo(db).list(pag.page, pag.limit);
}
