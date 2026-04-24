import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../../entities/user";
import { createUser } from "../../business-logic/auth";
import { bcrypt } from "../../3rd-parties/bcrypt";
import { jwt } from "../../3rd-parties/jwt";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

const users: User[] = [];

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

  if (users.find((u) => u.email === email)) {
    res.status(409).json({ message: "email already in use" });

    return;
  }

  const passwordHash = await bcrypt.hashPassword(password);
  const user = createUser({ email, name, passwordHash });
  users.push(user);

  // TODO: omit passwordHash
  res.status(201).json(user);
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
  const user = users.find((u) => u.email === email);

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
