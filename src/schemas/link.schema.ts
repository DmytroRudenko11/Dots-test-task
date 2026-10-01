import { z } from 'zod';
import { ERRORS } from '../errors';

export const shortenSchema = z.object(
  {
    url: z.url({
      protocol: /^https?$/,
      error: (issue) =>
        issue.input === undefined ? ERRORS.URL_REQUIRED.message : ERRORS.INVALID_URL.message,
    }),
  },
  { error: ERRORS.INVALID_BODY.message },
);

export type ShortenBody = z.infer<typeof shortenSchema>;
