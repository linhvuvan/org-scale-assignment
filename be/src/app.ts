import express from "express";
import cookieParser from "cookie-parser";
import { healthRouter } from "./routes/health.route";
import { authRouter } from "./routes/auth.route";
import { campaignsRouter } from "./routes/campaigns.route";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(healthRouter);
app.use("/auth", authRouter);
app.use("/campaigns", campaignsRouter);
