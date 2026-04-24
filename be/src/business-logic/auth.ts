import { NewUser } from "../entities/user";

type CreateUserInput = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
};

export const createUser = (input: CreateUserInput): NewUser => input;
