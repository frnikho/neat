import { Option } from 'fp-ts/Option';
import {ResultAsync} from "neverthrow";
import {CreateUser, PublicUser, UpdateUser, UpdateUserProfilePicture, User} from "@entity/user.entity";
import {DbException} from "@infra/exception/db.exception";
import {FileMetadata} from "@entity/file.entity";

export type UserInterface = {
    create: (body: CreateUser) => ResultAsync<User, DbException>;
    list: (page: number, limit: number) => ResultAsync<[User, Option<FileMetadata>][], DbException>;
    findUserById: (id: string) => ResultAsync<Option<User>, DbException>;
    findUserByIdWithProfilePicture: (id: string) => ResultAsync<Option<[User, Option<FileMetadata>]>, DbException>;
    findUserByEmail: (email: string) => ResultAsync<Option<User>, DbException>;
    deletes: (ids: string[]) => ResultAsync<PublicUser[], DbException>;
    softDeletes: (ids: string[], deletedBy?: string) => ResultAsync<PublicUser[], DbException>;
    update: (id: string, body: UpdateUser) => ResultAsync<PublicUser, DbException>;
    updateProfilePicture: (id: string, body: UpdateUserProfilePicture) => ResultAsync<PublicUser, DbException>;
    deleteProfilePicture: (id: string, deletedBy?: string) => ResultAsync<PublicUser, DbException>;
}