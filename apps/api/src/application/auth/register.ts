import { apiErrorCodeToStatus } from "@api/api.exception";
import { appException } from "@application/app.exception";
import type { User } from "@entity/user.entity";
import roleRepo from "@infra/repo/role.repo";
import tokenRepo from "@infra/repo/token.repo";
import userRepo from "@infra/repo/user.repo";
import userRoleRepo from "@infra/repo/user-role.repo";
import { redisClient } from "@infra/service/cache.service";
import { hashPassword } from "@infra/service/hash.service";
import { createToken } from "@infra/service/jwt.service";
import { optionToResult } from "@infra/utils/type.utils";
import type { UserInterface } from "@interface/user.interface";
import { createId } from "@paralleldrive/cuid2";
import { db, opTx } from "@service/db.service";
import { isSome } from "fp-ts/Option";
import { err, ok, ResultAsync } from "neverthrow";

type Input = {
	body: {
		email: string;
		password: string;
		firstname: string;
		lastname: string;
		token: string;
	};
};

type Output = {
	user: User;
	accessToken: string;
	refreshToken: string;
};

export const register = ({ body }: Input): ResultAsync<Output, Error> => {
	const client = redisClient();

	const createdUser = opTx(db, (tx) => {
		return userRepo(tx)
			.findUserByEmail(body.email)
			.andThen((user) => {
				if (isSome(user)) {
					return err(appException(apiErrorCodeToStatus.BAD_REQUEST, "User already exists"));
				}
				return ok();
			})
			.andThen(() =>
				tokenRepo(client)
					.get(body.token)
					.andThen((r) => optionToResult(r, appException(apiErrorCodeToStatus.BAD_REQUEST, "Invalid registration token"))),
			)
			.andThen(() => _createUser(body, userRepo(tx)))
			.andThen((user) => {
				return roleRepo(tx)
					.findDefault()
					.andThen((r) => userRoleRepo(tx).add(user.id, r.id))
					.map(() => user);
			});
	});

	const sessionId = createId();

	return createdUser.andThen((user) => {
		const accessToken = createToken({ sessionId, userId: user.id }, "2h").andThen((session) =>
			tokenRepo(client)
				.insert(`session:${user.id}:${sessionId}`, "active")
				.map(() => session),
		);

		const refreshToken = createToken({ sessionId, userId: user.id }, "30d").andThen((refresh) =>
			tokenRepo(client)
				.insert(`refresh:${sessionId}`, refresh)
				.map(() => refresh),
		);

		return ResultAsync.combine([accessToken, refreshToken]).map(([accessToken, refreshToken]) => ({ accessToken, refreshToken, user }));
	});
};

export type _Input = {
	email: string;
	password: string;
	firstname: string;
	lastname: string;
};

const _createUser = (input: _Input, repo: UserInterface = userRepo(db)) => {
	return hashPassword({ password: input.password }).andThen((hashedPassword) =>
		repo.create({
			email: input.email,
			password: hashedPassword,
			firstname: input.firstname,
			lastname: input.lastname,
		}),
	);
};
