/**
 * Dashboard Route Tests
 * Tests for the main dashboard page (GET /)
 */

const request = require('supertest');
const app = require('../src/server');

describe('GET / - Dashboard', () => {
  test('should return 200 status', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('should return HTML content', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('should contain Dashboard title', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('Dashboard');
  });

  test('should display metrics cards', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('Total Expenses');
    expect(response.text).toContain('Total Amount');
    expect(response.text).toContain('Average Amount');
  });

  test('should have link to manage expenses', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('Manage Expenses');
  });
});
