import { Request, Response } from "express";
import { z } from "zod";
import { jwt } from "../../3rd-parties/jwt";
import { AUTH_COOKIE } from "../../config/constants";
import { safeTry } from "../../utils/safeTry";
import { pipe } from "../../utils/pipe";
import { bodyRequired } from "../../middleware/validate";
import { authRequired } from "../../middleware/auth";
import {
  campaignRequired,
  draftCampaignRequired,
} from "../../middleware/campaign";
import { createCampaign } from "../../business-logic/campaigns";
import {
  deleteCampaignById,
  getCampaignById,
  getCampaigns,
  insertCampaign,
  updateCampaignById,
} from "../../db/campaigns";

export const createCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  status: z.enum(["draft", "scheduled", "sent"]).default("draft"),
  scheduledAt: z.iso.datetime().optional(),
});

export const createCampaignHandler = async (
  req: Request<{}, {}, z.infer<typeof createCampaignSchema>>,
  res: Response,
): Promise<void> => {
  const token: string | undefined = req.cookies[AUTH_COOKIE];
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  const [err, payload] = safeTry(() => jwt.verifyToken(token));
  if (err) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  const user = { id: payload.sub, email: payload.email };
  const { body } = req;
  const campaign = createCampaign({
    id: crypto.randomUUID(),
    name: body.name,
    subject: body.subject,
    body: body.body,
    status: body.status,
    scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
    createdBy: user.id,
  });
  const inserted = await insertCampaign(campaign);
  res.status(201).json(inserted);
};

export const getCampaignsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token: string | undefined = req.cookies[AUTH_COOKIE];
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  const [err] = safeTry(() => jwt.verifyToken(token));
  if (err) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  const campaigns = await getCampaigns();
  res.status(200).json(campaigns);
};

export const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  status: z.enum(["draft", "scheduled", "sent"]).optional(),
});

export const updateCampaignHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    bodyRequired(updateCampaignSchema),
    campaignRequired(req.params.id),
    draftCampaignRequired,
    async (_req, _res, ctx) => {
      const updated = await updateCampaignById(ctx.campaign.id, ctx.body);
      res.status(200).json(updated);
    },
  );
};

export const deleteCampaignHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const token: string | undefined = req.cookies[AUTH_COOKIE];
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  const [err] = safeTry(() => jwt.verifyToken(token));
  if (err) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  const { id } = req.params;
  const campaign = await getCampaignById(id);
  if (!campaign) {
    res.status(404).json({ message: "campaign not found" });
    return;
  }
  if (campaign.status !== "draft") {
    res.status(409).json({ message: "only draft campaigns can be deleted" });
    return;
  }
  await deleteCampaignById(id);
  res.status(204).send();
};
