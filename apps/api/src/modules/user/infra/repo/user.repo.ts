import {eq} from "drizzle-orm";
import {DbPool, op} from "@core/db";
import {oneOreResultOption, oneOrThrow} from "@core/type";
import {traceRepository} from "@core/instrumentation";
import {UserInterface} from "$user/domain/interface/user.interface";
import { user } from "$user/infra/schema/user.schema";
import { mapUserOption, mapUser } from "$user/infra/user.infra";

const userRepository: UserInterface<DbPool> = {

  findUserById(db, id) {
    return op(db.select().from(user).where(eq(user.id, id)))
      .andThen(oneOreResultOption)
      .map(mapUserOption)
  },

  findUserByEmail(db, email) {
    return op(db.select().from(user).where(eq(user.email, email)))
      .andThen(oneOreResultOption)
      .map(mapUserOption)
  },

  create(db, body) {
    return op(db.insert(user).values({
      firstname: body.firstname,
      lastname: body.lastname,
      password: body.password,
      email: body.email,
      createdBy: body.createdBy
    }).returning())
      .andThen(oneOrThrow)
      .map(mapUser)
  }
}

export default traceRepository(userRepository, {
  create: {
    name: 'repo.user/create',
    config: {
      obfuscation: ['password'],
      skipParams: [0],
    }
  },
  findUserByEmail: {
    name: 'repo.user/findUserByEmail',
    config: {
      skipParams: [0],
    }
  },
  findUserById: {
    name: 'repo.user/findUserById',
  }
})