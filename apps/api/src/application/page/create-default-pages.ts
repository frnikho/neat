import {pageRepo} from "@repo/page.repo";
import {db} from "@service/db.service";
import {defaultPages} from "@service/page.service";
import {ok} from "neverthrow";

export default () => {
    return pageRepo(db)
        .list(0, 20_000)
        .andThen((pages) => {
            const notExistingPages = defaultPages.filter((pageToCreate) => !pages.some((p) => p.slug === pageToCreate.slug));

            if (notExistingPages.length <= 0) {
                return ok([]);
            }

            return pageRepo(db).creates(notExistingPages);
        })
}