import { CampaignStats } from "./campaignStats";

export type CampaignStatus = "draft" | "scheduled" | "sent";

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: CampaignStatus;
  scheduledAt: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CampaignWithStats = Campaign & { stats: CampaignStats };

export type NewCampaign = Omit<Campaign, "createdAt" | "updatedAt">;

export type UpdateCampaign = Partial<Pick<Campaign, "name" | "subject" | "body" | "status">>;
