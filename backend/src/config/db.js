require('dotenv').config({ path: '../../.env' });
const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'cms_user',
  password: process.env.DB_PASSWORD || 'cms_pass',
  database: process.env.DB_NAME || 'cms',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Handle pool connection
pool.on('connect', () => {
  console.log('✅ Database pool connected');
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection test failed:', err);
  } else {
    console.log('✅ Database connection test successful');
  }
});

module.exports = pool;
