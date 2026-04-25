import { Step } from "../utils/pipe";
import { findUserByEmail } from "../db/users";
import { User } from "../entities/user";

export const emailAvailableRequired: Step<{ body: { email: string } }, {}> =
  async (_, res, ctx) => {
    const existing = await findUserByEmail(ctx.body.email);
    if (existing) {
      res.status(409).json({ message: "email already in use" });
      return null;
    }
    return {};
  };

export const userRequired: Step<{ body: { email: string } }, { user: User }> =
  async (_, res, ctx) => {
    const user = await findUserByEmail(ctx.body.email);
    if (!user) {
      res.status(401).json({ message: "invalid credentials" });
      return null;
    }
    return { user };
  };
