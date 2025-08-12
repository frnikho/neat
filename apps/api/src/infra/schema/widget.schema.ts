import type * as entity from '@entity/widget.entity';
import { uid } from '@infra/utils/db.utils';
import { mapOption } from '@infra/utils/type.utils';
import { layout } from '@schema/layout.schema';
import { user } from '@schema/user.schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';
import type { Option } from 'fp-ts/Option';

export const widget = p.pgTable('widget', {
  id: uid().primaryKey(),
  name: p.varchar({ length: 255 }).notNull(),
  value: p.jsonb().default({}).notNull(),
  layout: p
    .varchar()
    .references(() => layout.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  createdBy: p
    .varchar('created_by')
    .references(() => user.id, { onDelete: 'set null' }),
  updatedAt: p.timestamp('updated_at'),
  updatedBy: p
    .varchar('updated_by')
    .references(() => user.id, { onDelete: 'set null' }),
  deletedAt: p.timestamp('deleted_at'),
  deletedBy: p
    .varchar('deleted_by')
    .references(() => user.id, { onDelete: 'set null' }),
});

export type Widget = InferSelectModel<typeof widget>;
export type WidgetCreate = InferInsertModel<typeof widget>;

export const mapWidget = <T = any>(row: Widget): entity.Widget<T> => ({
  ...row,
  value: row.value as T,
  createdBy: row.createdBy ?? undefined,
  updatedAt: row.updatedAt ?? undefined,
  updatedBy: row.updatedBy ?? undefined,
  deletedAt: row.deletedAt ?? undefined,
  deletedBy: row.deletedBy ?? undefined,
});

export const mapWidgetOption = <T = any>(
  row: Option<Widget>
): Option<entity.Widget<T>> => mapOption(row, mapWidget);
