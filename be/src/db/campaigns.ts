import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "../3rd-parties/drizzle";
import { campaignRecipientsTable, campaignsTable } from "./schema";
import { Campaign, NewCampaign, UpdateCampaign } from "../entities/campaign";

export const insertCampaign = async (campaign: NewCampaign): Promise<Campaign> => {
  const [inserted] = await db.insert(campaignsTable).values(campaign).returning();
  return inserted;
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  return db.select().from(campaignsTable).orderBy(desc(campaignsTable.createdAt));
};

export const getCampaignById = async (id: string): Promise<Campaign | undefined> => {
  const [campaign] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, id));
  return campaign;
};

export const deleteCampaignById = async (id: string): Promise<void> => {
  await db.delete(campaignsTable).where(eq(campaignsTable.id, id));
};

export const updateCampaignById = async (id: string, updates: UpdateCampaign): Promise<Campaign> => {
  const [updated] = await db
    .update(campaignsTable)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(campaignsTable.id, id))
    .returning();
  return updated;
};

export const scheduleCampaignById = async (id: string, scheduledAt: Date): Promise<Campaign> => {
  const [updated] = await db
    .update(campaignsTable)
    .set({ status: "scheduled", scheduledAt, updatedAt: new Date() })
    .where(eq(campaignsTable.id, id))
    .returning();
  return updated;
};

export const getCampaignStats = async (campaignId: string) => {
  const [result] = await db
    .select({
      total: count(),
      sent: count(sql`case when ${campaignRecipientsTable.status} = 'sent' then 1 end`),
      failed: count(sql`case when ${campaignRecipientsTable.status} = 'failed' then 1 end`),
      opened: count(sql`case when ${campaignRecipientsTable.openedAt} is not null then 1 end`),
    })
    .from(campaignRecipientsTable)
    .where(eq(campaignRecipientsTable.campaignId, campaignId));
  return result;
};

export const sendCampaignWithRecipients = async (id: string): Promise<Campaign> => {
  return db.transaction(async (tx) => {
    await tx
      .update(campaignRecipientsTable)
      .set({ status: "sent", sentAt: new Date() })
      .where(eq(campaignRecipientsTable.campaignId, id));

    const [updated] = await tx
      .update(campaignsTable)
      .set({ status: "sent", updatedAt: new Date() })
      .where(eq(campaignsTable.id, id))
      .returning();

    return updated;
  });
};
