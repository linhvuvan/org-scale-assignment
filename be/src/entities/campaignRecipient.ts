export type CampaignRecipientStatus = "pending" | "sent" | "failed";

export type CampaignRecipient = {
  campaignId: string;
  recipientId: string;
  sentAt: Date | null;
  openedAt: Date | null;
  status: CampaignRecipientStatus;
};
