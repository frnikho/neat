import {eq} from "drizzle-orm";
import {inArray} from "drizzle-orm/sql/expressions/conditions";
import {NodePgDatabase} from "drizzle-orm/node-postgres";
import { PermissionInterface } from "@interface/permission.interface";
import {mapPermission, mapPermissionOption, mapPermissions, permission} from "@schema/permission.schema";
import {op} from "@infra/utils/db.utils";
import {oneOreResultOption, oneOrThrow} from "@infra/utils/type.utils";
import {DbException} from "@infra/exception/db.exception";

const permissionRepo = (client: NodePgDatabase): PermissionInterface => ({

    findByIds: (ids) => {
        return op(client.select().from(permission).where(inArray(permission.id, ids)))
            .map(mapPermissions)
    },

    findById: (id) => {
        return op(client.select().from(permission).where(eq(permission.id, id)))
            .andThen(oneOreResultOption)
            .map(mapPermissionOption)
    },

    update: (id, body) => {
        return op(client.update(permission).set({
            name: body.name,
            description: body.description,
            resource: body.resource,
            action: body.action,
            attributes: body.attributes,
            updatedBy: body.updatedBy
        }).where(eq(permission.id, id)).returning())
            .andThen((res) => oneOrThrow(res, new DbException('Permission not found')))
            .map(mapPermission)
    },

    create: (body) => {
        return op(client.insert(permission).values({
            name: body.name,
            description: body.description,
            resource: body.resource,
            action: body.action,
            attributes: body.attributes,
            createdBy: body.createdBy,
            updatedBy: null,
            deletedBy: null,
        }).returning())
            .andThen((res) => oneOrThrow(res, new DbException('Permission not created')))
            .map(mapPermission)
    },

    creates: (bodies) => {
        return op(client.insert(permission).values(bodies.map(body => ({
            name: body.name,
            description: body.description,
            resource: body.resource,
            action: body.action,
            attributes: body.attributes,
            createdBy: body.createdBy,
            updatedBy: null,
            deletedBy: null,
        }))).returning())
            .map(mapPermissions)
    },

    delete: (id) => {
        return op(client.delete(permission).where(eq(permission.id, id)).returning())
            .andThen((res) => oneOrThrow(res, new DbException('Permission not found')))
            .map(() => undefined)
    },

    softDelete: (id, deletedBy) => {
        return op(client.update(permission).set({
            deletedAt: new Date(),
            deletedBy
        }).where(eq(permission.id, id)).returning())
            .andThen((r) => oneOrThrow(r, new DbException('Permission not found')))
            .map(() => undefined)
    },

    findByApiName: (name) => {
        return op(client.select().from(permission).where(eq(permission.name, name)))
            .andThen(oneOreResultOption)
            .map(mapPermissionOption)
    },

    list: (page, limit) => {
        return op(client.select().from(permission).limit(limit).offset((page - 1) * limit))
            .map(mapPermissions)
    }

});

/*
export default (client: NodePgDatabase) => traceRepository(permissionRepo(client), {
    create: {
        name: 'repo.permission/create',
    },
    findById: {
        name: 'repo.permission/findPermissionByName',
    },
    findByApiName: {
        name: 'repo.permission/findPermissionById',
    },
    delete: {
        name: 'repo.permission/delete',
    },
    update: {
        name: 'repo.permission/update',
    },
    list: {
        name: 'repo.permission/list',
    }
})*/
