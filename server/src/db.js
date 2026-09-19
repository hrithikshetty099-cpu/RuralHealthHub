import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing from the server .env file.');
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('PostgreSQL database connected successfully');
});

export const checkDatabaseConnection = async () => {
  await pool.query('SELECT NOW()');
  console.log('Database connection successful');
};

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err.message);
});

export default pool;
