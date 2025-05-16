import {Elysia} from "elysia";
import authMiddleware, {AuthContext} from "$auth/api/auth.middleware";

const createRole = () => {

}

const deleteRole = (ctx: AuthContext) => {
}

const getRole = () => {

}

const listRole = () => {

}

const updateRole = () => {

}

const listPermission = () => {

}

export default new Elysia()
  .group('/role', (app) =>
    app
      .use(authMiddleware)
      .post('/', createRole)
      .delete('/:id', deleteRole)
      .get('/:id', getRole)
      .get('/', listRole)
      .put('/:id', updateRole)
      .get('/:id/permission', listPermission)
);