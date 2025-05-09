import {UserRoleInterface} from "$permission/domain/interfaces/user-role.interface";
import {db, DbPool, op} from "@core/db";
import {traceRepository} from "@core/instrumentation";
import {user_role} from "$permission/infra/schema/user-role.schema";
import {and, eq} from "drizzle-orm";
import {role} from "$permission/infra/schema/role.schema";
import {mapRole} from "$permission/infra/role.infra";

const userRoleRepo = (client: DbPool = db): UserRoleInterface => ({
  add: (userId, roleId) => {
    return op(client.insert(user_role).values({
      userId,
      roleId
    })).map(() => undefined)
  },

  remove: (userId, roleId) => {
    return op(client.delete(user_role).where(and(eq(user_role.userId, userId), eq(user_role.roleId, roleId))))
      .map(() => undefined)
  },

  list: (userId) => {
    return op(client.select({role})
      .from(user_role)
      .innerJoin(role, eq(user_role.roleId, userId))
      .where(eq(user_role.userId, userId))
    ).map((a) => a.map((row) => mapRole(row.role)))
  }
});

export default traceRepository(userRoleRepo(), {
  add: {
    name: 'repo.user-role/add',
  },
  remove: {
    name: 'repo.user-role/remove',
  },
  list: {
    name: 'repo.user-role/list',
  }
});