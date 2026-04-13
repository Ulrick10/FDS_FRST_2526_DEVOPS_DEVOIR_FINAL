/**
 * Database Mock for Testing
 * Provides mock implementations of database functions
 */

// Mock data
const mockExpenses = [
  {
    id: 1,
    description: 'Lunch with colleagues',
    amount: 15.50,
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date()
  },
  {
    id: 2,
    description: 'Metro ticket',
    amount: 4.00,
    category: 'Transport',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date()
  },
  {
    id: 3,
    description: 'Movie ticket',
    amount: 12.00,
    category: 'Entertainment',
    date: new Date().toISOString().split('T')[0],
    created_at: new Date()
  }
];

// Mock pool with query method
const mockPool = {
  query: jest.fn((sql, params) => {
    // Mock different queries
    if (sql.includes('CREATE TABLE')) {
      return Promise.resolve({ rows: [] });
    }
    if (sql.includes('COUNT(*)') && sql.includes('expenses')) {
      return Promise.resolve({ rows: [{ count: mockExpenses.length.toString() }] });
    }
    if (sql.includes('SUM(amount)')) {
      const total = mockExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const avg = total / mockExpenses.length;
      return Promise.resolve({
        rows: [{
          total_expenses: mockExpenses.length,
          total_amount: total.toString(),
          avg_amount: avg.toString()
        }]
      });
    }
    if (sql.includes('GROUP BY category')) {
      const categories = {};
      mockExpenses.forEach(exp => {
        if (!categories[exp.category]) {
          categories[exp.category] = { category: exp.category, count: 0, total: 0 };
        }
        categories[exp.category].count++;
        categories[exp.category].total += exp.amount;
      });
      return Promise.resolve({ rows: Object.values(categories) });
    }
    if (sql.includes('INSERT INTO expenses')) {
      const newExpense = {
        id: mockExpenses.length + 1,
        description: params[0],
        amount: params[1],
        category: params[2],
        date: new Date().toISOString().split('T')[0],
        created_at: new Date()
      };
      mockExpenses.push(newExpense);
      return Promise.resolve({ rows: [newExpense] });
    }
    if (sql.includes('SELECT * FROM expenses')) {
      return Promise.resolve({ rows: mockExpenses });
    }
    return Promise.resolve({ rows: [] });
  }),
  end: jest.fn(() => Promise.resolve())
};

module.exports = {
  mockPool,
  mockExpenses
};
