import { CampaignStats } from "../entities/campaignStats";

export const computeCampaignStats = (
  payload: Omit<CampaignStats, "openRate" | "sendRate">,
): CampaignStats => {
  const { total, sent, failed, opened } = payload;

  return {
    total,
    sent,
    failed,
    opened,
    openRate: sent > 0 ? opened / sent : 0,
    sendRate: total > 0 ? sent / total : 0,
  };
};
