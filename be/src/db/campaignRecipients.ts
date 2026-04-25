import { eq } from "drizzle-orm";
import { db } from "../3rd-parties/drizzle";
import { campaignRecipientsTable } from "./schema";

export const sendCampaignRecipientsByCampaignId = async (campaignId: string): Promise<void> => {
  await db
    .update(campaignRecipientsTable)
    .set({ status: "sent", sentAt: new Date() })
    .where(eq(campaignRecipientsTable.campaignId, campaignId));
};
