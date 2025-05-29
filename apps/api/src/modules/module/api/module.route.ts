import {Elysia} from "elysia";
import authMiddleware from "$auth/api/auth.middleware";
import {response} from "@core/response";
import listModule from "$module/application/list-module";


const _findById = () => {

}

const _list = () => {
  /*response(listModule(), (result) => ({

  }))*/
}

const _reload = () => {

}

export default new Elysia()
  .group('/module', (app) =>
    app
      .use(authMiddleware)
      .get('/', _list)
      .get('/:api', _findById)
      .post('/:api/reload', _reload)
  );