import { Router } from "express";
import {
  createCampaignHandler,
  createCampaignSchema,
} from "../controllers/campaigns/campaigns.controller";
import { validateBody } from "../middleware/validate";

export const campaignsRouter = Router();

campaignsRouter.post(
  "/",
  validateBody(createCampaignSchema),
  createCampaignHandler,
);
