import _cors from "cors";
import { env } from "../config/env";

export const cors = _cors({
  origin: env.FRONTEND_ORIGIN,
  credentials: true,
});
