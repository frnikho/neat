import {ResultAsync} from "neverthrow";
import {ApiError} from "@core/exceptions";
import {_trace} from "@core/instrumentation";

type Input = {
}

type Output = {

}

const list = (input: Input): ResultAsync<Output, ApiError> => {
}

export default _trace(list, 'app.permission/list-permission');
