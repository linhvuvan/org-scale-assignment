import { Router } from "express";
import {
  createCampaignHandler,
  deleteCampaignHandler,
  getCampaignsHandler,
  scheduleCampaignHandler,
  updateCampaignHandler,
} from "../controllers/campaigns/campaigns.controller";

export const campaignsRouter = Router();

campaignsRouter.get("/", getCampaignsHandler);
campaignsRouter.post("/", createCampaignHandler);
campaignsRouter.post("/:id/schedule", scheduleCampaignHandler);
campaignsRouter.patch("/:id", updateCampaignHandler);
campaignsRouter.delete("/:id", deleteCampaignHandler);
