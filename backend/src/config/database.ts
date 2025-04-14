import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Environment determination
const isProduction = process.env.NODE_ENV === 'production';

// Configure SSL based on environment
const sslConfig = isProduction
  ? { rejectUnauthorized: true } // More secure for production
  : process.env.DATABASE_URL?.includes('localhost') 
    ? false // No SSL for localhost
    : { rejectUnauthorized: false }; // Less secure for dev/staging

// Database pool sizing
const poolMax = parseInt(process.env.DB_POOL_SIZE || '10', 10);
const idleTimeout = parseInt(process.env.DB_TIMEOUT || '30000', 10);

console.log(`Initializing database connection pool. SSL: ${sslConfig ? 'enabled' : 'disabled'}`);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: poolMax,
  idleTimeoutMillis: idleTimeout,
}); 