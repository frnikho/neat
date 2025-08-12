import type {AuthContext} from '@entity/auth-context.entity';
import settingsRepo from '@infra/repo/settings.repo';
import {db} from '@infra/service/db.service';
import type {SettingsKey, SettingsValue} from '@service/settings.service';
import {okAsync} from "neverthrow";

type Input = {
    auth: AuthContext;
    key: SettingsKey;
};

export default <K extends SettingsKey>({key, auth}: Input) => {
    return settingsRepo(db).find(key)
        .andThen((data) => okAsync((data.value as SettingsValue<K>)));
};