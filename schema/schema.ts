import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import * as drizzle from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";

// 유저 테이블
export const users = drizzle.mysqlTable("users", {
  id: drizzle
    .varchar({ length: 48 })
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  nickname: drizzle.varchar({ length: 30 }).notNull().unique(),
  email: drizzle.varchar({ length: 100 }).notNull().unique(),
  loginId: drizzle.varchar({ length: 40 }).notNull().unique(),
  password: drizzle.varchar({ length: 255 }).notNull(),
  createdAt: drizzle
    .timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: drizzle.timestamp("updated_at").notNull().defaultNow(),
  deletedAt: drizzle.tinyint({ unsigned: true }).default(0),
});

// users 와 file_info one to many 관계 설정
export const usersRelation = relations(users, ({ many }) => ({
  fileInfo: many(fileInfo),
}));

// 파일에 대한 정보 저장 테이블
export const fileInfo = drizzle.mysqlTable("file_info", {
  id: drizzle
    .varchar({ length: 48 })
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  fileName: drizzle.varchar("file_name", { length: 255 }).notNull(),
  extension: drizzle.varchar({ length: 10 }).notNull(),
  path: drizzle.varchar({ length: 100 }).default("/").notNull(),
  imageType: drizzle
    .mysqlEnum("image_type", ["image", "document", "video", "other", "folder"])
    .notNull(),
  size: drizzle.bigint({ mode: "bigint" }),
  createdAt: drizzle
    .timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: drizzle.timestamp("updated_at").notNull().defaultNow(),
  userId: drizzle.varchar({ length: 48 }).notNull(),
});

// file_info 와 users one to many 관계 설정
export const fileInfoRelation = relations(fileInfo, ({ one }) => ({
  users: one(users, {
    fields: [fileInfo.userId],
    references: [users.id],
  }),
  fileContent: one(fileContent, {
    fields: [fileInfo.id],
    references: [fileContent.id],
  }),
}));

// 파일 저장 테이블
export const fileContent = drizzle.mysqlTable("file_content", {
  id: drizzle.varchar({ length: 48 }).unique().notNull(),
  buffer: drizzle.longtext().notNull(),
});

// file_info 와 file_content one to one 관계 설정
export const fileContentRelation = relations(fileContent, ({ one }) => ({
  fileInfo: one(fileInfo, {
    fields: [fileContent.id],
    references: [fileInfo.id],
  }),
}));
