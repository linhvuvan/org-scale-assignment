import { eq } from "drizzle-orm";
import { db } from "../3rd-parties/drizzle";
import { campaignRecipientsTable } from "./schema";

export const getCampaignRecipients = async (campaignId: string) =>
  db
    .select()
    .from(campaignRecipientsTable)
    .where(eq(campaignRecipientsTable.campaignId, campaignId));
