import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {WidgetInterface} from "@interface/widget.interface";
import {op} from "@infra/utils/db.utils";
import {mapWidget, widget} from "@schema/widget.schema";
import {oneOrThrow} from "@infra/utils/type.utils";
import {DbException} from "@infra/exception/db.exception";

export default (client: NodePgDatabase): WidgetInterface => ({
    create: (body) => {
        return op(client.insert(widget).values({
            name: body.name,
            value: body.value,
            layout: body.layout,
            createdBy: body.createdBy,
            updatedBy: body.updatedBy
        }).returning())
            .andThen((r) => oneOrThrow(r, new DbException('Widget creation failed')))
            .map(mapWidget)
    },

    delete: async (id) => {

    },

    findById: async (id) => {

    },

    findAll: async (page = 1, limit = 10) => {

    },

    update: async (id, body) => {

    }

})