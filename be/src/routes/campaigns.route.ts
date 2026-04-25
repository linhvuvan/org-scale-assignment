import { Router } from "express";
import {
  createCampaignHandler,
  deleteCampaignHandler,
  getCampaignHandler,
  getCampaignStatsHandler,
  getCampaignsHandler,
  scheduleCampaignHandler,
  sendCampaignHandler,
  updateCampaignHandler,
} from "../controllers/campaigns/campaigns.controller";

export const campaignsRouter = Router();

campaignsRouter.get("/", getCampaignsHandler);
campaignsRouter.post("/", createCampaignHandler);
campaignsRouter.get("/:id", getCampaignHandler);
campaignsRouter.get("/:id/stats", getCampaignStatsHandler);
campaignsRouter.post("/:id/schedule", scheduleCampaignHandler);
campaignsRouter.post("/:id/send", sendCampaignHandler);
campaignsRouter.patch("/:id", updateCampaignHandler);
campaignsRouter.delete("/:id", deleteCampaignHandler);
