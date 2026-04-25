import { Router } from "express";
import {
  createCampaignHandler,
  deleteCampaignHandler,
  getCampaignsHandler,
  updateCampaignHandler,
} from "../controllers/campaigns/campaigns.controller";

export const campaignsRouter = Router();

campaignsRouter.get("/", getCampaignsHandler);
campaignsRouter.post("/", createCampaignHandler);
campaignsRouter.patch("/:id", updateCampaignHandler);
campaignsRouter.delete("/:id", deleteCampaignHandler);
