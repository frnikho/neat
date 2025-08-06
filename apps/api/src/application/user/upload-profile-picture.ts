import {fileMetadataRepo, fileObjectRepo} from "@infra/repo/file.repo";
import {buildPublicUrl, s3Client} from "@infra/service/file.service";
import {db} from "@infra/service/db.service";
import {randomUUIDv7} from "bun";
import path from "node:path";
import userRepo from "@infra/repo/user.repo";
import deleteProfilePicture from "@application/user/delete-profile-picture";
import {okAsync} from "neverthrow";
import {AuthContext} from "@entity/auth-context.entity";
import {Bucket} from "@interface/file.interface";
import {optionToResult} from "@infra/utils/type.utils";
import {appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";

type Input = {
    auth: AuthContext;
    file: File;
    userId: string;
}

export default ({file, auth, userId}: Input) => {
    const client = s3Client();
    const key = randomUUIDv7() + path.extname(file.name);
    const bucket: Bucket = 'user';

    const user = userRepo(db).findUserById(userId)
        .andThen((user) => optionToResult(user, appException(apiErrorCodeToStatus.BAD_REQUEST, 'User not found')))
        .andThen((user) => {
            if (user.profilePictureFile) {
                return deleteProfilePicture({auth, userId: user.id})
                    .map(() => user)
            }
            return okAsync(user)
        })

    return user.andThen(() => fileObjectRepo(client).save(file, key, bucket).andThen(() => {
        return fileMetadataRepo(db).create({
            name: file.name,
            size: file.size,
            bucket,
            contentType: file.type,
            isPublic: true,
            createdBy: auth.user.id,
            description: `(${userId}) profile picture`,
            key,
        })
    })).andThen((file) => {
        return userRepo(db).updateProfilePicture(userId, {
            profilePictureFile: file.id,
            profilePictureUpdatedBy: auth.user.id
        })
            .map(() => file);
    })
        .andThen((file) => {
            return buildPublicUrl(db, file, bucket).map((url) => ([file, url]));
        });
};