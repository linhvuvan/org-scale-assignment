import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodType, z } from "zod";
import { Step } from "../utils/pipe";

export const bodyRequired =
  <T extends Record<string, unknown>>(
    schema: ZodType<T>,
  ): Step<{}, { body: T }> =>
  async ({ req, res }) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({
          message: "validation error",
          errors: z.flattenError(result.error),
        });
      return null;
    }
    req.body = result.data;
    return { body: result.data };
  };

export const queryRequired =
  <T extends Record<string, unknown>>(
    schema: ZodType<T>,
  ): Step<{}, { query: T }> =>
  async ({ req, res }) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res
        .status(400)
        .json({
          message: "validation error",
          errors: z.flattenError(result.error),
        });
      return null;
    }
    return { query: result.data };
  };
