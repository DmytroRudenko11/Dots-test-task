import { pool } from '../config/database';

export interface Link {
  code: string;
  url: string;
  visits: number;
}

export async function createLink(code: string, url: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    'INSERT INTO links (code, url) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
    [code, url],
  );
  return rowCount === 1;
}

export async function registerVisit(code: string): Promise<string | undefined> {
  const { rows } = await pool.query<{ url: string }>(
    'UPDATE links SET visits = visits + 1 WHERE code = $1 RETURNING url',
    [code],
  );
  return rows[0]?.url;
}

export async function findLink(code: string): Promise<Link | undefined> {
  const { rows } = await pool.query<Link>(
    'SELECT code, url, visits::int AS visits FROM links WHERE code = $1',
    [code],
  );
  return rows[0];
}
