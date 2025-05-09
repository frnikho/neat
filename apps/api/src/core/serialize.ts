import {Result} from "neverthrow";
import {CacheException} from "@core/exceptions";


export const safeJsonParse = Result.fromThrowable(JSON.parse, () => new CacheException("Invalid JSON"));
