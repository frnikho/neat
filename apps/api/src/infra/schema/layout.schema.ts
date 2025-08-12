import { uid } from '@infra/utils/db.utils';
import { user } from '@schema/user.schema';
import * as p from 'drizzle-orm/pg-core';

export const layout = p.pgTable('layout', {
  id: uid().primaryKey(),
  name: p.varchar({ length: 255 }).notNull(),
  description: p.varchar({ length: 255 }).notNull(),
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
