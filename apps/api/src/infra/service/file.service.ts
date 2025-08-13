import type { FileMetadata } from "@entity/file.entity";
import settingsRepo from "@infra/repo/settings.repo";
import type { SettingsKey, SettingsValue } from "@infra/service/settings.service";
import { S3Client } from "bun";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export const s3Client = () =>
	new S3Client({
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY,
		region: process.env.S3_REGION,
		endpoint: process.env.S3_ENDPOINT,
	});

export const buildPublicUrl = <K extends SettingsKey>(db: NodePgDatabase, metadata: FileMetadata, key: string) => {
	return settingsRepo(db)
		.find("s3")
		.map((settings) => {
			return `${(settings.value as any)[key].endpoint}/${metadata.key}`;
		});
};
