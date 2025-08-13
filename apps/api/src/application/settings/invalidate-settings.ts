import { AuthContext } from "@entity/auth-context.entity";
import { SettingsKey } from "@service/settings.service";
import { redisClient } from "@service/cache.service";
import { op } from "@infra/utils/db.utils";

type Input = {
	auth: AuthContext;
	key?: SettingsKey;
};

export default ({ key, auth }: Input) => {
	const cacheClient = redisClient();
	if (key) {
		return op(cacheClient.del(`settings:${key}`));
	} else {
		return op(cacheClient.keys("settings:*")).andThen((keys) => op(cacheClient.del(...keys)));
	}
};
