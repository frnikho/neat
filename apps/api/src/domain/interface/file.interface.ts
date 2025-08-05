import type {ResultAsync} from "neverthrow";
import type {Option} from "fp-ts/Option";
import {DbException} from "@infra/exception/db.exception";
import {CreateFileMetadata, FileMetadata, UpdateFileMetadata} from "@entity/file.entity";
import {S3Exception} from "@infra/exception/s3.exception";

type Result<T> = ResultAsync<T, DbException>;

export interface FileMetadataInterface {
    create: (data: CreateFileMetadata) => Result<FileMetadata>;
    findById: (id: string) => Result<Option<FileMetadata>>;
    findByKey: (key: string) => Result<Option<FileMetadata>>;
    findByBucket: (bucket: string) => Result<FileMetadata[]>;
    update: (id: string, data: Partial<UpdateFileMetadata>) => Result<FileMetadata>;
    delete: (id: string) => Result<FileMetadata>;
    softDelete: (id: string, deletedBy?: string) => Result<FileMetadata>;
    list: (page?: number, limit?: number) => Result<FileMetadata[]>;
}

type FileData = string | Bun.ArrayBufferView | ArrayBuffer | SharedArrayBuffer | Request | Response | Bun.BunFile | Bun.S3File | Blob | File;

export type Bucket = 'user';

export interface FileObjectInterface {
    save: (file: FileData, key: string, bucket: Bucket) => ResultAsync<void, S3Exception>;
    delete: (key: string, bucket: Bucket) => ResultAsync<void, S3Exception>;
}