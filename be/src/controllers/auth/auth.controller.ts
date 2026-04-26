import { Request, Response } from "express";
import { z } from "zod";
import { bcrypt } from "../../3rd-parties/bcrypt";
import { jwt } from "../../3rd-parties/jwt";
import { insertUser } from "../../db/users";
import { env } from "../../config/env";
import { AUTH_COOKIE, SESSION_MAX_AGE_MS } from "../../config/constants";
import { pipe } from "../../utils/pipe";
import { bodyRequired } from "../../middleware/validate";
import {
  emailAvailableRequired,
  userRequired,
  passwordRequired,
} from "../../middleware/user";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export const register = async (req: Request, res: Response) => {
  await pipe(
    req,
    res,
    bodyRequired(registerSchema),
    emailAvailableRequired,
    async ({ ctx }) => {
      const passwordHash = await bcrypt.hashPassword(ctx.body.password);
      const inserted = await insertUser({
        id: crypto.randomUUID(),
        email: ctx.body.email,
        name: ctx.body.name,
        passwordHash,
      });

      const { passwordHash: _pw, ...safeUser } = inserted;

      res.status(201).json(safeUser);
    },
  );
};

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE).status(200).json({ message: "ok" });
};

export const login = async (req: Request, res: Response) => {
  await pipe(
    req,
    res,
    bodyRequired(loginSchema),
    userRequired,
    passwordRequired,
    async ({ ctx }) => {
      const token = jwt.signToken({ sub: ctx.user.id, email: ctx.user.email });
      res
        .cookie(AUTH_COOKIE, token, {
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: SESSION_MAX_AGE_MS,
        })
        .status(200)
        .json({ message: "ok" });
    },
  );
};
