/**
 * Bun Test Configuration
 */
export default {
  testTimeout: 10000,
  coverage: true,
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

