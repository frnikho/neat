import { AuthContext } from "@entity/auth-context.entity";
import {ok} from "neverthrow";

type Input = {
    auth: AuthContext;
}

type Output = {

}

export default (input: Input) => {
    /*verifyToken(input.token, false).andThen(({payload}) => {
      payload.
    })*/
    return ok({})
}