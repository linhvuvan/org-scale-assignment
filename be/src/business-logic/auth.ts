import { User } from "../entities/user";

type CreateUserInput = {
  email: string;
  name: string;
  passwordHash: string;
};

export const createUser = (input: CreateUserInput): User => {
  const { email, name, passwordHash } = input;

  return {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash,
    createdAt: new Date(),
  };
};
