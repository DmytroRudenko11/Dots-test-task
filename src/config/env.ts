import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://shortener:shortener@localhost:5432/shortener',
};
