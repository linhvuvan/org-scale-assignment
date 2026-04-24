import { Request, Response } from "express";
import { z } from "zod";
import { createUser } from "../../business-logic/auth";
import { bcrypt } from "../../3rd-parties/bcrypt";
import { jwt } from "../../3rd-parties/jwt";
import { findUserByEmail, insertUser } from "../../db/users";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "validation error",
      errors: z.flattenError(result.error),
    });

    return;
  }

  const { email, name, password } = result.data;

  const existing = await findUserByEmail(email);

  if (existing) {
    res.status(409).json({ message: "email already in use" });

    return;
  }

  const passwordHash = await bcrypt.hashPassword(password);
  const newUser = createUser({ id: crypto.randomUUID(), email, name, passwordHash });
  const inserted = await insertUser(newUser);

  const { passwordHash: _, ...safeUser } = inserted;
  res.status(201).json(safeUser);
};

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "validation error",
      errors: z.flattenError(result.error),
    });

    return;
  }

  const { email, password } = result.data;

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

  res.status(200).json({ token });
};
