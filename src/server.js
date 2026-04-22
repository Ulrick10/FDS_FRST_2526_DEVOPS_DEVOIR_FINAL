//Application développée par Ulrick Wadson BENOIT

/**
 * Server Entry Point
 * Express.js application for Expense Tracker
 * Module 8 - Expense Tracker - Node.js Implementation
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeIfAvailable, ensureDbConnection } = require('./config/database');

// Import routes
const dashboardRoutes = require('./routes/dashboard');
const expensesRoutes = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Non-blocking database initialization (happens in background)
initializeIfAvailable();

// Middleware: Check database connection before API requests
app.use('/api', async (req, res, next) => {
  const dbConnected = await ensureDbConnection();
  if (!dbConnected) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'The database is not connected. Please ensure docker-compose is running or PostgreSQL is accessible.'
    });
  }
  next();
});

// Routes
app.use('/', dashboardRoutes);
app.use('/api', expensesRoutes);

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  const dbConnected = await ensureDbConnection();
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    mode: process.env.NODE_ENV || 'production'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server only if not in test mode
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`✅ Expense Tracker running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⏹️  SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}

module.exports = app;
