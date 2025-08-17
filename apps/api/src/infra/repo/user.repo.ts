import { DbException } from "@infra/exception/db.exception";
import { op } from "@infra/utils/db.utils";
import { oneOreResultOption, oneOrThrow } from "@infra/utils/type.utils";
import type { UserInterface } from "@interface/user.interface";
import { file, mapFileMetadataOption } from "@schema/file.schema";
import { mapUserOption, mapUsersToEntities, mapUserToEntity, user } from "@schema/user.schema";
import {eq, sql} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { inArray } from "drizzle-orm/sql/expressions/conditions";
import { fromNullable, isNone, none, some } from "fp-ts/Option";

export default (db: NodePgDatabase): UserInterface => ({
	findUserById(id) {
		return op(db.select().from(user).where(eq(user.id, id)))
			.andThen(oneOreResultOption)
			.map(mapUserOption);
	},

	findUserByIdWithProfilePicture: (id) => {
		return op(db.select().from(user).where(eq(user.id, id)).leftJoin(file, eq(user.profilePictureFile, file.id)))
			.andThen(oneOreResultOption)
			.map((result) => {
				if (isNone(result)) {
					return none;
				}
				return some([mapUserToEntity(result.value.user), mapFileMetadataOption(fromNullable(result.value.file))]);
			});
	},

	findUserByEmail(email) {
		return op(db.select().from(user).where(eq(user.email, email)))
			.andThen(oneOreResultOption)
			.map(mapUserOption);
	},

	list: (page, limit) => {
		return op(
			db
				.select({
                    user,
                    file,
                    total: sql<number>`count(*) over()`
                })
				.from(user)
				.leftJoin(file, eq(user.profilePictureFile, file.id))
				.limit(limit)
				.offset((page) * limit),
		).map((e) => {
			const users = e.map((row) => {
                return {
                    user: mapUserToEntity(row.user),
                    file: mapFileMetadataOption(fromNullable(row.file))
                }
			});
            return {
                users,
                total: 1
            }
		})
	},

	create(body) {
		return op(
			db
				.insert(user)
				.values({
					firstname: body.firstname,
					lastname: body.lastname,
					password: body.password,
					email: body.email,
					createdBy: body.createdBy,
					profilePictureUpdatedBy: null,
				})
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Failed to create user")))
			.map(mapUserToEntity);
	},

	deletes: (ids) => {
		return op(db.delete(user).where(inArray(user.id, ids)).returning()).map(mapUsersToEntities);
	},

	softDeletes: (ids, deletedBy) => {
		return op(
			db
				.update(user)
				.set({
					deletedAt: new Date(),
					deletedBy,
				})
				.where(inArray(user.id, ids))
				.returning(),
		).map(mapUsersToEntities);
	},

	update: (id, body) => {
		return op(
			db
				.update(user)
				.set({
					firstname: body.firstname,
					lastname: body.lastname,
					email: body.email,
					updatedBy: body.updatedBy,
				})
				.where(eq(user.id, id))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Failed to update user")))
			.map(mapUserToEntity);
	},

	updateProfilePicture: (id, body) => {
		return op(
			db
				.update(user)
				.set({
					profilePictureFile: body.profilePictureFile,
					profilePictureUpdatedBy: body.profilePictureUpdatedBy,
					profilePictureUpdatedAt: new Date(),
				})
				.where(eq(user.id, id))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Failed to update profile picture")))
			.map(mapUserToEntity);
	},

	deleteProfilePicture: (id, deletedBy) => {
		return op(
			db
				.update(user)
				.set({
					profilePictureFile: null,
					profilePictureUpdatedBy: deletedBy,
					profilePictureUpdatedAt: new Date(),
				})
				.where(eq(user.id, id))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Failed to delete profile picture")))
			.map(mapUserToEntity);
	},
});
