import { RequestHandler } from 'express';
import { ZodType } from 'zod';
import { ERRORS, sendError } from '../errors';

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? ERRORS.INVALID_BODY.message;
      return sendError(res, { status: 400, message });
    }

    req.body = result.data;
    next();
  };
