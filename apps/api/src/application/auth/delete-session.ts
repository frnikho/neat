import type { AuthContext } from "@entity/auth-context.entity";
import tokenService from "@service/token.service";
import {redisClient} from "@service/cache.service";
import tokenRepo from "@repo/token.repo";
import {verifyToken} from "@service/jwt.service";

type Input = {
	auth: AuthContext;
};

export default ({auth}: Input) => {
    const cache = redisClient();

    return verifyToken(auth.accessToken).andThen(({payload}) => {
        return tokenService(cache).invalidateSession(auth.user.id, payload.sessionId)
    })
};
