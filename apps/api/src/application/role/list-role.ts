import type {ResultAsync} from "neverthrow";
import roleRepo from "@infra/repo/role.repo";
import {db} from "@infra/service/db.service";
import { AuthContext } from "@entity/auth-context.entity";
import { Pagination } from "@entity/pagination.entity";
import {Role} from "@entity/role.entity";

type Input = {
    auth: AuthContext;
    pag: Pagination;
}

type Output = Role[];

export default ({pag}: Input): ResultAsync<Output, Error> => {
    return roleRepo(db).list(pag.page, pag.limit);
}
