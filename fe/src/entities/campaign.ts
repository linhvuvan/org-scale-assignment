export type CampaignStatus = "draft" | "scheduled" | "sent";

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: CampaignStatus;
  scheduledAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
