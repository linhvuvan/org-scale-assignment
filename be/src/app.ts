import express from "express";
import healthRouter from "./routes/health.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(healthRouter);

export default app;
