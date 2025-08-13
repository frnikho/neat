import type { AuthContext } from "@entity/auth-context.entity";
import type { UpdateSettings } from "@entity/settings.entity";
import settingsRepo from "@repo/settings.repo";
import { db } from "@service/db.service";
import type { SettingsKey } from "@service/settings.service";
import type { ResultAsync } from "neverthrow";

type Input = {
	key: SettingsKey;
	auth: AuthContext;
	body: UpdateSettings<any>;
};

type Output = {};

export default (input: Input): ResultAsync<Output, Error> => {
	return settingsRepo(db).update("s3", input.body);
};
