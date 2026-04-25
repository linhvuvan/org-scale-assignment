import { Request, Response } from "express";

type R = Record<string, unknown>;

export type Step<TIn extends R = R, TOut extends R = R> = (
  req: Request,
  res: Response,
  ctx: TIn,
) => Promise<TOut | null>;

/* guard-only overloads */
export function pipe<O1 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
): Promise<O1 | null>;
export function pipe<O1 extends R, O2 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
): Promise<(O1 & O2) | null>;
export function pipe<O1 extends R, O2 extends R, O3 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
): Promise<(O1 & O2 & O3) | null>;
export function pipe<O1 extends R, O2 extends R, O3 extends R, O4 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
): Promise<(O1 & O2 & O3 & O4) | null>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
): Promise<(O1 & O2 & O3 & O4 & O5) | null>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
): Promise<(O1 & O2 & O3 & O4 & O5 & O6) | null>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
  O7 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  s7: Step<O1 & O2 & O3 & O4 & O5 & O6, O7>,
): Promise<(O1 & O2 & O3 & O4 & O5 & O6 & O7) | null>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
  O7 extends R,
  O8 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  s7: Step<O1 & O2 & O3 & O4 & O5 & O6, O7>,
  s8: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7, O8>,
): Promise<(O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8) | null>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
  O7 extends R,
  O8 extends R,
  O9 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  s7: Step<O1 & O2 & O3 & O4 & O5 & O6, O7>,
  s8: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7, O8>,
  s9: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8, O9>,
): Promise<(O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8 & O9) | null>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
  O7 extends R,
  O8 extends R,
  O9 extends R,
  O10 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  s7: Step<O1 & O2 & O3 & O4 & O5 & O6, O7>,
  s8: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7, O8>,
  s9: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8, O9>,
  s10: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8 & O9, O10>,
): Promise<(O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8 & O9 & O10) | null>;

/* terminal overloads */
export function pipe(
  req: Request,
  res: Response,
  t: (req: Request, res: Response, ctx: Record<string, never>) => Promise<void>,
): Promise<void>;
export function pipe<O1 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  t: (req: Request, res: Response, ctx: O1) => Promise<void>,
): Promise<void>;
export function pipe<O1 extends R, O2 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  t: (req: Request, res: Response, ctx: O1 & O2) => Promise<void>,
): Promise<void>;
export function pipe<O1 extends R, O2 extends R, O3 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  t: (req: Request, res: Response, ctx: O1 & O2 & O3) => Promise<void>,
): Promise<void>;
export function pipe<O1 extends R, O2 extends R, O3 extends R, O4 extends R>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  t: (req: Request, res: Response, ctx: O1 & O2 & O3 & O4) => Promise<void>,
): Promise<void>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  t: (
    req: Request,
    res: Response,
    ctx: O1 & O2 & O3 & O4 & O5,
  ) => Promise<void>,
): Promise<void>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  t: (
    req: Request,
    res: Response,
    ctx: O1 & O2 & O3 & O4 & O5 & O6,
  ) => Promise<void>,
): Promise<void>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
  O7 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  s7: Step<O1 & O2 & O3 & O4 & O5 & O6, O7>,
  t: (
    req: Request,
    res: Response,
    ctx: O1 & O2 & O3 & O4 & O5 & O6 & O7,
  ) => Promise<void>,
): Promise<void>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
  O7 extends R,
  O8 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  s7: Step<O1 & O2 & O3 & O4 & O5 & O6, O7>,
  s8: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7, O8>,
  t: (
    req: Request,
    res: Response,
    ctx: O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8,
  ) => Promise<void>,
): Promise<void>;
export function pipe<
  O1 extends R,
  O2 extends R,
  O3 extends R,
  O4 extends R,
  O5 extends R,
  O6 extends R,
  O7 extends R,
  O8 extends R,
  O9 extends R,
>(
  req: Request,
  res: Response,
  s1: Step<{}, O1>,
  s2: Step<O1, O2>,
  s3: Step<O1 & O2, O3>,
  s4: Step<O1 & O2 & O3, O4>,
  s5: Step<O1 & O2 & O3 & O4, O5>,
  s6: Step<O1 & O2 & O3 & O4 & O5, O6>,
  s7: Step<O1 & O2 & O3 & O4 & O5 & O6, O7>,
  s8: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7, O8>,
  s9: Step<O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8, O9>,
  t: (
    req: Request,
    res: Response,
    ctx: O1 & O2 & O3 & O4 & O5 & O6 & O7 & O8 & O9,
  ) => Promise<void>,
): Promise<void>;

/* implementation */
export async function pipe(
  req: Request,
  res: Response,
  ...steps: Array<
    Step | ((req: Request, res: Response, ctx: any) => Promise<void>)
  >
): Promise<R | null | void> {
  let ctx: R = {};
  for (const step of steps) {
    const result = await step(req, res, ctx);
    if (result === null) return null;
    if (result !== undefined) ctx = { ...ctx, ...(result as R) };
  }
}
