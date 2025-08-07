import {AuthContext} from "@entity/auth-context.entity";
import {fileMetadataRepo, fileObjectRepo} from "@repo/file.repo";
import {db} from "@service/db.service";
import {s3Client} from "@service/file.service";
import {oneOrThrow, optionToResult} from "@infra/utils/type.utils";
import {AppException, appException} from "@application/app.exception";
import {apiErrorCodeToStatus} from "@api/api.exception";
import {err, errAsync, okAsync, ResultAsync} from "neverthrow";
import {Bucket} from "@interface/file.interface";

type Input = {
    id: string;
    auth: AuthContext;
}

export default ({id}: Input) => {
    return fileMetadataRepo(db).findById(id)
        .andThen((r) => optionToResult(r, appException(apiErrorCodeToStatus.BAD_REQUEST, "File not found")))
        .andThen((file) =>
            mapBucketName(file.bucket)
                .andThen((bucket) => fileObjectRepo(s3Client()).delete(file.key, bucket))
        )
}

const mapBucketName = (bucket: string): ResultAsync<Bucket, AppException> => {
    switch (bucket) {
        case 'user':
            return okAsync('user');
        default:
            return errAsync(appException(apiErrorCodeToStatus.BAD_REQUEST, 'Invalid bucket name'));
    }
}