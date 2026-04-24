import { Router } from "express";
import {
  register,
  login,
  registerSchema,
  loginSchema,
} from "../controllers/auth/auth.controller";
import { validateBody } from "../middleware/validate";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
