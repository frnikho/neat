import settingsRepo from "@infra/repo/settings.repo";
import {Pagination} from "@entity/pagination.entity";
import {AuthContext} from "@entity/auth-context.entity";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    pag: Pagination;
}

export default ({pag, auth}: Input) => {
    return settingsRepo(db).list(pag.page, pag.limit);
}