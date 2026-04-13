/**
 * Database Configuration
 * Connects to PostgreSQL using environment variables
 * Module 8 Expense Tracker - Node.js Implementation
 */

require('dotenv').config();
const { Pool } = require('pg');

const dbName = process.env.DB_NAME || 'expense_tracker';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'password';

// Create database if it doesn't exist
const ensureDatabase = async () => {
  try {
    // Connect to default 'postgres' database to create our database
    const adminPool = new Pool({
      host: dbHost,
      port: dbPort,
      database: 'postgres',
      user: dbUser,
      password: dbPassword,
    });

    // Check if database exists
    const result = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      // Database doesn't exist, create it
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`✅ Database '${dbName}' already exists`);
    }

    await adminPool.end();
  } catch (error) {
    console.error('❌ Error ensuring database exists:', error.message);
    throw error;
  }
};

// Create connection pool
const pool = new Pool({
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: dbPassword,
});

// Initialize database schema on first run (non-blocking)
const initializeDatabase = async () => {
  // In test mode, mocking handles initialization
  if (process.env.NODE_ENV === 'test') {
    console.log('✅ Database initialized (mock)');
    return true;
  }

  try {
    // Ensure database exists first
    await ensureDatabase();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('Food', 'Transport', 'Entertainment', 'Other')),
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database schema initialized');

    // Insert sample data if table is empty
    const result = await pool.query('SELECT COUNT(*) FROM expenses');
    if (result.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO expenses (description, amount, category, date)
        VALUES 
          ('Lunch with colleagues', 15.50, 'Food', NOW()),
          ('Metro ticket', 4.00, 'Transport', NOW()),
          ('Movie ticket', 12.00, 'Entertainment', NOW())
      `);
      console.log('✅ Sample data inserted');
    }
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    return false; // Return false instead of throwing
  }
};

/**
 * Initialize database if available (non-blocking)
 * Used at startup to attempt DB initialization without blocking the app
 */
const initializeIfAvailable = async () => {
  try {
    console.log('🔄 Attempting database initialization...');
    const success = await initializeDatabase();
    if (success) {
      console.log('✅ Database ready');
    }
    return success;
  } catch (error) {
    console.warn('⚠️  Database unavailable at startup - running in degraded mode');
    console.warn('💡 Database will initialize when connection is available');
    return false;
  }
};

/**
 * Health check: test if database connection is available
 * Used by middleware to check DB status before API requests
 */
const ensureDbConnection = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Close database pool gracefully
 */
const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  pool,
  initializeDatabase,
  initializeIfAvailable,
  ensureDbConnection,
  ensureDatabase,
  closePool
};
