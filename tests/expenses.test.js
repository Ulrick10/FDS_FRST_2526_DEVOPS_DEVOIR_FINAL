/**
 * Expenses API Routes Tests
 * Tests for GET /api/expenses and POST /api/expenses
 */

const request = require('supertest');
const app = require('../src/server');

describe('GET /api/expenses', () => {
  test('should return 200 status', async () => {
    const response = await request(app).get('/api/expenses');
    expect(response.status).toBe(200);
  });

  test('should return JSON array', async () => {
    const response = await request(app).get('/api/expenses');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('POST /api/expenses', () => {
  test('should create new expense with valid data', async () => {
    const expenseData = {
      description: 'Test Expense',
      amount: 25.50,
      category: 'Food'
    };
    
    const response = await request(app)
      .post('/api/expenses')
      .send(expenseData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.description).toBe('Test Expense');
    expect(parseFloat(response.body.amount)).toBe(25.50);
    expect(response.body.category).toBe('Food');
  });

  test('should reject expense with missing description', async () => {
    const expenseData = {
      amount: 25.50,
      category: 'Food'
    };
    
    const response = await request(app)
      .post('/api/expenses')
      .send(expenseData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should reject expense with invalid category', async () => {
    const expenseData = {
      description: 'Test',
      amount: 25.50,
      category: 'InvalidCategory'
    };
    
    const response = await request(app)
      .post('/api/expenses')
      .send(expenseData);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid category');
  });

  test('should reject expense with negative amount', async () => {
    const expenseData = {
      description: 'Test',
      amount: -10,
      category: 'Food'
    };
    
    const response = await request(app)
      .post('/api/expenses')
      .send(expenseData);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid amount');
  });

  test('should accept all valid categories', async () => {
    const categories = ['Food', 'Transport', 'Entertainment', 'Other'];
    
    for (const category of categories) {
      const response = await request(app)
        .post('/api/expenses')
        .send({
          description: `Test ${category}`,
          amount: 15.00,
          category: category
        });

      expect(response.status).toBe(201);
      expect(response.body.category).toBe(category);
    }
  });
});
