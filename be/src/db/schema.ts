import { pgEnum, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "scheduled", "sent"]);

export const campaignsTable = pgTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: campaignStatusEnum("status").notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  createdBy: text("created_by")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const recipientsTable = pgTable("recipients", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const campaignRecipientStatusEnum = pgEnum("campaign_recipient_status", ["pending", "sent", "failed"]);

export const campaignRecipientsTable = pgTable("campaign_recipients", {
  campaignId: text("campaign_id").notNull().references(() => campaignsTable.id),
  recipientId: text("recipient_id").notNull().references(() => recipientsTable.id),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  openedAt: timestamp("opened_at", { withTimezone: true }),
  status: campaignRecipientStatusEnum("status").notNull().default("pending"),
}, (t) => [primaryKey({ columns: [t.campaignId, t.recipientId] })]);
