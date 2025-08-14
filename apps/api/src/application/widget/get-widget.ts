import {AuthContext} from "@entity/auth-context.entity";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    id: string;
}

export default ({id}: Input) => {
    return widgetRepo(db).findById(id);
}