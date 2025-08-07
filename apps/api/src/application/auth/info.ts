import {okAsync, type ResultAsync} from "neverthrow";
import {PublicUser, User} from "@entity/user.entity";

type Input = {
    loggedUser: User,
    accessToken: string,
}

type Output = PublicUser;

export default (input: Input): ResultAsync<Output, Error> => {
    const {loggedUser} = input;
    return okAsync<Output>(loggedUser);
}