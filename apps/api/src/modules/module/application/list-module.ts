import { _trace } from "@core/instrumentation";
import {okAsync, ResultAsync} from "neverthrow";

const listModule = (): ResultAsync<any, any> => {
  return okAsync()
}

export default _trace(listModule, 'app.module/listModule');