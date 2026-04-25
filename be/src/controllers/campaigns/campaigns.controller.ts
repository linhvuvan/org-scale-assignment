import { Request, Response } from "express";
import { z } from "zod";
import { jwt } from "../../3rd-parties/jwt";
import { AUTH_COOKIE } from "../../config/constants";
import { safeTry } from "../../utils/safeTry";
import { createCampaign } from "../../business-logic/campaigns";
import { getCampaigns, insertCampaign } from "../../db/campaigns";

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
