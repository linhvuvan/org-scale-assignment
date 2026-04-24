import { User } from "../entities/user";

export const createUser = (email: string, name: string): User => ({
  id: crypto.randomUUID(),
  email,
  name,
  createdAt: new Date(),
});
