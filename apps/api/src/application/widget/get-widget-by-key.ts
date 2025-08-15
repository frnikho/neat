import {AuthContext} from "@entity/auth-context.entity";
import widgetRepo from "@repo/widget.repo";
import {db} from "@service/db.service";

type Input = {
    auth: AuthContext;
    key: string;
}

export default ({key}: Input) => {
    return widgetRepo(db).findByKey(key);
}