import { Router } from "express";
import { healthCheck } from "../controllers/health/health.controller";

export const healthRouter = Router();

healthRouter.get("/health", healthCheck);
