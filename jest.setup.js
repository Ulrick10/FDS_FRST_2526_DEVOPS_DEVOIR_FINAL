/**
 * Jest Setup File
 * Mocks database and sets up test environment
 */

process.env.NODE_ENV = 'test';

// Mock the database module
jest.mock('./src/config/database', () => {
  const { mockPool } = require('./tests/__mocks__/database');
  return {
    pool: mockPool,
    initializeDatabase: jest.fn(() => Promise.resolve(true)),
    initializeIfAvailable: jest.fn(() => Promise.resolve(true)),
    ensureDbConnection: jest.fn(() => Promise.resolve(true)),
    ensureDatabase: jest.fn(() => Promise.resolve()),
    closePool: jest.fn(() => Promise.resolve())
  };
});
