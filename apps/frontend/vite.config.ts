import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@components': '/src/components',
      '@context': '/src/context',
      '@services': '/src/services',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@e2e': '/src/e2e',
      '@test-setup': '/src/e2e/test-setup.ts',
      '@types': '/src/types',
      '@assets': '/public/assets',
      '@crypture/api-client':
        '/Users/nati-home/Projects/crypture/libs/api-client/src/index.ts',
      '@crypture/shared-types':
        '/Users/nati-home/Projects/crypture/libs/shared-types/src/index.ts',
      '@crypture/utils':
        '/Users/nati-home/Projects/crypture/libs/utils/src/index.ts',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
});
