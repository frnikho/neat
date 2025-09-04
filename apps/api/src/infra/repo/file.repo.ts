import { DbException } from "@infra/exception/db.exception";
import { file, mapFileMetadata, mapFileMetadataOption, mapFilesMetadata } from "@infra/schema/file.schema";
import { op } from "@infra/utils/db.utils";
import { oneOreResultOption, oneOrThrow } from "@infra/utils/type.utils";
import type { FileMetadataInterface, FileObjectInterface } from "@interface/file.interface";
import type { S3Client } from "bun";
import { eq, isNotNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ok } from "neverthrow";

export const fileMetadataRepo = (client: NodePgDatabase): FileMetadataInterface => ({
	create: (data) => {
		return op(
			client
				.insert(file)
				.values({
					...data,
					createdBy: data.createdBy ?? null,
					updatedBy: null,
					deletedBy: null,
				})
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Failed to create file metadata")))
			.map(mapFileMetadata);
	},

	findById: (fileId) => {
		return op(client.select().from(file).where(eq(file.id, fileId)))
			.andThen(oneOreResultOption)
			.map(mapFileMetadataOption);
	},

	findByKey: (key) => {
		return op(client.select().from(file).where(eq(file.key, key)))
			.andThen(oneOreResultOption)
			.map(mapFileMetadataOption);
	},

	findByBucket: (bucket) => {
		return op(client.select().from(file).where(eq(file.bucket, bucket)))
            .map((rows) => ({
                files: mapFilesMetadata(rows),
                total: 0,
            }));
	},

	update: (id, data) => {
		return op(
			client
				.update(file)
				.set({
					...data,
					updatedAt: new Date(),
					updatedBy: data.updatedBy ?? null,
				})
				.where(eq(file.id, id))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Failed to update file metadata")))
			.map(mapFileMetadata);
	},

	delete: (id) => {
		return op(client.delete(file).where(eq(file.id, id)).returning())
			.andThen((r) => oneOrThrow(r, new DbException("Failed to delete file metadata")))
			.map(mapFileMetadata);
	},

	list: (page = 1, limit = 10) => {
		return op(
			client
				.select()
				.from(file)
				.limit(limit)
				.offset(page * limit)
				.where(isNotNull(file.deletedAt)),
		).map((rows) => ({
            files: mapFilesMetadata(rows),
            total: 0,
        }));
	},

	softDelete: (id, deletedBy) => {
		return op(
			client
				.update(file)
				.set({
					deletedAt: new Date(),
					deletedBy: deletedBy ?? null,
				})
				.where(eq(file.id, id))
				.returning(),
		)
			.andThen((r) => oneOrThrow(r, new DbException("Failed to soft delete file metadata")))
			.map(mapFileMetadata);
	},
});

export const fileObjectRepo = (client: S3Client): FileObjectInterface => ({
	save: (file, key, bucket) => {
		return op(client.write(key, file, { bucket })).andThen(() => ok());
	},

	delete: (key, bucket) => {
		return op(client.delete(key, { bucket })).andThen(() => ok());
	},
});
