import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pool } from './config/database';

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function applyMigration(name: string, sql: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name        TEXT PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query<{ name: string }>('SELECT name FROM schema_migrations');
  const applied = new Set(rows.map((row) => row.name));
  const files = (await readdir(MIGRATIONS_DIR)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files.filter((file) => !applied.has(file))) {
    await applyMigration(file, await readFile(path.join(MIGRATIONS_DIR, file), 'utf8'));
    console.log(`Applied migration ${file}`);
  }
}

migrate()
  .catch((err) => {
    console.error('Migration failed', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
