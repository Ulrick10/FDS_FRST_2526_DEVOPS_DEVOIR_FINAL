/**
 * Expenses API Routes
 * GET /expenses - List all expenses
 * POST /expenses - Create new expense
 */

const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

/**
 * GET /expenses - Get all expenses as JSON
 */
router.get('/expenses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM expenses
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

/**
 * POST /expenses - Create new expense
 * Expected body: { description, amount, category }
 */
router.post('/expenses', async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    // Validation
    if (!description || !amount || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validCategories = ['Food', 'Transport', 'Entertainment', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Insert expense
    const result = await pool.query(
      `INSERT INTO expenses (description, amount, category, date)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [description, parseFloat(amount), category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

module.exports = router;
