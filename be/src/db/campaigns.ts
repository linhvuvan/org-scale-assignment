import { db } from "../3rd-parties/drizzle";
import { campaignsTable } from "./schema";
import { Campaign, NewCampaign } from "../entities/campaign";

export const insertCampaign = async (campaign: NewCampaign): Promise<Campaign> => {
  const [inserted] = await db.insert(campaignsTable).values(campaign).returning();
  return inserted;
};
