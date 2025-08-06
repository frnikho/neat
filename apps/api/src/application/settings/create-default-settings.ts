import {defaultSettings} from "@infra/service/settings.service";
import settingsRepo from "@infra/repo/settings.repo";
import {db} from "@infra/service/db.service";
import {okAsync, ResultAsync} from "neverthrow";

export default () => {
    const repo = settingsRepo(db);

    return repo.list(1, 20000).map((existingSettings) => {
        return defaultSettings.filter((s) => !existingSettings.some((e) => e.key === s.key));
    }).andThen((toCreate) => {
        if (toCreate.length === 0) {
            return okAsync([]);
        }
        return ResultAsync.combine(toCreate.map((s) => repo.create(s)));
    });
};