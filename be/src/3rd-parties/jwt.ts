import _jwt from "jsonwebtoken";
import { env } from "../config/env";

// sub is the standard JWT "subject" claim (RFC 7519)
type TokenPayload = { sub: string; email: string };

export const jwt = {
  signToken: (payload: TokenPayload): string =>
    _jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" }),
};
