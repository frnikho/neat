import type * as entity from '@entity/settings.entity';
import { uid } from '@infra/utils/db.utils';
import { mapOption } from '@infra/utils/type.utils';
import { user } from '@schema/user.schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  type AnyPgColumn,
  boolean,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import type { Option } from 'fp-ts/Option';

export const settings = pgTable('settings', {
  id: uid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  key: varchar({ length: 255 }).notNull().unique(),
  value: jsonb().notNull(),
  description: varchar({ length: 512 }),
  isSystem: boolean('is_system').default(false).notNull(), // 'true' or 'false'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by').references((): AnyPgColumn => user.id, {
    onDelete: 'set null',
  }),
  updatedAt: timestamp('updated_at'),
  updatedBy: varchar('updated_by').references((): AnyPgColumn => user.id, {
    onDelete: 'set null',
  }),
  deletedAt: timestamp('deleted_at'),
  deletedBy: varchar('deleted_by').references((): AnyPgColumn => user.id, {
    onDelete: 'set null',
  }),
});

export type Settings = InferSelectModel<typeof settings>;
export type CreateSettings = InferInsertModel<typeof settings>;

export const mapSettings = <T>(row: Settings): entity.Settings<T> => {
  return {
    ...row,
    value: row.value as T,
    description: row.description ?? undefined,
    createdBy: row.createdBy ?? undefined,
    updatedAt: row.updatedAt ?? undefined,
    updatedBy: row.updatedBy ?? undefined,
    deletedAt: row.deletedAt ?? undefined,
    deletedBy: row.deletedBy ?? undefined,
  };
};

export const mapSettingsOption = <T>(row: Option<Settings>) =>
  mapOption(row, mapSettings);

export const mapSettingsList = (rows: Settings[]) =>
  rows.map(mapSettings<object>);
