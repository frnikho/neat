import {Elysia} from "elysia";
import authMiddleware from "$auth/api/auth.middleware";
import {extractFromQuery} from "@core/request";

const _findById = () => {
  console.log('abc');
}

const list = ({query, params}: {query: Record<any, any>, params: {userId: string}}) => {
  console.log(query);
  const pagination = extractFromQuery(query);
  console.log(pagination);
}

const create = () => {

}

const removeUser = () => {

}

const updateUser = () => {

}

export default new Elysia()
  .group('/users', (app) =>
    app
      .use(authMiddleware)
      .get('/', list)
      .get('/:userId', _findById)
      .post('/', create)
      .delete('/:userId', removeUser)
      .patch('/:userId', updateUser)

);