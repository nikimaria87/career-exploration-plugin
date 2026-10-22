import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const careerRecords = sqliteTable('career_records', {
  owner: text('owner').notNull(), kind: text('kind').notNull(), id: text('id').notNull(),
  data: text('data').notNull(), revision: integer('revision').notNull().default(1),
  createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
}, t => [primaryKey({columns:[t.owner,t.kind,t.id]}), index('career_owner_kind').on(t.owner,t.kind)]);
