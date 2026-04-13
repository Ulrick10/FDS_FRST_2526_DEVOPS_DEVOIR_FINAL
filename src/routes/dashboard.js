/**
 * Dashboard Routes
 * Renders the dashboard page with expense metrics
 */

const express = require('express');
const { pool } = require('../config/database');
const { renderWithLayout } = require('../utils/template');

const router = express.Router();

/**
 * GET / - Dashboard Page
 * Serves the main dashboard HTML with expense summary
 */
router.get('/', async (req, res) => {
  try {
    // Get summary statistics
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_expenses,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount
      FROM expenses
    `);

    const stats = result.rows[0];

    // Get expenses by category
    const categoryResult = await pool.query(`
      SELECT category, COUNT(*) as count, SUM(amount) as total
      FROM expenses
      GROUP BY category
      ORDER BY total DESC
    `);

    const categories = categoryResult.rows;

    // Render template with layout
    const html = await renderWithLayout('dashboard', {
      title: 'Dashboard',
      stats,
      categories
    });

    res.send(html);
  } catch (error) {
    console.error('Dashboard error:', error.message);
    
    // Handle database connection errors gracefully
    const html = await renderWithLayout('database-unavailable', {
      title: 'Database Unavailable',
      error: error.message
    });
    
    res.status(503).send(html);
  }
});

/**
 * GET /expenses - Expenses Management Page
 * Serves the page to manage expenses
 */
router.get('/expenses', async (req, res) => {
  try {
    const html = await renderWithLayout('expenses', {
      title: 'Manage Expenses'
    });
    res.send(html);
  } catch (error) {
    console.error('Expenses page error:', error);
    res.status(500).send('<h1>Error loading expenses page</h1><p>' + error.message + '</p>');
  }
});

module.exports = router;
