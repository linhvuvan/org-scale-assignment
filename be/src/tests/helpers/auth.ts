import { jwt } from "../../3rd-parties/jwt";
import { AUTH_COOKIE } from "../../config/constants";

export const makeAuthCookie = (userId: string, email: string): string => {
  const token = jwt.signToken({ sub: userId, email });
  return `${AUTH_COOKIE}=${token}`;
};
