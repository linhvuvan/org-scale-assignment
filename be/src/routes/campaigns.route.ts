import { Router } from "express";
import {
  createCampaignHandler,
  createCampaignSchema,
  getCampaignsHandler,
} from "../controllers/campaigns/campaigns.controller";
import { validateBody } from "../middleware/validate";

export const campaignsRouter = Router();

campaignsRouter.get("/", getCampaignsHandler);

campaignsRouter.post(
  "/",
  validateBody(createCampaignSchema),
  createCampaignHandler,
);
