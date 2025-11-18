import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Verbindung zur Azure PostgreSQL-Datenbank aufbauen
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Hilfsfunktion für SQL-Queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('⏱️ SQL Query:', { text, duration, rows: result.rowCount });
  return result;
}

// Test-Connection beim Start
pool.connect()
  .then(() => console.log('✅ Erfolgreich mit Azure PostgreSQL verbunden'))
  .catch((err: unknown) => console.error('❌ Datenbankverbindung fehlgeschlagen:', err));

  