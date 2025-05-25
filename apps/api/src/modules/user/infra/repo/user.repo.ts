import {eq} from "drizzle-orm";
import {DbPool, op} from "@core/db";
import {oneOreResultOption, oneOrThrow} from "@core/type";
import {traceRepository} from "@core/instrumentation";
import {UserInterface} from "$user/domain/interface/user.interface";
import {user} from "$user/infra/schema/user.schema";
import {mapUserOption, mapUser, mapUsers} from "$user/infra/user.infra";
import {inArray} from "drizzle-orm/sql/expressions/conditions";

const userRepository = (db: DbPool): UserInterface => ({

    findUserById(id) {
        return op(db.select().from(user).where(eq(user.id, id)))
            .andThen(oneOreResultOption)
            .map(mapUserOption)
    },

    findUserByEmail(email) {
        return op(db.select().from(user).where(eq(user.email, email)))
            .andThen(oneOreResultOption)
            .map(mapUserOption)
    },

    list: (page, limit) => {
        return op(db.select().from(user).limit(limit).offset((page - 1) * limit))
            .map(mapUsers)
    },

    create(body) {
        return op(db.insert(user).values({
            firstname: body.firstname,
            lastname: body.lastname,
            password: body.password,
            email: body.email,
            createdBy: body.createdBy
        }).returning())
            .andThen(oneOrThrow)
            .map(mapUser)
    },

    deletes: (ids) => {
        return op(db.delete(user).where(inArray(user.id, ids)).returning()).map(mapUsers)
    },

    softDeletes: (ids, deletedBy) => {
        return op(db.update(user).set({
            deletedAt: new Date(),
            deletedBy
        }).where(inArray(user.id, ids)).returning()).map(mapUsers)
    },

    update: (id, body) => {
        return op(db.update(user).set({
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            updatedBy: body.updatedBy
        }).where(eq(user.id, id)).returning())
            .andThen(oneOrThrow)
            .map(mapUser)
    }
})

export default (db: DbPool) => traceRepository(userRepository(db), {
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
    },
    update: {
        name: 'repo.user/update'
    },
    deletes: {
        name: 'repo.user/deletes'
    },
    softDeletes: {
        name: 'repo.user/softDeletes'
    }
})