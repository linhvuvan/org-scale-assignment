import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "validation error",
        errors: z.flattenError(result.error),
      });
      return;
    }
    req.body = result.data;
    next();
  };
