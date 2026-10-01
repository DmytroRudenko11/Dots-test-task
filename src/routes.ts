import { Router } from 'express';
import { redirect, shorten, stats } from './controllers/link.controller';
import { validateBody } from './middlewares/validate';
import { shortenSchema } from './schemas/link.schema';

export const router = Router()
  .post('/shorten', validateBody(shortenSchema), shorten)
  .get('/stats/:code', stats)
  .get('/:code', redirect);
