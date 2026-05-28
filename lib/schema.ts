import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const sessionActionEnum = pgEnum("session_action", [
  "lit",
  "stoked",
  "extinguished",
]);

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  name: text("name"),
  action: sessionActionEnum("action").notNull().default("lit"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type SessionAction = (typeof sessionActionEnum.enumValues)[number];
