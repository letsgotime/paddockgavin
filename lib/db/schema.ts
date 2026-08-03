import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const emailSubscribers = pgTable("email_subscribers", {
  id:        serial("id").primaryKey(),
  email:     text("email").notNull(),
  source:    text("source").notNull().default("site"),
  ip:        text("ip"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
