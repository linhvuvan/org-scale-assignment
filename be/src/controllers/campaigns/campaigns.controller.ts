import { Request, Response } from "express";
import { z } from "zod";
import { pipe } from "../../utils/pipe";
import { bodyRequired } from "../../middleware/validate";
import { authRequired } from "../../middleware/auth";
import {
  campaignRequired,
  draftCampaignRequired,
  scheduledCampaignRequired,
} from "../../middleware/campaign";
import { createCampaign, computeCampaignStats } from "../../business-logic/campaigns";
import {
  deleteCampaignById,
  getCampaignStats,
  getCampaigns,
  insertCampaign,
  scheduleCampaignById,
  sendCampaignWithRecipients,
  updateCampaignById,
} from "../../db/campaigns";

const createCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  status: z.enum(["draft", "scheduled", "sent"]).default("draft"),
  scheduledAt: z.iso.datetime().optional(),
});

export const createCampaignHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    bodyRequired(createCampaignSchema),
    async ({ ctx }) => {
      const campaign = createCampaign({
        id: crypto.randomUUID(),
        name: ctx.body.name,
        subject: ctx.body.subject,
        body: ctx.body.body,
        status: ctx.body.status,
        scheduledAt: ctx.body.scheduledAt
          ? new Date(ctx.body.scheduledAt)
          : null,
        createdBy: ctx.user.id,
      });

      const inserted = await insertCampaign(campaign);

      res.status(201).json(inserted);
    },
  );
};

export const getCampaignHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    campaignRequired(req.params.id),
    async ({ ctx }) => {
      const counts = await getCampaignStats(ctx.campaign.id);
      const stats = computeCampaignStats(counts);
      res.json({ ...ctx.campaign, stats });
    },
  );
};

export const getCampaignsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  await pipe(req, res, authRequired, async () => {
    const campaigns = await getCampaigns();
    res.status(200).json(campaigns);
  });
};

const updateCampaignSchema = z.object({
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
    async ({ ctx }) => {
      const updated = await updateCampaignById(ctx.campaign.id, ctx.body);

      res.status(200).json(updated);
    },
  );
};

export const deleteCampaignHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    campaignRequired(req.params.id),
    draftCampaignRequired,
    async ({ ctx }) => {
      await deleteCampaignById(ctx.campaign.id);

      res.status(204).send();
    },
  );
};

const scheduleCampaignSchema = z.object({
  scheduledAt: z.iso.datetime().refine((val) => new Date(val) > new Date(), {
    message: "scheduledAt must be in the future",
  }),
});

export const scheduleCampaignHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    bodyRequired(scheduleCampaignSchema),
    campaignRequired(req.params.id),
    draftCampaignRequired,
    async ({ ctx }) => {
      const updated = await scheduleCampaignById(
        ctx.campaign.id,
        new Date(ctx.body.scheduledAt),
      );

      res.status(200).json(updated);
    },
  );
};

export const sendCampaignHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    campaignRequired(req.params.id),
    scheduledCampaignRequired,
    async ({ ctx }) => {
      const updated = await sendCampaignWithRecipients(ctx.campaign.id);

      res.status(200).json(updated);
    },
  );
};

export const getCampaignStatsHandler = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    campaignRequired(req.params.id),
    async ({ ctx }) => {
      const counts = await getCampaignStats(ctx.campaign.id);
      const stats = computeCampaignStats(counts);
      res.json(stats);
    },
  );
};
