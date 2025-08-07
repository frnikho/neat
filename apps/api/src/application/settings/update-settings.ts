import {ResultAsync} from "neverthrow";
import settingsRepo from "@repo/settings.repo";
import {db} from "@service/db.service";
import {AuthContext} from "@entity/auth-context.entity";
import {UpdateSettings} from "@entity/settings.entity";
import {SettingsKey} from "@service/settings.service";

type Input = {
    key: SettingsKey;
    auth: AuthContext;
    body: UpdateSettings<any>;
}

type Output = {

}

export default (input: Input): ResultAsync<Output, Error> => {
    return settingsRepo(db).update('s3', input.body);
}