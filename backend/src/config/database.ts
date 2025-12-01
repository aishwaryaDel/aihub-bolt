import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { logTrace, logMetric, logException } from '../utils/appInsights';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('⏱️  SQL Query:', { text, duration, rows: result.rowCount });
    logMetric('DatabaseQueryDuration', duration, { queryType: text.split(' ')[0] });
    logTrace(`Database query executed: ${text.substring(0, 100)}`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logException(error as Error, { context: 'database.query', query: text.substring(0, 100), duration: duration.toString() });
    throw error;
  }
}

if (supabaseUrl && supabaseKey) {
  console.log('✅ Supabase client initialized');
  logTrace('Supabase client initialized successfully');
} else {
  console.warn('⚠️ Supabase credentials missing');
}

export default pool;
