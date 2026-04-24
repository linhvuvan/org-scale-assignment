import _bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../config/constants";

export const bcrypt = {
  hashPassword: (password: string): Promise<string> =>
    _bcrypt.hash(password, SALT_ROUNDS),

  verifyPassword: (password: string, hash: string): Promise<boolean> =>
    _bcrypt.compare(password, hash),
};
