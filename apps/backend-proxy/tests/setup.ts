/// <reference types="jest" />
// Load environment variables
require('dotenv').config();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.HOST = 'localhost';
process.env.CORS_ORIGIN = 'http://localhost:5173';

// Global test setup
beforeAll(() => {
  // Mock console methods to reduce noise in tests
  const originalConsole = global.console;
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  // Restore console
  const originalConsole = require('console');
  global.console = originalConsole;
});
