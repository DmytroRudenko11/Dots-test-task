import { Response } from 'express';

export interface AppError {
  status: number;
  message: string;
}

export const ERRORS = {
  INVALID_BODY: { status: 400, message: 'Request body must be a JSON object' },
  INVALID_JSON: { status: 400, message: 'Request body must be valid JSON' },
  URL_REQUIRED: { status: 400, message: 'Field "url" is required' },
  INVALID_URL: { status: 400, message: 'Field "url" must be a valid http(s) URL' },
  LINK_NOT_FOUND: { status: 404, message: 'Short link not found' },
  CODE_GENERATION_FAILED: { status: 500, message: 'Failed to generate a unique short code' },
  INTERNAL: { status: 500, message: 'Internal server error' },
};

export const sendError = (res: Response, { status, message }: AppError) =>
  res.status(status).json({ error: message });
