import { Request, Response } from "express";
import { z } from "zod";
import { createUser } from "../../business-logic/auth";
import { bcrypt } from "../../3rd-parties/bcrypt";
import { jwt } from "../../3rd-parties/jwt";
import { findUserByEmail, insertUser } from "../../db/users";
import { env } from "../../config/env";
import { AUTH_COOKIE, SESSION_MAX_AGE_MS } from "../../config/constants";

export const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

// Request<RouteParams, ResponseBody, RequestBody>
export const register = async (
  req: Request<{}, {}, z.infer<typeof registerSchema>>,
  res: Response,
) => {
  const { email, name, password } = req.body;

  const existing = await findUserByEmail(email);

  if (existing) {
    res.status(409).json({ message: "email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hashPassword(password);
  const newUser = createUser({
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash,
  });
  const inserted = await insertUser(newUser);

  const { passwordHash: _, ...safeUser } = inserted;
  res.status(201).json(safeUser);
};

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const login = async (
  req: Request<{}, {}, z.infer<typeof loginSchema>>,
  res: Response,
) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    res.status(401).json({ message: "invalid credentials" });
    return;
  }

  const valid = await bcrypt.verifyPassword(password, user.passwordHash);

  if (!valid) {
    res.status(401).json({ message: "invalid credentials" });
    return;
  }

  const token = jwt.signToken({ sub: user.id, email: user.email });

  /*
   * httpOnly: JS cannot read via document.cookie (XSS protection)
   * secure: HTTPS-only in prod; omitted in dev since localhost uses HTTP
   * sameSite lax: sent on same-site requests + top-level navigations, blocked on cross-origin fetch
   */
  res
    .cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS,
    })
    .status(200)
    .json({ message: "ok" });
};
