import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../../3rd-parties/drizzle";
import {
  campaignRecipientsTable,
  campaignsTable,
  recipientsTable,
  usersTable,
} from "../../db/schema";
import { insertUser } from "../../db/users";
import { insertCampaignWithRecipients } from "../../db/campaigns";
import { CampaignStatus } from "../../entities/campaign";

export const runMigrations = async (): Promise<void> => {
  await migrate(db, { migrationsFolder: "drizzle" });
};

export const truncateTables = async (): Promise<void> => {
  await db.delete(campaignRecipientsTable);
  await db.delete(campaignsTable);
  await db.delete(recipientsTable);
  await db.delete(usersTable);
};

export const seedUser = async () =>
  insertUser({
    id: crypto.randomUUID(),
    email: "test@example.com",
    name: "Test User",
    passwordHash: "irrelevant",
  });

export const seedCampaign = async (
  createdBy: string,
  status: CampaignStatus = "draft",
  recipientEmails: string[] = [],
) =>
  insertCampaignWithRecipients({
    campaign: {
      id: crypto.randomUUID(),
      name: "Test Campaign",
      subject: "Hello",
      body: "Body",
      status,
      createdBy,
    },
    recipientEmails,
  });
