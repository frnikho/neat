import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";

const addUserRole = (ctx: AuthContext) => {

}

const removeUserRole = (ctx: AuthContext) => {

}

const listUserRole = (ctx: AuthContext) => {

}

export default new Elysia()
  .group('/users/:userId/roles', (app) =>
    app
      .use(authMiddleware)
      .get('/', listUserRole)
      .delete('/:roleId', removeUserRole)
      .post('/:roleId', addUserRole)
  );