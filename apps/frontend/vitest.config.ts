import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['**/*.{test,test.*}.?(c|m)[jt]s?(x)'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/mocks/**',
        '**/stories/**',
        '**/.vite/**',
      ],
      thresholds: {
        lines: 60,
        functions: 80,
        statements: 60,
        branches: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@hooks': '/src/hooks',
      '@components': '/src/components',
      '@context': '/src/context',
      '@contexts': '/src/contexts',
      '@services': '/src/services',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@types': '/src/types',
      '@e2e': '/src/e2e',
      '@test-setup': '/src/e2e/test-setup.ts',
      '@crypture/api-client':
        '/Users/nati-home/Projects/crypture/libs/api-client/src/index.ts',
      '@crypture/shared-types':
        '/Users/nati-home/Projects/crypture/libs/shared-types/src/index.ts',
    },
  },
});
