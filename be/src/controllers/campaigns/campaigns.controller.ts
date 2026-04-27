import { Request, Response } from "express";
import { z } from "zod";
import { pipe } from "../../utils/pipe";
import { bodyRequired, queryRequired } from "../../middleware/validate";
import { v4 as uuidv4 } from "uuid";
import { authRequired } from "../../middleware/auth";
import {
  campaignRequired,
  draftCampaignRequired,
  scheduledCampaignRequired,
} from "../../middleware/campaign";
import { computeCampaignStats } from "../../business-logic/campaigns";
import {
  deleteCampaignById,
  getCampaignStats,
  getCampaigns,
  insertCampaignWithRecipients,
  scheduleCampaignById,
  sendCampaignWithRecipients,
  updateCampaignById,
} from "../../db/campaigns";

const createCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  recipientEmails: z.array(z.string().email()).default([]),
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
      const inserted = await insertCampaignWithRecipients({
        campaign: {
          id: uuidv4(),
          name: ctx.body.name,
          subject: ctx.body.subject,
          body: ctx.body.body,
          status: "draft",
          createdBy: ctx.user.id,
        },
        recipientEmails: ctx.body.recipientEmails,
      });

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

const getCampaignsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const getCampaignsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  await pipe(
    req,
    res,
    authRequired,
    queryRequired(getCampaignsSchema),
    async ({ ctx }) => {
      const { page, limit } = ctx.query;
      const offset = (page - 1) * limit;

      const { data, total } = await getCampaigns({ limit, offset });

      res.status(200).json({ data, total, page, limit });
    },
  );
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
