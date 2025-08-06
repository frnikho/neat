import settingsRepo from "@infra/repo/settings.repo";
import {db} from "@infra/service/db.service";
import type {AuthContext} from "@api/middleware/auth.middleware";
import {SettingsKey} from "@service/settings.service";

type Input = {
    auth: AuthContext;
    key: SettingsKey;
}

export default ({key, auth}: Input) => {
    return settingsRepo(db).find(key);
}