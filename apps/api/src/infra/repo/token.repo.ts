import { op } from "@infra/utils/db.utils";
import type { TokenInterface } from "@interface/token.interface";
import type { RedisClient } from "bun";
import { none, some } from "fp-ts/Option";
import { ok } from "neverthrow";

const EXPIRATION_TIME = 60 * 60 * 24 * 7; // 7 days

export default (client: RedisClient): TokenInterface => ({
	insert(key, value, exp = EXPIRATION_TIME) {
		return op(client.set(key, value, "EX", exp)).andThen(() => ok());
	},

	get(key) {
		return op(client.get(key)).andThen((r) => {
			if (r === null) {
				return ok(none);
			}
			return ok(some(r));
		});
	},

	delete(key) {
		return op(client.del(key)).andThen(() => ok());
	},

	deleteAll(key) {
		return op(client.keys(key))
			.andThen((keys) => {
				if (keys.length === 0) {
					return ok();
				}
				return ok(op(Promise.all(keys.map((key) => client.del(key)))));
			})
			.andThen(() => ok());
	},
});
