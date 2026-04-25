import { desc, eq } from "drizzle-orm";
import { db } from "../3rd-parties/drizzle";
import { campaignsTable } from "./schema";
import { Campaign, NewCampaign } from "../entities/campaign";

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
