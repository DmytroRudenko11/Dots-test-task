import express, { ErrorRequestHandler } from 'express';
import { ERRORS, sendError } from './errors';
import { router } from './routes';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return sendError(res, ERRORS.INVALID_JSON);
  if (err.status && err.status < 500) return res.status(err.status).json({ error: err.message });

  sendError(res, ERRORS.INTERNAL);
};

export const app = express()
  .use(express.json())
  .use(router)
  .use(errorHandler);
