module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(testcontainers|@testcontainers)/)'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  maxWorkers: 1, // Prevent parallel execution issues with containers
  verbose: true,
  forceExit: true, // Ensure Jest exits after tests
  detectOpenHandles: true,
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      maxWorkers: 4, // Allow parallel execution for unit tests
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json'
        }],
      },
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      maxWorkers: 1, // Prevent parallel execution issues
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json'
        }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!(testcontainers|@testcontainers)/)'
      ],
    },
    {
      displayName: 'Container Tests',
      testMatch: ['<rootDir>/tests/containers/**/*.test.ts'],
      maxWorkers: 1, // Prevent parallel execution issues
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json'
        }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!(testcontainers|@testcontainers)/)'
      ],
    }
  ]
};
