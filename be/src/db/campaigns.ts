import { count, desc, eq, inArray, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "../3rd-parties/drizzle";
import {
  campaignRecipientsTable,
  campaignsTable,
  recipientsTable,
} from "./schema";
import { Campaign, NewCampaign, UpdateCampaign } from "../entities/campaign";

export const insertCampaignWithRecipients = async (payload: {
  campaign: NewCampaign;
  recipientEmails: string[];
}): Promise<Campaign> => {
  const { campaign, recipientEmails } = payload;
  return db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(campaignsTable)
      .values(campaign)
      .returning();

    if (recipientEmails.length > 0) {
      const existing = await tx
        .select({ id: recipientsTable.id, email: recipientsTable.email })
        .from(recipientsTable)
        .where(inArray(recipientsTable.email, recipientEmails));

      const existingEmails = new Set(existing.map((r) => r.email));
      const newEmails = recipientEmails.filter((e) => !existingEmails.has(e));

      let allIds = existing.map((r) => r.id);

      if (newEmails.length > 0) {
        const created = await tx
          .insert(recipientsTable)
          .values(
            newEmails.map((email) => ({
              id: uuidv4(),
              email,
              name: email,
            })),
          )
          .returning({ id: recipientsTable.id });
        allIds = [...allIds, ...created.map((r) => r.id)];
      }

      await tx.insert(campaignRecipientsTable).values(
        allIds.map((recipientId) => ({
          campaignId: inserted.id,
          recipientId,
        })),
      );
    }

    return inserted;
  });
};

export const getCampaigns = async (params: {
  limit: number;
  offset: number;
}): Promise<{ data: Campaign[]; total: number }> => {
  const { limit, offset } = params;

  const [{ total }] = await db.select({ total: count() }).from(campaignsTable);

  const data = await db
    .select()
    .from(campaignsTable)
    .orderBy(desc(campaignsTable.createdAt))
    .limit(limit)
    .offset(offset);

  return { data, total };
};

export const getCampaignById = async (
  id: string,
): Promise<Campaign | undefined> => {
  const [campaign] = await db
    .select()
    .from(campaignsTable)
    .where(eq(campaignsTable.id, id));
  return campaign;
};

export const deleteCampaignById = async (id: string): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx
      .delete(campaignRecipientsTable)
      .where(eq(campaignRecipientsTable.campaignId, id));
    await tx.delete(campaignsTable).where(eq(campaignsTable.id, id));
  });
};

export const updateCampaignById = async (
  id: string,
  updates: UpdateCampaign,
): Promise<Campaign> => {
  const [updated] = await db
    .update(campaignsTable)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(campaignsTable.id, id))
    .returning();
  return updated;
};

export const scheduleCampaignById = async (
  id: string,
  scheduledAt: Date,
): Promise<Campaign> => {
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
      sent: count(
        sql`case when ${campaignRecipientsTable.status} = 'sent' then 1 end`,
      ),
      failed: count(
        sql`case when ${campaignRecipientsTable.status} = 'failed' then 1 end`,
      ),
      opened: count(
        sql`case when ${campaignRecipientsTable.openedAt} is not null then 1 end`,
      ),
    })
    .from(campaignRecipientsTable)
    .where(eq(campaignRecipientsTable.campaignId, campaignId));
  return result;
};

export const sendCampaignWithRecipients = async (
  id: string,
): Promise<Campaign> => {
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
