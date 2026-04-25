import { Step } from "../utils/pipe";
import { getCampaignById } from "../db/campaigns";
import { Campaign } from "../entities/campaign";

export const campaignRequired = (id: string): Step<{}, { campaign: Campaign }> =>
  async ({ res }) => {
    const campaign = await getCampaignById(id);
    if (!campaign) {
      res.status(404).json({ message: "campaign not found" });
      return null;
    }
    return { campaign };
  };

export const draftCampaignRequired: Step<{ campaign: Campaign }, {}> = async ({ res, ctx }) => {
  if (ctx.campaign.status !== "draft") {
    res.status(409).json({ message: "only draft campaigns can be updated" });
    return null;
  }
  return {};
};
