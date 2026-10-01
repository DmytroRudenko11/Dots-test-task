import { Request, Response } from 'express';
import { ERRORS, sendError } from '../errors';
import { generateCode } from '../helpers/generate-code';
import { createLink, findLink, registerVisit } from '../models/link.model';
import { ShortenBody } from '../schemas/link.schema';

const MAX_CODE_ATTEMPTS = 5;

async function createUniqueLink(url: string): Promise<string | undefined> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const code = generateCode();
    if (await createLink(code, url)) return code;
  }
}

export async function shorten(req: Request<{}, unknown, ShortenBody>, res: Response) {
  const code = await createUniqueLink(req.body.url);
  if (!code) return sendError(res, ERRORS.CODE_GENERATION_FAILED);

  res.status(201).json({ code });
}

export async function redirect(req: Request<{ code: string }>, res: Response) {
  const url = await registerVisit(req.params.code);
  if (!url) return sendError(res, ERRORS.LINK_NOT_FOUND);

  res.redirect(302, url);
}

export async function stats(req: Request<{ code: string }>, res: Response) {
  const link = await findLink(req.params.code);
  if (!link) return sendError(res, ERRORS.LINK_NOT_FOUND);

  res.json(link);
}
