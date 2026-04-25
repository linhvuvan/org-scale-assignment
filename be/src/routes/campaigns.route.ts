import { Router } from "express";
import {
  createCampaignHandler,
  createCampaignSchema,
  deleteCampaignHandler,
  getCampaignsHandler,
  updateCampaignHandler,
  updateCampaignSchema,
} from "../controllers/campaigns/campaigns.controller";
import { validateBody } from "../middleware/validate";

export const campaignsRouter = Router();

campaignsRouter.get("/", getCampaignsHandler);

campaignsRouter.post(
  "/",
  validateBody(createCampaignSchema),
  createCampaignHandler,
);

campaignsRouter.patch(
  "/:id",
  validateBody(updateCampaignSchema),
  updateCampaignHandler,
);

campaignsRouter.delete("/:id", deleteCampaignHandler);
