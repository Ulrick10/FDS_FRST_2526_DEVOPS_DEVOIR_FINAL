/**
 * Server Tests
 * Tests for Express.js server setup and basic routes
 */

const request = require('supertest');
const app = require('../src/server');

describe('Server', () => {
  test('should be defined', () => {
    expect(app).toBeDefined();
  });

  test('should have listen method', () => {
    expect(typeof app.listen).toBe('function');
  });

  test('health check endpoint returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });
});
