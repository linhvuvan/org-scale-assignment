import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../../entities/user";
import { createUser } from "../../business-logic/auth";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

const users: User[] = [];

export const register = (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "validation error",
      errors: z.flattenError(result.error),
    });

    return;
  }

  const { email, name } = result.data;

  if (users.find((u) => u.email === email)) {
    res.status(409).json({ message: "email already in use" });

    return;
  }

  const user = createUser(email, name);
  users.push(user);

  res.status(201).json(user);
};
