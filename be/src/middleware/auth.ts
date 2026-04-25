import { Request, Response } from "express";
import { Step } from "../utils/pipe";
import { jwt } from "../3rd-parties/jwt";
import { AUTH_COOKIE } from "../config/constants";

export const authRequired: Step<{}, { user: { id: string; email: string } }> = async (req, res, _ctx) => {
  const token: string | undefined = req.cookies[AUTH_COOKIE];
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return null;
  }
  try {
    const payload = jwt.verifyToken(token);
    return { user: { id: payload.sub, email: payload.email } };
  } catch {
    res.status(401).json({ message: "unauthorized" });
    return null;
  }
};
