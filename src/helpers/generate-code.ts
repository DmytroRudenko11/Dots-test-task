import { randomBytes } from 'node:crypto';

export const generateCode = (): string => randomBytes(4).toString('base64url');
