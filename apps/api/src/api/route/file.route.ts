import {Elysia} from "elysia";
import authMiddleware from "@api/middleware/auth.middleware";
import {fileModels} from "@api/dto/file.dto";
import {extractFromQuery, requestModels} from "@api/utils/request";
import {response} from "@api/utils/response";
import listFile from "@application/file/list-file";
import getFile from "@application/file/get-file";
import deleteFile from "@application/file/delete-file";

export default new Elysia()
    .use(authMiddleware)
    .model(fileModels)
    .model(requestModels)
    .group('/file', (app) =>
        app
            .get('/', ({auth, query}) => response(listFile({auth, pag: extractFromQuery(query)})), {})
            .get('/:id', ({auth, params}) => response(getFile({auth, id: params.id})), {})
            .delete('/:id', ({auth, params}) => response(deleteFile({auth, id: params.id})), {})
    )