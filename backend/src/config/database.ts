import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logTrace, logMetric, logException } from '../utils/appInsights';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
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

pool.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL');
    logTrace('Successfully connected to PostgreSQL');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    logException(err, { context: 'database.connect' });
  });

export default pool;
