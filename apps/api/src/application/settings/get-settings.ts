import type { AuthContext } from "@entity/auth-context.entity";
import settingsRepo from "@infra/repo/settings.repo";
import { db } from "@infra/service/db.service";
import type { SettingsKey, SettingsValue } from "@service/settings.service";
import { okAsync } from "neverthrow";
import { redisClient } from "@service/cache.service";
import { op } from "@infra/utils/db.utils";

type Input = {
	auth: AuthContext;
	key: SettingsKey;
};

const SETTINGS_CACHE_TTL = 60 * 60 * 24; // 24 hours

export default <K extends SettingsKey>({ key, auth }: Input) => {
	const cacheClient = redisClient();
	return op(cacheClient.get(`settings:${key}`)).andThen((res) => {
		if (!res) {
			return settingsRepo(db)
				.find(key)
				.andThen((data) => okAsync(data.value as SettingsValue<K>))
				.andThen((data) => {
					return op(cacheClient.set(`settings:${key}`, JSON.stringify(data), "EX", SETTINGS_CACHE_TTL)).andThen(() => okAsync(data));
				});
		}
		return okAsync(JSON.parse(res) as SettingsValue<K>);
	});
};
