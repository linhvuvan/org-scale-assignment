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

export type NewCampaign = Omit<Campaign, "createdAt" | "updatedAt">;
